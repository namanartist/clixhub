import React, { useState } from 'react';
import { User, ClubRole, Role, Applicant } from '../../types';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  ShieldCheck,
  Filter,
  X,
  Linkedin,
  Github,
  Award,
  Zap,
  Briefcase,
  Layers,
  Sparkles,
  Fingerprint,
  Users
} from 'lucide-react';

interface Props {
  clubId: string;
  clubName: string;
  isDarkMode: boolean;
  clubRole: ClubRole | null;
  allUsers: User[];
  onUpdateUser: (user: User) => void;
  applicants: Applicant[];
  onAddMember?: () => void;
}

const ClubMembers: React.FC<Props> = ({ 
  clubId, 
  clubName, 
  isDarkMode, 
  clubRole, 
  allUsers, 
  onUpdateUser,
  applicants,
  onAddMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const clubMembers = allUsers.filter(u => u.clubMemberships.some(m => m.clubId === clubId));
  const filteredMembers = clubMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.enrollmentNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-10 md:space-y-14 relative z-10">
      
      {/* Search & Control Layer */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                 <Users size={18} />
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Personnel Directory</span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tighter font-display leading-none ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                Team Council <span className="text-blue-600">({filteredMembers.length})</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-md">
                Managing high-clearance operative roles and roster for {clubName}.
            </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className={`flex items-center px-6 py-4 rounded-3xl w-full sm:w-80 transition-all glass-elevated border`}>
                <Search size={18} className="text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Locate Personnel..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-4 bg-transparent outline-none text-sm font-bold w-full placeholder-slate-600 text-white"
                />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button className={`p-4 rounded-2xl glass-elevated border transition-all hover:scale-105 ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                    <Filter size={20} />
                </button>
                <button 
                    onClick={onAddMember}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all"
                >
                    <UserPlus size={18} /> Add Operative
                </button>
            </div>
        </div>
      </div>

      {/* Grid: Personnel Dossiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMembers.map(member => {
            const role = member.clubMemberships.find(m => m.clubId === clubId)?.role || ClubRole.MEMBER;
            return (
                <div key={member.id} className="p-8 rounded-[3.5rem] flex flex-col items-center text-center relative group transition-all duration-700 hover:scale-[1.02] glass-elevated border shadow-xl">
                    
                    <button className="absolute top-6 right-8 text-slate-600 hover:text-blue-500 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>

                    <div className="w-24 h-24 rounded-[2.5rem] mb-6 overflow-hidden relative shadow-2xl p-1.5 glass bg-gradient-to-br from-blue-500 to-indigo-600">
                        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-[#0B1437]">
                            {member.photoUrl ? (
                                <img src={member.photoUrl} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">{member.name[0]}</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1 mb-6">
                        <h3 className={`text-xl font-black font-display tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                            {member.name}
                        </h3>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">
                            {role}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 w-full justify-center px-4 mb-8">
                        <div className="text-center">
                            <p className="text-lg font-black font-display text-white">12</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Ops</p>
                        </div>
                        <div className="w-px h-6 bg-slate-700/50" />
                        <div className="text-center">
                            <p className="text-lg font-black font-display text-white">98%</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Perf.</p>
                        </div>
                        <div className="w-px h-6 bg-slate-700/50" />
                        <div className="text-center">
                            <p className="text-lg font-black font-display text-white">3y</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Tenure</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedMember(member)}
                        className="w-full py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-white/5 text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/20"
                    >
                        Inspect Dossier
                    </button>
                </div>
            );
        })}
      </div>

      {/* Personnel Profile Overlay */}
      {selectedMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => setSelectedMember(null)} />
          <div className="relative max-w-3xl w-full rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 glass-elevated">
            
            <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-10 right-10 p-4 rounded-3xl bg-white/5 text-white hover:bg-rose-500 transition-all z-20 group"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* Profile Header */}
            <div className="h-48 bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B1437] relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute -bottom-20 left-12">
                    <div className="w-40 h-40 rounded-[3rem] border-[8px] border-[#0d121d] glass bg-[#111C44] overflow-hidden shadow-2xl p-2 bg-gradient-to-br from-blue-500 to-indigo-600">
                        <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-[#0d121d]">
                            {selectedMember.photoUrl ? (
                                <img src={selectedMember.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black font-display">{selectedMember.name[0]}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 right-12 flex items-center gap-3">
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Clearance Level</span>
                      <span className="text-xl font-black text-white font-display uppercase italic">Administrator S-Tier</span>
                   </div>
                   <Fingerprint size={32} className="text-blue-500" />
                </div>
            </div>

            <div className="px-12 pt-28 pb-14 space-y-12">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-none font-display uppercase">{selectedMember.name}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                           {selectedMember.enrollmentNumber || 'UNIDENTIFIED'} <span className="w-1 h-1 rounded-full bg-slate-700" /> {selectedMember.branch || 'GENERAL DIVISION'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {selectedMember.linkedin && <a href={selectedMember.linkedin} target="_blank" className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110"><Linkedin size={20} /></a>}
                        {selectedMember.github && <a href={selectedMember.github} target="_blank" className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110"><Github size={20} /></a>}
                        <a href={`mailto:${selectedMember.email}`} className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:scale-110 transition-all"><Mail size={20} /></a>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Award size={20} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Endorsed Skillsets</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {(selectedMember.skills || []).length > 0 ? selectedMember.skills?.map(s => (
                                <span key={s} className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s}</span>
                            )) : <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">No data indexed.</p>}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center"><Layers size={20} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Active Assignments</h4>
                        </div>
                        <div className="space-y-4">
                            {selectedMember.clubMemberships.map(m => (
                                <div key={m.clubId} className="flex items-center gap-4 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] group-hover:scale-125 transition-transform" />
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{m.role}</p>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{m.clubId.replace('club-', '')} Sector</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Logistics */}
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-black text-white uppercase tracking-widest">Institutional Logistics</p>
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Status: Verified Active</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Access Signature</p>
                        <p className="text-[10px] font-mono font-black text-white tracking-widest px-4 py-2 bg-black/40 rounded-xl border border-white/5 uppercase">
                            INST-{selectedMember.id.split('-').pop()?.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubMembers;
