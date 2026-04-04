import React, { useState } from 'react';
import { Club, Registration, Notification } from '../../types';
import { Users, TrendingUp, Calendar, Wallet, GraduationCap, BellRing, Send, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { db } from '../../db';

interface Props {
  club: Club;
  registrations: Registration[];
}

const ClubHome: React.FC<Props> = ({ club, registrations }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '' });

  const stats = [
    { label: 'Council Personnel', val: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Enrolled', val: registrations.length, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Pending Ops', val: '04', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Institutional Budget', val: '₹12K', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notification.title || !notification.message) return;

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: notification.title,
      message: notification.message,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
      senderName: club.name
    };

    await db.sendNotification(notif);
    setIsNotifyOpen(false);
    setNotification({ title: '', message: '' });
  };

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-10 md:space-y-14 relative z-10">
      
      {/* Institutional Banner */}
      <div className="relative rounded-[4rem] overflow-hidden min-h-[400px] flex items-center p-10 md:p-20 border glass-elevated group shadow-2xl">
        <div className="absolute inset-0 z-0">
            {club.bannerUrl ? (
                <img src={club.bannerUrl} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2000ms]" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-[#0B1437] to-indigo-950 opacity-40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d121d] via-[#0d121d]/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] rotate-6 transition-transform group-hover:rotate-0" style={{ backgroundColor: club.themeColor }}>{club.name[0]}</div>
                    <div className="space-y-1">
                      <span className="px-4 py-1 rounded-full bg-blue-500/10 backdrop-blur-3xl border border-blue-500/20 text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">
                          {club.category} Division
                      </span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">MITS Institutional Entity</p>
                    </div>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] font-display uppercase">{club.name}</h1>
                <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">{club.tagline || `${club.category} Excellence Council prioritizing high-impact institutional growth at MITS.`}</p>
            </div>
            
            <button 
                onClick={() => setIsNotifyOpen(true)}
                className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
            >
                <BellRing size={20} className="group-hover/btn:animate-bounce" /> Broadcast Protocol
            </button>
        </div>
      </div>

      {/* Oversight Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-elevated p-8 md:p-10 rounded-[3rem] border transition-all duration-700 hover:scale-[1.02] flex flex-col justify-between h-56 group shadow-xl">
              <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12`}>
                      <stat.icon size={28} />
                  </div>
                  <Sparkles size={16} className="text-slate-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-1">
                  <p className="text-4xl font-black font-display dark:text-white text-[#1B2559] tracking-tighter">{stat.val}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Liaison */}
        {club.facultyCoordinatorNames && club.facultyCoordinatorNames.length > 0 && (
          <div className="glass-elevated p-8 rounded-[3rem] border flex flex-col items-center justify-center text-center gap-6 shadow-xl group border-blue-500/10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
               <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Liaison Officer</h3>
               <p className="text-lg font-black dark:text-white text-[#1B2559] font-display leading-tight">{club.facultyCoordinatorNames.join(' & ')}</p>
            </div>
            <span className="px-5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Operational Clearance</span>
          </div>
        )}

      </div>

      {/* UI Broadcast Layer (Mobile-Ready Modal) */}
      {isNotifyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-xl" onClick={() => setIsNotifyOpen(false)} />
            <div className="glass-elevated border-white/10 rounded-[4rem] p-10 md:p-16 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 scale-in-95 animate-in duration-500 border border-white/10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                      <BellRing size={28} />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-white tracking-tighter font-display leading-none">Broadcast</h2>
                     <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 mt-1">Institutional Alert Service</p>
                   </div>
                </div>
                
                <form onSubmit={handleSendNotification} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Protocol Title</label>
                        <input 
                            value={notification.title}
                            onChange={e => setNotification({...notification, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 px-8 py-5 rounded-3xl text-white font-bold outline-none focus:border-blue-500/50 transition-all text-sm"
                            placeholder="Priority 1: Core Systems..."
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Full Context</label>
                        <textarea 
                            value={notification.message}
                            onChange={e => setNotification({...notification, message: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 px-8 py-6 rounded-3xl text-white font-medium outline-none focus:border-blue-500/50 transition-all text-sm h-40 resize-none md:custom-scrollbar"
                            placeholder="Provide full operational details for the fleet..."
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <button type="button" onClick={() => setIsNotifyOpen(false)} className="px-8 py-5 rounded-3xl bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all order-2 md:order-1">Terminate</button>
                        <button type="submit" className="flex-1 py-5 rounded-3xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 order-1 md:order-2">
                            <Send size={18} /> Initiate Sequence
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClubHome;
