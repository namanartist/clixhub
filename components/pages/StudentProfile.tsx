import React, { useState, useRef, useEffect } from 'react';
import { User, Registration, Applicant, Event, Role, ClubRole } from '../../types';
import { db } from '../../db';
import { 
  User as UserIcon, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Edit2,
  Zap,
  CheckCircle2, 
  Camera, 
  Mail, 
  Linkedin, 
  Github, 
  Plus, 
  X, 
  Heart, 
  Calendar, 
  Briefcase, 
  Layers, 
  PenTool,
  Upload,
  Hexagon,
  Fingerprint,
  ExternalLink,
  Code,
  Phone
} from 'lucide-react';

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
  isDarkMode: boolean;
  registrations: Registration[];
  applicants: Applicant[];
  events: Event[];
}

const StudentProfile: React.FC<Props> = ({ user, onSave, isDarkMode, registrations, applicants, events }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [myProposals, setMyProposals] = useState<Event[]>([]);
  
  const myRegistrations = registrations.filter(r => r.studentId === user.id);
  const myApplications = applicants.filter(a => a.name === user.name); 

  const isAuthority = user.globalRole === Role.FACULTY || user.clubMemberships.some(m => m.role === ClubRole.PRESIDENT);

  useEffect(() => {
    const fetchData = async () => {
        const saved = await db.getSavedEvents(user.id);
        const savedEventObjs = saved.map(s => events.find(e => e.id === s.eventId)).filter(e => e !== undefined) as Event[];
        setSavedEvents(savedEventObjs);
        const proposals = events.filter(e => e.createdBy === user.id);
        setMyProposals(proposals);
    };
    fetchData();
  }, [user.id, events]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
                        if (r > 200 && g > 200 && b > 200) { data[i + 3] = 0; }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    setFormData(prev => ({ ...prev, signatureUrl: canvas.toDataURL() }));
                }
            };
        };
        reader.readAsDataURL(file);
    }
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!isEditing) return;
    setFormData(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skillToRemove) }));
  };

  const removeSavedEvent = async (eventId: string) => {
      await db.toggleSavedEvent(user.id, eventId);
      setSavedEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const inputClasses = `w-full h-16 px-6 rounded-2xl border outline-none transition-all text-sm font-[900] uppercase tracking-widest ${
    isDarkMode 
      ? 'bg-primary-soft/30 border-[var(--border-color)] text-white focus:border-primary placeholder:text-slate-600' 
      : 'bg-slate-50border-slate-200 focus:border-primary placeholder:text-slate-400'
  } ${!isEditing ? 'opacity-60 cursor-default' : ''}`;

  return (
    <div className="p-5 md:p-14 max-w-[1700px] mx-auto space-y-12 md:space-y-20 relative reveal">
      
      {/* Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-10 z-[100] animate-in fade-in slide-in-from-right-8">
           <div className="bg-emerald-600 text-white px-8 py-5 rounded-[2rem] shadow-3xl shadow-emerald-500/30 flex items-center gap-4 font-black text-[10px] uppercase tracking-widest">
              <CheckCircle2 size={24} /> Records Synchronized
           </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row gap-12">
          {/* Avatar Card */}
          <div className="lg:w-[400px] shrink-0">
             <div className="bento-card p-6 md:p-10 flex flex-col items-center text-center gap-8 group">
                <div className="relative">
                   <div className="w-48 h-48 rounded-[3rem] bg-primary-soft border-4 border-primary/20 shadow-3xl overflow-hidden relative">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/30"><UserIcon size={80} /></div>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                              <Camera size={24} />
                           </button>
                        </div>
                      )}
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                   <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl">
                      <Zap size={20} fill="currentColor" />
                   </div>
                </div>

                <div className="space-y-3">
                   <h2 className="text-4xl font-black tracking-[-0.04em]">{formData.name}</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{formData.globalRole}</p>
                </div>

                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-primary/30 hover:scale-[1.02]'}`}>
                   {isEditing ? <><Save size={18}/> Commit Ledger</> : <><Edit2 size={18}/> Modify Identity</>}
                </button>
             </div>
          </div>

          {/* Core Info & Tabs */}
          <div className="flex-1 space-y-8 md:space-y-12">
             <div className="bento-card p-6 md:p-12 space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 border-b border-[var(--border-color)] pb-8">
                   <div className="p-4 rounded-2xl bg-primary/10 text-primary transition-transform group-hover:rotate-12">
                      <ShieldCheck size={28} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight">Institutional identity</h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Encrypted Ledger Information</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {[
                      { label: 'Identity Marker', val: formData.name, key: 'name', icon: UserIcon },
                      { label: 'Uplink Address', val: formData.email, key: 'email', icon: Mail },
                      { label: 'Academic Node', val: formData.branch || 'NOT_SET', key: 'branch', icon: MapPin },
                      { label: 'Pulse Frequency', val: formData.phoneNumber || 'NOT_SET', key: 'phoneNumber', icon: Phone },
                   ].map((field, i) => (
                      <div key={i} className="space-y-3">
                         <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-2">{field.label}</label>
                         <div className="relative">
                            <input value={field.val} disabled={!isEditing} onChange={e => setFormData({...formData, [field.key]: e.target.value})} className={inputClasses} />
                         </div>
                      </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-2">Professional Sync (Linkedin)</label>
                       <div className="group relative">
                          <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--text-main)] transition-colors" size={18} />
                          <input placeholder="linkedin-id" value={formData.linkedin || ''} disabled={!isEditing} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={inputClasses + ' pl-16'} />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-2">Source Control (Github)</label>
                       <div className="group relative">
                          <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--text-main)] transition-colors" size={18} />
                          <input placeholder="github-id" value={formData.github || ''} disabled={!isEditing} onChange={e => setFormData({...formData, github: e.target.value})} className={inputClasses + ' pl-16'} />
                       </div>
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Skills & Authority */}
          <div className="lg:col-span-4 space-y-12">
             {/* Authority */}
             {isAuthority && (
                <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8 border-l-4 border-l-purple-500">
                   <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500"><PenTool size={20} /></div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Seal</h4>
                   </div>
                   <div className="h-32 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden group">
                      {formData.signatureUrl ? (
                        <img src={formData.signatureUrl} className="max-w-[70%] max-h-[70%] object-contain mix-blend-difference invert" />
                      ) : (
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20 italic">No valid seal found</p>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer" onClick={() => signatureInputRef.current?.click()}>
                           <Upload size={20} className="text-white" />
                           <span className="text-[8px] text-white font-black uppercase tracking-widest">Update Ledger</span>
                        </div>
                      )}
                   </div>
                   <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} className="hidden" accept="image/*" />
                </div>
             )}

             {/* Skills */}
             <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Code size={20} /></div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Index</h4>
                   </div>
                   {isEditing && (
                      <button onClick={addSkill} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"><Plus size={16}/></button>
                   )}
                </div>
                {isEditing && (
                   <div className="relative">
                      <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Push new skill..." className="w-full bg-primary-soft/30 border border-[var(--border-color)] rounded-xl px-5 py-3 text-[10px] uppercase font-black tracking-widest outline-none focus:border-primary" />
                   </div>
                )}
                <div className="flex flex-wrap gap-3">
                   {(formData.skills || []).map(skill => (
                      <div key={skill} className="px-5 py-2.5 rounded-xl bg-primary-soft/50 border border-[var(--border-color)] text-[9px] font-black uppercase tracking-widest flex items-center gap-3 group/skill">
                         {skill}
                         {isEditing && <X className="text-rose-500 cursor-pointer hover:scale-125" size={12} onClick={() => removeSkill(skill)} />}
                      </div>
                   ))}
                   {(formData.skills || []).length === 0 && <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-30 italic">No verified skills detected.</p>}
                </div>
             </div>
          </div>

          {/* Right Column: Dynamic Lists */}
          <div className="lg:col-span-8 space-y-12">
             
             {/* Club Memberships (Active Commissions) */}
             <div className="bento-card p-6 md:p-10 space-y-8 md:space-y-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Briefcase size={20} /></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Active Commissions</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {formData.clubMemberships.map((m, idx) => (
                      <div key={idx} className="p-8 rounded-[2.5rem] bg-primary-soft/30 border border-[var(--border-color)] space-y-6 group hover:border-amber-500/30 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">{m.clubId.replace('club-', '').toUpperCase()}</p>
                               <h5 className="text-xl font-black tracking-tight">{m.role}</h5>
                               <p className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.2em]">{m.domain || 'Unassigned Division'}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/ text-amber-500 group-hover:scale-110 transition-transform">
                               <Fingerprint size={24} />
                            </div>
                         </div>
                         
                         {isEditing && (
                            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                               <div className="space-y-2">
                                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Modify Role</label>
                                  <select 
                                    value={m.role} 
                                    onChange={e => {
                                      const newMemberships = [...formData.clubMemberships];
                                      newMemberships[idx].role = e.target.value as ClubRole;
                                      setFormData({...formData, clubMemberships: newMemberships});
                                    }}
                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none text-white appearance-none"
                                  >
                                     {Object.values(ClubRole).map(r => <option key={r} value={r} className="bg-[#0B1437]">{r}</option>)}
                                  </select>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Reassign Domain</label>
                                  <input 
                                    value={m.domain || ''} 
                                    placeholder="Enter Domain (e.g. Technical)"
                                    onChange={e => {
                                      const newMemberships = [...formData.clubMemberships];
                                      newMemberships[idx].domain = e.target.value;
                                      setFormData({...formData, clubMemberships: newMemberships});
                                    }}
                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none text-white"
                                  />
                               </div>
                            </div>
                         )}
                      </div>
                   ))}
                   {formData.clubMemberships.length === 0 && (
                      <div className="col-span-full p-12 rounded-[2.5rem] border border-dashed border-[var(--border-color)] flex flex-col items-center justify-center opacity-30 gap-4">
                         <Layers size={40} />
                         <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active club commissions</p>
                      </div>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Mission logs */}
                <div className="bento-card p-6 md:p-10 flex flex-col min-h-[400px]">
                   <div className="flex items-center justify-between mb-8 md:mb-10">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Calendar size={20} /></div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Mission logs</h4>
                      </div>
                      <span className="text-[9px] font-black bg-blue-500 text-white px-3 py-1 rounded-full">{myRegistrations.length}</span>
                   </div>
                   <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                      {myRegistrations.length > 0 ? myRegistrations.map(reg => {
                         const ev = events.find(e => e.id === reg.eventId);
                         return (
                            <div key={reg.id} className="p-6 rounded-[1.5rem] bg-primary-soft/30 border border-[var(--border-color)] flex justify-between items-center group hover:border-blue-500/30 transition-all">
                               <div>
                                  <p className="font-black text-sm tracking-tight mb-1">{ev?.title}</p>
                                  <p className={`text-[8px] font-black uppercase tracking-widest ${reg.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{reg.status}</p>
                               </div>
                               <ExternalLink size={16} className="text-[var(--text-secondary)] opacity-30 group-hover:opacity-100 transition-opacity" />
                            </div>
                         )
                      }) : <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] uppercase tracking-[0.3em] text-center gap-4 text-[var(--text-secondary)]"><Zap size={40} /><p>No active missions indexed.</p></div>}
                   </div>
                </div>

                {/* Applications */}
                <div className="bento-card p-6 md:p-10 flex flex-col min-h-[400px]">
                   <div className="flex items-center justify-between mb-8 md:mb-10">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Layers size={20} /></div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Fleet Deployment</h4>
                      </div>
                      <span className="text-[9px] font-black bg-indigo-500 text-white px-3 py-1 rounded-full">{myApplications.length}</span>
                   </div>
                   <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                      {myApplications.length > 0 ? myApplications.map(app => (
                        <div key={app.id} className="p-6 rounded-[1.5rem] bg-primary-soft/30 border border-[var(--border-color)] space-y-4">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="font-black text-sm mb-1">{app.domain} Division</p>
                                 <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{app.stage}</p>
                              </div>
                              <Hexagon size={16} className="text-indigo-500 rotate-12" />
                           </div>
                           <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: ['Applied','Screening','Interview','Offer','Selected'].indexOf(app.stage) * 25 + '%' }} />
                           </div>
                        </div>
                      )) : <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] uppercase tracking-[0.3em] text-center gap-4 text-[var(--text-secondary)]"><Fingerprint size={40} /><p>No fleet applications found.</p></div>}
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default StudentProfile;
