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
  proposals?: any[];
  onApproveProposal?: (id: string) => void;
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
  isDarkMode,
  proposals = [],
  onApproveProposal
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
    <div className="min-h-screen p-5 md:p-8 lg:p-12 space-y-8 md:space-y-12 bg-[#050505] text-[var(--text-main)] overflow-x-hidden">
      
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
            <div className="bento-card px-5 py-4 md:px-8 md:py-6 flex items-center gap-4 md:gap-6">
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
              { label: 'Active Proposals', value: proposals.filter(p => p.status === 'Pending').length, icon: Briefcase, color: 'text-amber-400' },
              { label: 'Faculty Nodes', value: facultyMembers.length, icon: GraduationCap, color: 'text-purple-400' },
              { label: 'Pulse Frequency', value: '4.8GHz', icon: Signal, color: 'text-rose-400' },
          ].map((stat, i) => (
              <div key={i} className="bento-card p-6 md:p-8 flex flex-col gap-3 md:gap-4 group hover:border-white/20 transition-all">
                  <div className={`p-2.5 md:p-3 w-fit rounded-[1rem] md:rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                     <stat.icon size={20} />
                  </div>
                  <div>
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{stat.label}</p>
                      <p className="text-xl md:text-3xl font-black italic mt-1">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* ─ BROADCAST ARRAY ─ */}
         <div className="lg:col-span-4 space-y-6 md:space-y-8 reveal" style={{ animationDelay: '0.2s' }}>
            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden bg-white/2 border-white/10 group">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">Genesis Pipeline</h3>
                        <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Pending unit proposals</p>
                    </div>
                    <Briefcase size={24} className="text-amber-500/40" />
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {proposals.filter(p => p.status === 'Pending').map(prop => (
                        <div key={prop.id} className="p-5 bg-white/2 border border-white/5 rounded-[1.5rem] space-y-4 hover:border-amber-500/30 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-black text-white">{prop.title}</h4>
                                    <p className="text-[9px] font-bold opacity-30 italic">By {prop.proposerName} ({prop.proposerRoll})</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${prop.type === 'Club' ? 'bg-primary/20 text-primary' : 'bg-rose-500/20 text-rose-500'}`}>{prop.type}</span>
                            </div>
                            <p className="text-[10px] font-medium opacity-50 line-clamp-2 italic">"{prop.missionStatement}"</p>
                            <div className="flex gap-2">
                                <button onClick={() => onApproveProposal?.(prop.id)} className="flex-1 h-9 bg-amber-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all">Authorize</button>
                                <button className="px-3 h-9 bg-white/5 border border-white/10 text-white/40 rounded-xl hover:text-rose-500 transition-all"><X size={14}/></button>
                            </div>
                        </div>
                    ))}
                    {proposals.filter(p => p.status === 'Pending').length === 0 && (
                        <div className="py-10 text-center opacity-20">
                            <Signal size={32} className="mx-auto mb-2" />
                            <p className="text-[8px] font-black uppercase tracking-widest">No Active Proposals</p>
                        </div>
                    )}
                </div>
            </div>

            <button onClick={() => setIsFacultyModalOpen(true)}
                    className="w-full bento-card p-6 md:p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-all bg-white/2 border-white/10">
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="p-3 md:p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] md:rounded-[2rem]"><GraduationCap size={24} className="md:w-8 md:h-8" /></div>
                  <div className="text-left">
                     <h4 className="text-lg md:text-xl font-black tracking-tight">Faculty Registry</h4>
                     <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Manage Institutional Nodes</p>
                  </div>
               </div>
               <BarChart3 className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </button>
         </div>           {/* ─ UNIT MATRIX ─ */}
         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 reveal" style={{ animationDelay: '0.3s' }}>
            {clubs.map((club, i) => {
               const president = allUsers.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
               return (
                  <div key={club.id} className="bento-card p-6 md:p-10 flex flex-col gap-6 md:gap-10 group relative overflow-hidden bg-white/2 border-white/5">
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-all">
                        <Hexagon size={120} style={{ color: club.themeColor }} />
                     </div>
                     
                     <div className="flex justify-between items-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-2xl" 
                             style={{ backgroundColor: club.themeColor }}>
                           {club.name[0]}
                        </div>
                        <div className={`px-3 md:px-4 py-1.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] border ${club.isFrozen ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                           {club.isFrozen ? 'Registry Static' : 'Node Live'}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <h4 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic line-clamp-1">{club.name}</h4>
                        <p className="text-[8px] md:text-[10px] font-mono opacity-30 tracking-widest truncate">{club.subdomain}</p>
                     </div>

                     <div className="grid grid-cols-1 gap-3 md:gap-4">
                        <div className="flex items-center gap-4 md:gap-5 p-3 md:p-4 bg-white/2 border border-white/5 rounded-xl md:rounded-2xl group-hover:border-white/10 transition-all">
                           <div className="p-2 md:p-2.5 bg-amber-500/10 text-amber-500 rounded-lg md:rounded-xl"><Crown size={16} /></div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-30">Authority</p>
                              <p className="text-xs md:text-sm font-bold truncate">{president ? president.name : 'VACANT_ID'}</p>
                           </div>
                           <button onClick={() => { setSelectedClub(club); setIsAppointModalOpen(true); }}
                                   className="p-2 md:p-3 bg-white/5 hover:bg-primary hover:text-white rounded-lg md:rounded-xl transition-all">
                              <UserPlus size={14}/>
                           </button>
                        </div>
                        <div className="flex items-center gap-4 md:gap-5 p-3 md:p-4 bg-white/2 border border-white/5 rounded-xl md:rounded-2xl group-hover:border-white/10 transition-all">
                           <div className="p-2 md:p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg md:rounded-xl"><GraduationCap size={16} /></div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-30">Overseer</p>
                              <p className="text-xs md:text-sm font-bold truncate">{club.facultyCoordinatorNames?.[0] || 'UNASSIGNED'}</p>
                           </div>
                           <button onClick={() => { setSelectedClub(club); setIsFacultyAssignModalOpen(true); }}
                                   className="p-2 md:p-3 bg-white/5 hover:bg-emerald-500 hover:text-white rounded-lg md:rounded-xl transition-all">
                              <Briefcase size={14}/>
                           </button>
                        </div>
                     </div>

                     <div className="mt-auto pt-4 md:pt-6 flex gap-3 md:gap-4">
                        <button onClick={() => onEnterClub(club.id)}
                                className="flex-1 h-12 md:h-14 bg-white text-black rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                           Uplink
                        </button>
                        <button onClick={() => onFreeze(club.id)}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${club.isFrozen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'}`}>
                           {club.isFrozen ? <Check size={20}/> : <Snowflake size={20}/>}
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>


      {/* ─ MODALS ─ */}
      {isAppointModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
              <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-6 md:space-y-10 my-auto animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Appoint Authority</h3>
                     <button onClick={() => setIsAppointModalOpen(false)} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={20}/></button>
                  </div>
                  <div className="relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                      <input placeholder="Search Ledger Index..." value={appointSearch} onChange={e => setAppointSearch(e.target.value)}
                             className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl pl-16 pr-8 font-black text-sm md:text-xl outline-none focus:border-primary/50 transition-all text-white" />
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
         <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-8 md:space-y-12 my-auto animate-in zoom-in-95 duration-300 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Institutional Registry</h3>
                  <button onClick={() => setIsFacultyModalOpen(false)} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={20}/></button>
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
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
              <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-6 md:space-y-12 my-auto animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Unit Orchestration</h3>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={20}/></button>
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
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
              <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-6 md:space-y-10 my-auto animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Assign Oversight</h3>
                     <button onClick={() => setIsFacultyAssignModalOpen(false)} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={20}/></button>
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
