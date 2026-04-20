import React, { useState } from 'react';
import { Club, User, Role, ClubRole, Notification } from '../../types';
import { db } from '../../db';
import { 
  Snowflake, 
  Check, 
  Plus, 
  X, 
  UserPlus, 
  Zap,
  Crown,
  Search,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Radio,
  Globe2,
  Signal,
  Hexagon,
  Fingerprint,
  Activity,
  BarChart3
} from 'lucide-react';

interface Props {
  clubs: Club[];
  allUsers: User[];
  onFreeze: (id: string) => void;
  onEnterClub: (id: string) => void;
  onAddClub: (club: Club) => void;
  onAppointPresident: (clubId: string, studentId: string) => void;
  onAssignFaculty: (clubId: string, faculty: User) => void;
  onAddUser?: (user: User) => void;
  isDarkMode: boolean;
}

const SuperAdminHub: React.FC<Props> = ({ 
  clubs, 
  allUsers, 
  onFreeze, 
  onEnterClub, 
  onAddClub, 
  onAppointPresident, 
  onAssignFaculty,
  onAddUser,
  isDarkMode 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointModalOpen, setIsAppointModalOpen] = useState(false);
  const [isFacultyAssignModalOpen, setIsFacultyAssignModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [appointSearch, setAppointSearch] = useState('');
  const [facultyAssignSearch, setFacultyAssignSearch] = useState('');

  const [broadcast, setBroadcast] = useState({ title: '', message: '', type: 'info' as Notification['type'] });

  const [newClubData, setNewClubData] = useState({
    name: '',
    category: 'Technical' as Club['category'],
    themeColor: '#2563eb',
    tagline: ''
  });

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    department: ''
  });

  const students = allUsers.filter(u => u.globalRole === Role.STUDENT);
  const facultyMembers = allUsers.filter(u => u.globalRole === Role.FACULTY);
  
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(appointSearch.toLowerCase()) || 
    (s.enrollmentNumber || '').toLowerCase().includes(appointSearch.toLowerCase())
  );

  const filteredFacultyForAssign = facultyMembers.filter(f => 
    f.name.toLowerCase().includes(facultyAssignSearch.toLowerCase()) ||
    f.email.toLowerCase().includes(facultyAssignSearch.toLowerCase())
  );

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    const club: Club = {
      id: `club-${Date.now()}`,
      name: newClubData.name,
      category: newClubData.category,
      themeColor: newClubData.themeColor,
      subdomain: `${newClubData.name.toLowerCase().replace(/\s+/g, '')}.mitsgwl.ac.in`,
      leadership: {},
      facultyCoordinatorId: '',
      tagline: newClubData.tagline,
      recruitmentActive: false
    };
    onAddClub(club);
    setIsModalOpen(false);
    setNewClubData({ name: '', category: 'Technical', themeColor: '#2563eb', tagline: '' });
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddUser) {
      const user: User = {
        id: `faculty-${Date.now()}`,
        name: newFaculty.name,
        email: newFaculty.email,
        globalRole: Role.FACULTY,
        clubMemberships: [],
        branch: newFaculty.department,
        password: 'MITS_FACULTY_' + Math.random().toString(36).slice(-6).toUpperCase()
      };
      onAddUser(user);
      setNewFaculty({ name: '', email: '', department: '' });
      alert(`Success: Faculty ${user.name} added to institutional registry.`);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const notif: Notification = {
        id: `sys-broadcast-${Date.now()}`,
        title: broadcast.title,
        message: broadcast.message,
        type: broadcast.type,
        timestamp: new Date().toISOString(),
        read: false,
        senderName: 'MITS Administration'
    };
    await db.sendNotification(notif);
    alert("System Broadcast Sent Successfully");
    setBroadcast({ title: '', message: '', type: 'info' });
  };

  return (
    <div className="min-h-screen p-8 lg:p-12 space-y-12 bg-[#050505] text-[var(--text-main)] overflow-x-hidden">
      
      {/* ─ INSTITUTIONAL TERMINAL HEADER ─ */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 reveal">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
               <Fingerprint size={14} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authority Confirmed</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-[-0.05em] uppercase italic leading-none">Institutional <br/><span className="text-gradient">Hub</span></h1>
            <p className="text-sm font-medium opacity-50 max-w-md">Orchestrating the evolution of student organizations across the MITS ecosystem.</p>
         </div>

         <div className="flex flex-wrap gap-4">
            <div className="bento-card px-8 py-6 flex items-center gap-6">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Activity size={24} /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Load Balance</p>
                  <p className="text-2xl font-black italic">94.2%</p>
               </div>
            </div>
            <button onClick={() => setIsModalOpen(true)}
                    className="h-20 px-10 bg-white text-black rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] shadow-3xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
               <Plus size={20} /> Register Unit
            </button>
         </div>
      </header>

      {/* ─ ANALYTICS STRIP ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal" style={{ animationDelay: '0.1s' }}>
          {[
              { label: 'Total Units', value: clubs.length, icon: Hexagon, color: 'text-blue-400' },
              { label: 'Human Assets', value: allUsers.length, icon: ShieldCheck, color: 'text-emerald-400' },
              { label: 'Faculty Nodes', value: facultyMembers.length, icon: GraduationCap, color: 'text-purple-400' },
              { label: 'Pulse Frequency', value: '4.8GHz', icon: Signal, color: 'text-rose-400' },
          ].map((stat, i) => (
              <div key={i} className="bento-card p-8 flex flex-col gap-4 group hover:border-white/20 transition-all">
                  <div className={`p-3 w-fit rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                     <stat.icon size={24} />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{stat.label}</p>
                      <p className="text-3xl font-black italic mt-1">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* ─ BROADCAST ARRAY ─ */}
         <div className="lg:col-span-4 space-y-8 reveal" style={{ animationDelay: '0.2s' }}>
            <div className="bento-card p-10 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                  <Radio size={120} className="text-rose-500" />
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-3 text-rose-500">
                     <Signal size={20} className="animate-pulse" />
                     <h2 className="text-xs font-black uppercase tracking-[0.4em]">Signal Array</h2>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">Broadcast</h3>
               </div>

               <form onSubmit={handleBroadcast} className="space-y-6">
                  <input required placeholder="Transmission Title" value={broadcast.title} onChange={e => setBroadcast({...broadcast, title: e.target.value})}
                         className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-sm outline-none focus:border-rose-500/50 transition-all" />
                  <textarea required placeholder="Payload Message" value={broadcast.message} onChange={e => setBroadcast({...broadcast, message: e.target.value})}
                         className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 font-medium text-sm outline-none focus:border-rose-500/50 transition-all resize-none" />
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <div className="flex gap-3">
                        {['info', 'warning', 'error', 'success'].map((t) => (
                           <button key={t} type="button" onClick={() => setBroadcast({...broadcast, type: t as any})}
                                   className={`h-8 w-8 rounded-full border-2 ${broadcast.type === t ? 'border-white scale-110' : 'border-transparent opacity-40'} ${
                                       t === 'info' ? 'bg-blue-500' : t === 'warning' ? 'bg-amber-500' : t === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
                                   } transition-all`} />
                        ))}
                     </div>
                     <button type="submit" className="h-14 px-8 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all">
                        Transmit
                     </button>
                  </div>
               </form>
            </div>

            <button onClick={() => setIsFacultyModalOpen(true)}
                    className="w-full bento-card p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[2rem]"><GraduationCap size={32} /></div>
                  <div className="text-left">
                     <h4 className="text-xl font-black tracking-tight">Faculty Registry</h4>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Manage Institutional Nodes</p>
                  </div>
               </div>
               <BarChart3 className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </button>
         </div>

         {/* ─ UNIT MATRIX ─ */}
         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 reveal" style={{ animationDelay: '0.3s' }}>
            {clubs.map((club, i) => {
               const president = allUsers.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
               return (
                  <div key={club.id} className="bento-card p-10 flex flex-col gap-10 group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-all">
                        <Hexagon size={120} style={{ color: club.themeColor }} />
                     </div>
                     
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl" 
                             style={{ backgroundColor: club.themeColor }}>
                           {club.name[0]}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] border ${club.isFrozen ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                           {club.isFrozen ? 'Registry Static' : 'Node Live'}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <h4 className="text-3xl font-black tracking-tighter uppercase italic">{club.name}</h4>
                        <p className="text-[10px] font-mono opacity-30 tracking-widest">{club.subdomain}</p>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-5 p-4 bg-white/2 border border-white/5 rounded-2xl group-hover:border-white/10 transition-all">
                           <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl"><Crown size={18} /></div>
                           <div className="flex-1">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Chief Authority</p>
                              <p className="text-sm font-bold truncate">{president ? president.name : 'VACANT_ID'}</p>
                           </div>
                           <button onClick={() => { setSelectedClub(club); setIsAppointModalOpen(true); }}
                                   className="p-3 bg-white/5 hover:bg-primary hover:text-white rounded-xl transition-all">
                              <UserPlus size={16}/>
                           </button>
                        </div>
                        <div className="flex items-center gap-5 p-4 bg-white/2 border border-white/5 rounded-2xl group-hover:border-white/10 transition-all">
                           <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl"><GraduationCap size={18} /></div>
                           <div className="flex-1">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Faculty Overseer</p>
                              <p className="text-sm font-bold truncate">{club.facultyCoordinatorNames?.[0] || 'UNASSIGNED'}</p>
                           </div>
                           <button onClick={() => { setSelectedClub(club); setIsFacultyAssignModalOpen(true); }}
                                   className="p-3 bg-white/5 hover:bg-emerald-500 hover:text-white rounded-xl transition-all">
                              <Briefcase size={16}/>
                           </button>
                        </div>
                     </div>

                     <div className="mt-auto pt-6 flex gap-4">
                        <button onClick={() => onEnterClub(club.id)}
                                className="flex-1 h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                           Uplink Terminal
                        </button>
                        <button onClick={() => onFreeze(club.id)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${club.isFrozen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'}`}>
                           {club.isFrozen ? <Check size={24}/> : <Snowflake size={24}/>}
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* ─ MODALS ─ */}
      {isAppointModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8">
              <div className="relative w-full max-w-2xl bento-card p-12 space-y-10 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-4xl font-black tracking-tighter uppercase italic">Appoint Authority</h3>
                     <button onClick={() => setIsAppointModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={24}/></button>
                  </div>
                  <div className="relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
                      <input placeholder="Search Ledger Index..." value={appointSearch} onChange={e => setAppointSearch(e.target.value)}
                             className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 font-black text-xl outline-none focus:border-primary/50 transition-all" />
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar pr-4">
                      {filteredStudents.map(student => (
                          <div key={student.id} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-primary/50 transition-all">
                              <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">{student.name[0]}</div>
                                  <div>
                                     <h5 className="text-lg font-black tracking-tight">{student.name}</h5>
                                     <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{student.enrollmentNumber}</p>
                                  </div>
                              </div>
                              <button onClick={() => { onAppointPresident(selectedClub!.id, student.id); setIsAppointModalOpen(false); }}
                                      className="px-8 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                  Appoint
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Faculty Modal */}
      {isFacultyModalOpen && (
         <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8">
            <div className="relative w-full max-w-5xl bento-card p-12 space-y-12 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center">
                  <h3 className="text-4xl font-black tracking-tighter uppercase italic">Institutional Registry</h3>
                  <button onClick={() => setIsFacultyModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={24}/></button>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Add New Entry</h4>
                     <form onSubmit={handleCreateFaculty} className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Authorized Name</label>
                           <input required placeholder="Dr. Identity" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})}
                                  className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Credential Email</label>
                           <input required placeholder="node@mitsgwl.ac.in" value={newFaculty.email} onChange={e => setNewFaculty({...newFaculty, email: e.target.value})}
                                  className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none focus:border-emerald-500/50" />
                        </div>
                        <button className="w-full h-20 bg-emerald-600 text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-600/20">Issue Protocol</button>
                     </form>
                  </div>
                  <div className="space-y-10">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Active Registry</h4>
                     <div className="max-h-[400px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                        {facultyMembers.map(fac => (
                           <div key={fac.id} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black">{fac.name[0]}</div>
                                 <div>
                                    <p className="text-md font-black italic">{fac.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{fac.branch}</p>
                                 </div>
                              </div>
                              <div className="text-[10px] font-mono opacity-20">{fac.email}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {isModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8">
              <div className="relative w-full max-w-2xl bento-card p-12 space-y-12 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-4xl font-black tracking-tighter uppercase italic">Unit Orchestration</h3>
                     <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleCreateClub} className="space-y-10">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Unit Designation</label>
                         <input required placeholder="Project Name" value={newClubData.name} onChange={e => setNewClubData({...newClubData, name: e.target.value})}
                                className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-8 font-black text-xl outline-none focus:border-primary/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Category Array</label>
                            <select value={newClubData.category} onChange={e => setNewClubData({...newClubData, category: e.target.value as any})}
                                    className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl px-6 font-black outline-none appearance-none">
                               <option value="Technical">Technical</option>
                               <option value="Cultural">Cultural</option>
                               <option value="Social">Social</option>
                               <option value="Sports">Sports</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Identity Core</label>
                            <input type="color" value={newClubData.themeColor} onChange={e => setNewClubData({...newClubData, themeColor: e.target.value})}
                                   className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl px-6 cursor-pointer" />
                         </div>
                      </div>
                      <button type="submit" className="w-full h-24 bg-white text-black rounded-[3rem] font-black text-[14px] uppercase tracking-[0.5em] shadow-4xl hover:scale-105 active:scale-95 transition-all">
                         Initialize Node
                      </button>
                  </form>
              </div>
          </div>
      )}

      {isFacultyAssignModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8">
              <div className="relative w-full max-w-2xl bento-card p-12 space-y-10 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-4xl font-black tracking-tighter uppercase italic">Assign Oversight</h3>
                     <button onClick={() => setIsFacultyAssignModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={24}/></button>
                  </div>
                  <div className="relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400" size={24} />
                      <input placeholder="Search Personnel Registry..." value={facultyAssignSearch} onChange={e => setFacultyAssignSearch(e.target.value)}
                             className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 font-black text-xl outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar pr-4">
                      {filteredFacultyForAssign.map(fac => (
                          <div key={fac.id} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-emerald-500/50 transition-all">
                              <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-xl">{fac.name[0]}</div>
                                  <div>
                                     <h5 className="text-lg font-black tracking-tight">{fac.name}</h5>
                                     <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{fac.branch || 'Coordinator'}</p>
                                  </div>
                              </div>
                              <button onClick={() => { onAssignFaculty(selectedClub!.id, fac); setIsFacultyAssignModalOpen(false); }}
                                      className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
                                  Assign
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SuperAdminHub;
