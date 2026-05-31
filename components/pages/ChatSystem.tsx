import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Club, Message, Role, PollOption } from '../../types';
import { db } from '../../db';
import { io, Socket } from 'socket.io-client';
import { pushNotificationService } from '../../lib/PushNotificationService';
import {
    Send,
    Search,
    MoreVertical,
    Paperclip,
    CheckCheck,
    Check,
    Phone,
    Video,
    ArrowLeft,
    Users,
    Camera,
    Mic,
    Plus,
    Image as ImageIcon,
    MapPin,
    BarChart2,
    X,
    MessageSquare,
    Lock,
    Signal,
    Zap,
    Hexagon,
    Fingerprint,
    Cpu,
    Globe2,
    Loader2
} from 'lucide-react';

interface Props {
    user: User;
    clubs: Club[];
    allUsers: User[];
    activeContext?: string;
    isDarkMode: boolean;
}

const ChatSystem: React.FC<Props> = ({ user, clubs, allUsers, activeContext, isDarkMode }) => {
    const [activeChannel, setActiveChannel] = useState<{ type: 'club' | 'dm', id: string, name: string, image?: string, color?: string, subtitle?: string, isOnline?: boolean, lastSeen?: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showPollModal, setShowPollModal] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [socket, setSocket] = useState<Socket | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        pushNotificationService.requestPermission().catch(console.log);
    }, []);

    const allowedClubs = useMemo(() => {
        // Institutional access protocol: Show all club channels to every authenticated member
        return clubs;
    }, [clubs]);

    const allowedUsers = useMemo(() => {
        if (user.globalRole !== Role.STUDENT) return allUsers.filter(u => u.id !== user.id);
        const myClubIds = user.clubMemberships.map(m => m.clubId);
        return allUsers.filter(u => {
            if (u.id === user.id) return false;
            if (u.globalRole !== Role.STUDENT) return true;
            const theirClubIds = u.clubMemberships.map(m => m.clubId);
            return myClubIds.some(id => theirClubIds.includes(id));
        });
    }, [allUsers, user]);

    useEffect(() => {
        if (activeContext && activeContext !== 'Global') {
            const club = allowedClubs.find(c => c.id === activeContext);
            if (club) setActiveChannel({ type: 'club', id: club.id, name: club.name, color: club.themeColor, subtitle: `${club.category} Council` });
        }
    }, [activeContext, allowedClubs]);

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);
        newSocket.on('connect', () => newSocket.emit('join', user.id));
        newSocket.on('receive_message', (msg: Message) => {
            const channelId = msg.clubId || msg.senderId;
            if (activeChannel && (msg.clubId === activeChannel.id || msg.senderId === activeChannel.id)) {
                setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
            } else {
                setUnreadCounts(prev => ({ ...prev, [channelId]: (prev[channelId] || 0) + 1 }));
            }
            if (pushNotificationService.isNotificationEnabled() && msg.senderId !== user.id) {
                pushNotificationService.notifyMessage(msg.senderName, msg.content);
            }
        });
        newSocket.on('user_typing', ({ userId, isTyping }) => setTypingUsers(prev => ({ ...prev, [userId]: isTyping })));
        return () => { newSocket.disconnect(); };
    }, [user.id, activeChannel]);

    useEffect(() => {
        if (socket && activeChannel) {
            const room = activeChannel.type === 'club' ? activeChannel.id : [user.id, activeChannel.id].sort().join('_');
            socket.emit('join', room);
            setUnreadCounts(prev => ({ ...prev, [activeChannel.id]: 0 }));
        }
    }, [socket, activeChannel, user.id]);

    useEffect(() => {
        if (!activeChannel) return;
        const fetchMessages = async () => {
            const msgs = await db.getMessages(activeChannel.type === 'club' ? activeChannel.id : undefined, user.id, activeChannel.type === 'dm' ? activeChannel.id : undefined);
            setMessages(msgs);
        };
        fetchMessages();
    }, [activeChannel, user.id]);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = async (type: Message['type'] = 'text', content?: string, extraData?: any) => {
        if (!activeChannel || (type === 'text' && !input.trim())) return;
        const msgContent = type === 'text' ? input : content;
        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            content: msgContent,
            timestamp: new Date().toISOString(),
            type: type,
            status: 'sent',
            clubId: activeChannel.type === 'club' ? activeChannel.id : undefined,
            recipientId: activeChannel.type === 'dm' ? activeChannel.id : undefined,
            ...extraData
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setShowAttachMenu(false);
        setShowPollModal(false);
        if (socket) socket.emit('send_message', newMsg);
        await db.sendMessage(newMsg);

        // DEMO: Auto-reply effect
        if (activeChannel.type === 'dm') {
          setTimeout(() => {
            setTypingUsers(prev => ({ ...prev, [activeChannel.id]: true }));
            setTimeout(async () => {
              setTypingUsers(prev => ({ ...prev, [activeChannel.id]: false }));
              const reply: Message = {
                id: `msg-${Date.now() + 1}`,
                senderId: activeChannel.id,
                senderName: activeChannel.name,
                content: `Copy that! I am reviewing the data package regarding "${msgContent?.slice(0, 20)}". Synchronizing node status...`,
                timestamp: new Date().toISOString(),
                type: 'text',
                status: 'read',
                recipientId: user.id
              };
              setMessages(prev => [...prev, reply]);
              db.sendMessage(reply);
            }, 2500);
          }, 800);
        } else if (activeChannel.type === 'club') {
          // Club reply simulation
          const admin = allUsers.find(u => u.clubMemberships.some(m => m.clubId === activeChannel.id && m.role === 'President')) || allUsers[0];
          setTimeout(() => {
            setTypingUsers(prev => ({ ...prev, [admin.id]: true }));
            setTimeout(async () => {
              setTypingUsers(prev => ({ ...prev, [admin.id]: false }));
              const reply: Message = {
                id: `msg-${Date.now() + 1}`,
                senderId: admin.id,
                senderName: admin.name,
                content: `Acknowledged, ${user.name.split(' ')[0]}. Institutional uplink remains active.`,
                timestamp: new Date().toISOString(),
                type: 'text',
                status: 'read',
                clubId: activeChannel.id
              };
              setMessages(prev => [...prev, reply]);
              db.sendMessage(reply);
            }, 3000);
          }, 1200);
        }
    };

    const filteredClubs = allowedClubs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const filteredUsers = allowedUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={`flex h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] overflow-hidden ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8f9fa] text-slate-900'} font-sans`}>
            
            {/* ─ SIDEBAR ─ */}
            <div className={`w-full md:w-[450px] flex flex-col border-r absolute md:relative inset-0 z-50 transition-all duration-500 ${isDarkMode ? 'border-white/5 bg-white/10' : 'border-slate-200 bg-white/10'} ${activeChannel ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-[1000] tracking-tighter uppercase italic leading-none">Channels</h1>
                        <div className="flex gap-4">
                            <button className={`p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/10 border-white/5 hover:bg-white/10' : 'bg-white/40 border-slate-200 hover:bg-slate-50 shadow-sm'}`}><Hexagon size={20}/></button>
                            <button className={`p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/10 border-white/5 hover:bg-white/10' : 'bg-white/40 border-slate-200 hover:bg-slate-50 shadow-sm'}`}><Cpu size={20}/></button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-primary' : 'text-slate-400'}`} size={20} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Ledger..." className={`w-full h-16 rounded-2xl pl-16 pr-8 font-black text-xs uppercase tracking-widest outline-none focus:border-primary/50 transition-all ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white/40 border border-slate-200 shadow-sm'}`} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-10">
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Active Units</div>
                    {filteredClubs.map(club => (
                        <div key={club.id} onClick={() => setActiveChannel({ type: 'club', id: club.id, name: club.name, color: club.themeColor, subtitle: `${club.category} Council` })}
                             className={`p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-5 group 
                                ${activeChannel?.id === club.id ? 'bg-primary/10 border-primary/40' : 'bg-white/10 border-white/5 hover:bg-white/10'}`}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl" style={{ backgroundColor: club.themeColor }}>{club.name[0]}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-lg tracking-tight truncate uppercase italic">{club.name}</h3>
                                    {unreadCounts[club.id] > 0 && <span className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary"></span>}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">Status: Synchronized</p>
                            </div>
                        </div>
                    ))}

                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mt-8">Personnel</div>
                    {filteredUsers.map(u => (
                        <div key={u.id} onClick={() => setActiveChannel({ type: 'dm', id: u.id, name: u.name, image: u.photoUrl, subtitle: u.globalRole, isOnline: u.isOnline, lastSeen: u.lastSeen })}
                             className={`p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-5 group 
                                ${activeChannel?.id === u.id ? 'bg-primary/10 border-primary/40' : (isDarkMode ? 'bg-white/10 border-white/5 hover:bg-white/10' : 'bg-white/40 border-slate-200 hover:border-primary/30 shadow-sm')}`}>
                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                {u.photoUrl ? <img src={u.photoUrl} className="w-full h-full object-cover" /> : <div className="text-primary font-black text-xl">{u.name[0]}</div>}
                                {u.isOnline && <span className="absolute bottom-1 right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#050505]"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-black text-lg tracking-tight truncate ${!isDarkMode && 'text-slate-900'}`}>{u.name}</h3>
                                    {unreadCounts[u.id] > 0 && <span className="h-5 w-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg">!</span>}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">{typingUsers[u.id] ? <span className="text-primary animate-pulse italic">Uplink established...</span> : (u.isOnline ? 'Active Session' : 'Offline')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─ CHAT VIEW ─ */}
            <div className={`flex-1 flex flex-col relative transition-all duration-500 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#f8f9fa]'} ${!activeChannel ? 'hidden md:flex' : 'flex'}`}>
                {activeChannel ? (
                    <>
                        {/* Header */}
                        <div className={`h-24 px-5 md:px-8 border-b flex items-center justify-between z-40 ${isDarkMode ? 'border-white/5 bg-white/10 backdrop-blur-3xl' : 'border-slate-200 bg-white/10 backdrop-blur-xl'}`}>
                            <div className="flex items-center gap-6">
                                <button onClick={() => setActiveChannel(null)} className="md:hidden p-3 bg-white/10 border border-white/10 rounded-2xl text-white"><ArrowLeft size={20}/></button>
                                <div className="flex items-center gap-5">
                                    {activeChannel.type === 'club' ? (
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl" style={{ backgroundColor: activeChannel.color }}>{activeChannel.name[0]}</div>
                                    ) : (
                                        <div className={`w-14 h-14 rounded-2xl border overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            {activeChannel.image ? <img src={activeChannel.image} className="w-full h-full object-cover" /> : <div className="text-primary font-black text-2xl">{activeChannel.name[0]}</div>}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${!isDarkMode && 'text-slate-900'}`}>{activeChannel.name}</h2>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2 ${isDarkMode ? 'text-primary' : 'text-blue-600'}`}>
                                            {Object.values(typingUsers).some(v => v) ? (
                                                <span className="flex items-center gap-2 animate-pulse">
                                                    <Loader2 size={12} className="animate-spin" /> Synchronizing Uplink...
                                                </span>
                                            ) : (
                                                <>
                                                    <Signal size={12} className={activeChannel.isOnline ? 'animate-pulse' : ''}/> {activeChannel.isOnline ? 'Signal Active' : 'Relay Passive'}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:flex gap-4">
                               <button className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-white/10 border border-white/10 text-white hover:bg-white/10' : 'bg-white/40 border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}><Video size={20}/></button>
                               <button className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-white/10 border border-white/10 text-white hover:bg-white/10' : 'bg-white/40 border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}><Phone size={20}/></button>
                               <button className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-white/10 border border-white/10 text-white hover:bg-white/10' : 'bg-white/40 border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}><MoreVertical size={20}/></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar bg-dots" ref={scrollRef}>
                           <div className="flex justify-center mb-10">
                              <div className={`px-6 py-2 border rounded-full text-[10px] font-black uppercase tracking-[0.4em] opacity-50 flex items-center gap-3 ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-slate-200 border-slate-300 text-slate-700'}`}>
                                 <Lock size={12}/> Encrypted Node Terminal
                              </div>
                           </div>
                           {messages.map((msg, i) => {
                               const isMe = msg.senderId === user.id;
                               const showHeader = i === 0 || messages[i - 1].senderId !== msg.senderId;
                               return (
                                   <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} reveal`}>
                                       {showHeader && activeChannel.type === 'club' && !isMe && <span className={`text-[10px] font-black uppercase tracking-widest ml-4 mb-2 ${isDarkMode ? 'text-primary' : 'text-blue-600'}`}>{msg.senderName}</span>}
                                       <div className={`relative max-w-[70%] lg:max-w-[50%] p-6 rounded-[2rem] shadow-3xl group ${isMe ? 'bg-primary text-white rounded-tr-none' : (isDarkMode ? 'bg-white/10 border border-white/10 text-white rounded-tl-none' : 'bg-white/40 border border-slate-200 text-slate-900 rounded-tl-none')}`}>
                                           {msg.type === 'text' && <p className="text-md font-medium leading-relaxed italic">"{msg.content}"</p>}
                                           {msg.type === 'image' && <img src={msg.mediaUrl} className="rounded-2xl w-full object-cover max-h-96" />}
                                           {msg.type === 'poll' && (
                                              <div className="space-y-4">
                                                 <h4 className="font-black text-lg tracking-tight uppercase italic">{msg.pollQuestion}</h4>
                                                 <div className="space-y-2">
                                                    {msg.pollOptions?.map(opt => (
                                                       <div key={opt.id} className={`relative h-12 border rounded-xl overflow-hidden flex items-center px-4 cursor-pointer transition-all ${isDarkMode ? 'bg-white/10 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                                          <span className="relative z-10 text-[10px] font-black uppercase tracking-widest">{opt.text}</span>
                                                       </div>
                                                    ))}
                                                 </div>
                                              </div>
                                           )}
                                           <div className={`mt-4 flex items-center gap-2 text-[8px] font-black opacity-40 uppercase tracking-widest ${isMe ? 'text-white' : (isDarkMode ? 'text-primary' : 'text-slate-500')}`}>
                                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                              {isMe && <CheckCheck size={12}/>}
                                           </div>
                                       </div>
                                   </div>
                               );
                           })}
                        </div>

                        {/* Input Area */}
                        <div className={`p-5 md:p-8 border-t relative z-50 ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-white/10 border-slate-200 backdrop-blur-xl'}`}>
                           {showAttachMenu && (
                               <div className="absolute bottom-28 left-8 p-6 bento-card flex gap-6 animate-in slide-in-from-bottom-6 duration-300">
                                  <button onClick={() => { fileInputRef.current?.click(); }} className="flex flex-col items-center gap-2 group">
                                     <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-all"><ImageIcon size={24}/></div>
                                     <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Static</span>
                                  </button>
                                  <button onClick={() => setShowPollModal(true)} className="flex flex-col items-center gap-2 group">
                                     <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-all"><BarChart2 size={24}/></div>
                                     <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Index</span>
                                  </button>
                                  <button onClick={() => {}} className="flex flex-col items-center gap-2 group">
                                     <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-all"><MapPin size={24}/></div>
                                     <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Node</span>
                                  </button>
                               </div>
                           )}
                           <div className="max-w-7xl mx-auto flex items-center gap-6">
                              <button onClick={() => setShowAttachMenu(!showAttachMenu)} className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${showAttachMenu ? 'bg-primary text-white rotate-45' : (isDarkMode ? 'bg-white/10 border border-white/10 text-white' : 'bg-white/40 border border-slate-200 text-slate-500 shadow-sm')}`}><Plus size={32}/></button>
                              <form onSubmit={e => { e.preventDefault(); handleSend('text'); }} className={`flex-1 h-16 rounded-3xl flex items-center px-8 gap-6 group transition-all ${isDarkMode ? 'bg-white/10 border border-white/10 focus-within:border-primary/50' : 'bg-white/40 border border-slate-200 shadow-sm focus-within:border-primary'}`}>
                                 <input value={input} onChange={e => setInput(e.target.value)} placeholder="Establish Uplink Signal..." className={`flex-1 bg-transparent border-none outline-none font-black text-xs uppercase tracking-[0.2em] ${isDarkMode ? 'text-white placeholder-white/10' : 'text-slate-900 placeholder-slate-400'}`} />
                                 <button type="submit" className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${input.trim() ? 'bg-primary text-white shadow-xl shadow-primary/30' : (isDarkMode ? 'text-white/20' : 'text-slate-300')}`}><Send size={24}/></button>
                              </form>
                           </div>
                        </div>

                        {/* Poll Modal */}
                        {showPollModal && (
                           <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-8">
                              <div className={`relative w-full max-w-md bento-card p-12 space-y-10 animate-in zoom-in-95 duration-300 ${!isDarkMode && 'bg-white'}`}>
                                 <div className="flex justify-between items-center">
                                    <h3 className={`text-3xl font-[1000] tracking-tighter uppercase italic ${!isDarkMode && 'text-slate-900'}`}>Index Poll</h3>
                                    <button onClick={() => setShowPollModal(false)} className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}><X size={24}/></button>
                                 </div>
                                 <input placeholder="Index Question?" className={`w-full h-18 border rounded-2xl px-6 font-black text-lg ${isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                                 <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em]">Transmit Poll</button>
                              </div>
                           </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-10 opacity-30">
                        <div className={`p-10 border border-dashed rounded-full animate-pulse-slow ${isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-200 border-slate-400 text-slate-800'}`}><Globe2 size={120}/></div>
                        <div className="space-y-4">
                           <h2 className="text-6xl font-black tracking-[-0.05em] uppercase italic">Central <br/><span className="text-gradient">Communication</span></h2>
                           <p className="text-[10px] font-black uppercase tracking-[0.6em]">Establish Node Uplink to begin transmission</p>
                        </div>
                        <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest opacity-40"><Fingerprint size={16}/> MITS_SECURE_V2.8</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSystem;