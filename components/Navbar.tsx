import React, { useState, useEffect, useRef } from 'react';
import { User, Club, Notification } from '../types';
import { Bell, Menu, Search, ChevronDown, Command, LogOut, User as UserIcon, Sparkles, Fingerprint, Code, ArrowLeft, Hexagon } from 'lucide-react';
import { db } from '../db';

interface NavbarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleMobileMenu: () => void;
  onGoHome?: () => void;
  onOpenProfile?: () => void;
  onOpenDeveloper?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user, clubs, activeContext, onLogout, isDarkMode, onToggleMobileMenu, onGoHome, onOpenProfile, onOpenDeveloper
}) => {
  const currentClub = clubs.find(c => c.id === activeContext);
  const contextName = activeContext === 'Global' ? 'Dashboard' : (currentClub?.name || 'Club');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!user?.id) return;
      const notifs = await db.getNotifications();
      setNotifications(notifs);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="sticky top-0 z-50 pt-4 px-4 md:pt-6 md:px-8 max-w-7xl mx-auto w-full">
      <nav className={`h-16 md:h-20 rounded-[2rem] px-4 md:px-6 flex items-center justify-between backdrop-blur-3xl border transition-all duration-500 shadow-[0_32px_64px_rgba(0,0,0,0.1)] ${isDarkMode
        ? 'bg-black/60 border-white/10 shadow-black/50'
        : 'bg-white/70 border-white/80 shadow-slate-200/50'
        }`}>
        
        {/* LEFT: Branding & Back Button */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {activeContext !== 'Global' ? (
            <button
              onClick={onGoHome}
              className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border transition-all hover:scale-105 active:scale-95 group shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
            >
              <ArrowLeft size={16} className="md:size-[18px] group-hover:-translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 cursor-pointer" onClick={onGoHome}>
              <Hexagon size={20} className="md:size-[24px] animate-spin-slow" />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <Fingerprint size={10} className="text-primary opacity-60 hidden md:block" />
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'opacity-40' : 'text-slate-500'}`}>Verified Node</span>
            </div>
            <h1 className={`text-sm md:text-lg font-black tracking-tight leading-tight uppercase italic truncate max-w-[120px] md:max-w-[200px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{contextName}</h1>
          </div>
        </div>

        {/* CENTER: Action Search (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] shadow-inner ${isDarkMode ? 'bg-black/50 border-white/5 hover:border-white/15' : 'bg-slate-100/50 border-slate-200 hover:border-slate-300'}`}>
            <Search size={16} className="text-primary" />
            <span className={`flex-1 text-[10px] font-black uppercase tracking-widest transition-opacity ${isDarkMode ? 'text-white/40 group-hover:text-white/70' : 'text-slate-400 group-hover:text-slate-600'}`}>Global Signal Search</span>
            <Command size={14} className="text-primary opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all border relative hover:scale-105 active:scale-95 shadow-md ${isDarkMode
              ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
              : 'bg-white border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30'
              }`}
          >
            <Bell size={18} className="md:size-[20px]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              className={`flex items-center gap-3 pl-2 pr-3 md:pr-4 py-1.5 md:py-2 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${isDarkMode
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50'
                : 'bg-white border-slate-200 hover:border-primary/40 hover:shadow-primary/10'
                }`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-white font-black text-[10px] md:text-sm overflow-hidden bg-primary`}>
                {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" alt="Profile" /> : (user?.name?.[0] || 'U')}
              </div>
              <div className="hidden md:flex flex-col items-start translate-y-[-1px]">
                <p className={`text-xs font-black tracking-tight uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name?.split(' ')[0]}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary mt-1">{user?.globalRole || 'Operative'}</p>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-500 opacity-40 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
            </button>

            {isProfileOpen && (
              <div className={`absolute right-0 top-full mt-4 w-64 md:w-72 rounded-[2rem] shadow-2xl p-2 z-[100] animate-in zoom-in-95 duration-200 border backdrop-blur-3xl ${isDarkMode
                ? 'bg-[#111]/95 border-white/10 shadow-black'
                : 'bg-white/95 border-slate-200 shadow-slate-300/50'
                }`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} space-y-2`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Sparkles size={16} /></div>
                    <div>
                      <p className={`text-md font-black italic tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1">Identity Verified</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { onOpenProfile?.(); setIsProfileOpen(false); }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <UserIcon size={16} /> Central Profile
                    </div>
                    <ArrowLeft size={12} className="rotate-180 opacity-40" />
                  </button>

                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${isDarkMode
                      ? 'text-rose-500 hover:bg-rose-500/10'
                      : 'text-rose-600 hover:bg-rose-50'
                      }`}
                  >
                    <LogOut size={16} /> Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
