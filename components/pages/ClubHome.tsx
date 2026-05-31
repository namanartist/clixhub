import React, { useState } from 'react';
import { Club, Registration, Notification } from '../../types';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Plus, 
  MessageSquare, 
  MoreHorizontal,
  Zap,
  Layout,
  Layers,
  Trophy,
  Activity,
  Target,
  Search,
  Command,
  ArrowUpRight
} from 'lucide-react';
import { db } from '../../db';

interface Props {
  club: Club;
  registrations: Registration[];
}

const ClubHome: React.FC<Props> = ({ club, registrations }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '' });

  // Sample projects - representing the club's active sequences
  const projects = [
    { id: 1, title: 'Annual Meetup', category: 'Events', progress: 65, members: 8, color: 'bg-primary' },
    { id: 2, title: 'Member Drive', category: 'Recruitment', progress: 45, members: 5, color: 'bg-accent-purple' },
  ];

  // Sample tasks
  const tasks = [
    { id: 1, title: 'Confirm venue booking', completed: true, priority: 'high' },
    { id: 2, title: 'Send invitations to members', completed: false, priority: 'high' },
    { id: 3, title: 'Prepare agenda slides', completed: false, priority: 'medium' },
    { id: 4, title: 'Arrange catering', completed: false, priority: 'low' },
  ];

  // Sample schedule
  const scheduleItems = [
    { id: 1, time: '09:00 AM', title: 'Council Meeting', participants: 'Decision Core', status: 'upcoming' },
    { id: 2, time: '10:30 AM', title: 'Icon Design Review', participants: 'Edit icons for tasks', status: 'pending' },
    { id: 3, time: '02:00 PM', title: 'Prototype Feedback', participants: 'Mobile & Web Stack', status: 'pending' },
    { id: 4, time: '04:00 PM', title: 'Check Assets', participants: 'Final review sequence', status: 'pending' },
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

  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-4 md:p-10 pb-32 md:pb-12 space-y-10">
      <div className="max-w-[1700px] mx-auto space-y-12">

        {/* ─── HI-TECH HEADER ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Governance Mainframe</span>
             </div>
             <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight flex items-center gap-4">
                  Hey {club.name.split(' ')[0]}! <span className="animate-bounce">👋</span>
                </h1>
                <p className="text-lg font-medium text-[var(--text-secondary)] mt-2">Operational Nexus for your elite project sequences.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden xl:flex items-center gap-3 px-6 py-4 rounded-3xl glass border border-white/5 group cursor-pointer hover:border-primary/30 transition-all">
                <Search size={18} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Global Search</span>
                <Command size={14} className="opacity-20" />
             </div>
             <button
               onClick={() => setIsNotifyOpen(true)}
               className="btn-premium px-8 py-4 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all flex items-center gap-3"
             >
               <Plus size={16} /> New Sequence
             </button>
          </div>
        </div>

        {/* ─── ANALYTICS QUICK-ACTION ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Active Personnel', value: '42', icon: Users, color: 'text-primary' },
             { label: 'Growth Vector', value: '+12%', icon: TrendingUp, color: 'text-accent-cyan' },
             { label: 'Events in Queue', value: projects.length, icon: Layers, color: 'text-accent-purple' },
             { label: 'Achievements', value: '8', icon: Trophy, color: 'text-amber-400' },
           ].map((stat, i) => (
             <div key={i} className="bento-card p-6 md:p-8 flex items-center justify-between group cursor-default">
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">{stat.label}</p>
                   <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon size={24} />
                </div>
             </div>
           ))}
        </div>

        {/* ─── PRIMARY OPERATIONS GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─ LEFT COLUMN: CORE PROJECTS ─ */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bento-card p-6 md:p-10 space-y-8 md:space-y-10 group overflow-hidden relative">
              <div className="absolute top-[-10%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={300} />
              </div>
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Layout size={24} />
                   </div>
                   <h2 className="text-3xl font-black tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">Active Projects</h2>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-primary transition-colors">
                  All Matrices <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 md:p-8 rounded-[2.5rem] glass border border-white/5 hover:border-primary/20 transition-all hover:translate-y-[-5px] group/card">
                    <div className="flex items-start justify-between mb-8">
                       <div className="space-y-4">
                          <div className={`w-14 h-14 rounded-2xl ${project.color} flex items-center justify-center text-white shadow-2xl`}>
                             <Activity size={28} />
                          </div>
                          <div>
                             <h3 className="text-xl font-black tracking-tight">{project.title}</h3>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{project.category}</span>
                          </div>
                       </div>
                       <button className="p-3 rounded-xl bg-white/10 hover:bg-white/10 transition-colors">
                          <MoreHorizontal size={20} className="text-[var(--text-secondary)]" />
                       </button>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Synchronized</span>
                          <span className="text-lg font-black">{project.progress}%</span>
                       </div>
                       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-cyan transition-all duration-1000"
                            style={{ width: `${project.progress}%` }}
                          />
                       </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                       <div className="flex -space-x-3">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-10 h-10 rounded-2xl bg-[#1C1F2E] border-2 border-[var(--bg-main)] flex items-center justify-center text-[10px] font-black text-white hover:translate-y-[-5px] transition-transform cursor-pointer">
                               {i < 3 ? String.fromCharCode(65 + (project.id * i)) : `+${project.members - 3}`}
                            </div>
                          ))}
                       </div>
                       <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all">
                          Sequence Log
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─ SECONDARY: TASK TRACKER ─ */}
            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan border border-accent-cyan/20">
                      <Target size={24} />
                   </div>
                   <h2 className="text-2xl font-black tracking-tight uppercase italic">Operational Goals</h2>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Success Margin</p>
                      <p className="text-sm font-black text-primary">{Math.round((completedTasks/tasks.length)*100)}% Verified</p>
                   </div>
                   <button className="p-4 rounded-2xl glass hover:bg-white/10 transition-all text-[var(--text-secondary)]">
                      <Plus size={20} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`p-6 rounded-3xl border transition-all flex items-center gap-6 group/task ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white/10 border-white/5 hover:border-primary/30'}`}>
                    <div className="flex-shrink-0 relative">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20 group-hover/task:border-primary cursor-pointer'}`}>
                          {task.completed && <CheckCircle2 size={16} strokeWidth={3} />}
                       </div>
                    </div>
                    <div className="flex-1">
                       <p className={`text-md font-black tracking-tight ${task.completed ? 'line-through opacity-50' : 'text-white'}`}>
                          {task.title}
                       </p>
                       <div className="flex items-center gap-3 mt-1.5">
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : task.priority === 'medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-400'}`}>
                            {task.priority} Priority
                          </span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─ RIGHT COLUMN: TEMPORAL FLOW ─ */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* DATE CHRONOS */}
            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8 bg-gradient-to-br from-[#0d121d] to-black">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 flex items-center gap-3">
                   <Clock size={14} className="animate-spin-slow" /> Real-time Clock
                </p>
                <div className="flex items-baseline gap-4">
                   <span className="text-7xl font-black italic tracking-tighter text-white">{new Date().getDate()}</span>
                   <div className="space-y-1">
                      <p className="text-2xl font-black uppercase text-primary leading-none">{new Date().toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                   </div>
                </div>
              </div>

              {/* CALENDAR MATRIX */}
              <div className="grid grid-cols-7 gap-y-4 gap-x-1 border-t border-white/5 pt-8">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-[10px] font-black text-primary/40 text-center">{day}</div>
                ))}
                {[...Array(35)].map((_, i) => {
                  const dateNum = i - 3;
                  const isToday = dateNum === new Date().getDate();
                  const isVisible = dateNum > 0 && dateNum <= 30;
                  return (
                    <div
                      key={i}
                      className={`h-10 flex items-center justify-center text-xs font-black transition-all rounded-xl ${isVisible
                          ? isToday
                            ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-110 z-10'
                            : 'text-white/40 hover:bg-white/10 cursor-pointer hover:text-white'
                          : 'opacity-0'
                        }`}
                    >
                      {isVisible ? dateNum : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SCHEDULE PIPELINE */}
            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black tracking-tight uppercase italic italic underline decoration-accent-cyan decoration-2 underline-offset-4">Event Flow</h3>
                 <Calendar className="text-accent-cyan" size={20} />
              </div>

              <div className="space-y-0 relative">
                <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-white/10" />
                
                {scheduleItems.map((item, idx) => (
                  <div key={item.id} className="flex gap-8 relative group cursor-pointer pb-10 last:pb-0">
                    <div className="mt-1.5 relative z-10 transition-transform group-hover:scale-125">
                       <div className={`w-6 h-6 rounded-lg ${item.status === 'upcoming' ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-raw),0.5)]' : 'bg-[#1C1F2E] border border-white/10'} flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full ${item.status === 'upcoming' ? 'bg-white' : 'bg-white/10'}`} />
                       </div>
                    </div>
                    <div className="flex-1 space-y-1">
                       <div className="flex justify-between items-start">
                          <p className="text-md font-black italic tracking-tight">{item.title}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest pl-4 ${item.status === 'upcoming' ? 'text-primary' : 'opacity-20'}`}>
                             {item.time}
                          </span>
                       </div>
                       <p className="text-[11px] font-medium text-[var(--text-secondary)]">{item.participants}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-8 items-center pt-8 opacity-20 group cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">End of Daily Sequence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CREATION OVERLAY ─── */}
      {isNotifyOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black animate-in fade-in duration-500" onClick={() => setIsNotifyOpen(false)} />
          <div className="relative w-full max-w-xl bento-card p-8 md:p-12 space-y-8 md:space-y-10 animate-in zoom-in-95 duration-500 shadow-4xl border border-white/10">
            <div className="space-y-2">
               <h2 className="text-5xl font-black tracking-tighter uppercase italic italic underline decoration-primary decoration-4 underline-offset-8">New Nexus Item</h2>
               <p className="text-[var(--text-secondary)] font-medium text-lg">Define a new project core or operational objective.</p>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Sequence Identity</label>
                  <div className="relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                     <input
                       value={notification.title}
                       onChange={e => setNotification({ ...notification, title: e.target.value })}
                       className="w-full h-20 bg-white/10 border border-white/10 pl-16 pr-8 rounded-[2rem] text-xl font-black outline-none focus:border-primary/50 transition-all placeholder:opacity-10"
                       placeholder="Sequence Title..."
                     />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Operational Directives</label>
                  <textarea
                    value={notification.message}
                    onChange={e => setNotification({ ...notification, message: e.target.value })}
                    className="w-full h-40 bg-white/10 border border-white/10 p-8 rounded-[2rem] text-lg font-medium outline-none focus:border-primary/50 transition-all resize-none placeholder:opacity-10"
                    placeholder="Describe the objective parameters..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <button type="button" onClick={() => setIsNotifyOpen(false)} className="h-20 rounded-[2rem] border border-white/10 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                  Abort
                </button>
                <button type="submit" className="h-20 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-3xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Initialize
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
