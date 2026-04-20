import React, { useState, useEffect, useRef } from 'react';
import { User, Club, Notification } from '../types';
import { Bell, Menu, Search, ChevronDown, Command, LogOut, User as UserIcon, Settings, Zap, Sun, Moon, Sparkles, Fingerprint, Code, ArrowLeft, Hexagon } from 'lucide-react';
import { db } from '../db';

interface NavbarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  onGoHome?: () => void;
  onOpenProfile?: () => void;
  onOpenDeveloper?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user, clubs, activeContext, onLogout, isDarkMode, onToggleTheme, onToggleMobileMenu, onGoHome, onOpenProfile, onOpenDeveloper
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
    <nav className={`h-16 md:h-24 px-4 md:px-12 flex items-center sticky top-0 z-50 backdrop-blur-3xl border-b transition-all duration-500 ${isDarkMode
      ? 'bg-black/40 border-white/5'
      : 'bg-white/40 border-slate-200'
      }`}>
      <div className="w-full h-full flex items-center justify-between">

        {/* Branding & Status */}
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-3 md:gap-4">
            {activeContext !== 'Global' ? (
              <button
                onClick={onGoHome}
                className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-500 transition-all hover:scale-105 active:scale-95 group shadow-2xl"
              >
                <ArrowLeft size={16} className="md:size-[18px] group-hover:-translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-3xl shadow-blue-500/40 cursor-pointer" onClick={onGoHome}>
                <Hexagon size={20} className="md:size-[24px] animate-spin-slow" />
              </div>
            )}

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <Fingerprint size={10} className="text-primary opacity-50 hidden md:block" />
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Verified Access</span>
              </div>
              <h1 className="text-sm md:text-xl font-black tracking-tight text-white leading-tight uppercase italic truncate max-w-[120px] md:max-w-[200px]">{contextName}</h1>
            </div>
          </div>
        </div>

        {/* ─ CENTER: DEV WATERMARK (Hidden on mobile) ─ */}
        <div className="hidden lg:flex flex-col items-center">
          <div
            onClick={onOpenDeveloper}
            className="group cursor-pointer relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center relative z-10">
              <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.4em] mb-0.5">Institutional Lead Engineer</span>
              <div className="flex items-center gap-2">
                <Code size={12} className="text-blue-500 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase italic group-hover:text-blue-400 transition-colors">Developed by Naman Lahariya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-6 ml-4">
          <div className="hidden xl:flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all cursor-pointer group">
            <Search size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">Global Signal Search</span>
            <Command size={14} className="text-primary opacity-20" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border ${isDarkMode
                ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-primary'
                }`}
            >
              {isDarkMode ? <Sun size={18} className="md:size-[20px]" /> : <Moon size={18} className="md:size-[20px]" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border relative ${isDarkMode
                  ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-primary'
                  }`}
              >
                <Bell size={18} className="md:size-[20px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </button>
            </div>
          </div>

          <div className="relative" ref={profileRef}>
            <button
              className={`flex items-center gap-3 md:gap-4 pl-3 md:pl-4 pr-3 md:pr-6 py-1.5 md:py-2 rounded-2xl md:rounded-3xl border transition-all duration-500 ${isDarkMode
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50'
                : 'bg-white border-slate-200 hover:border-primary/50 shadow-xl'
                }`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center text-white font-black text-[10px] md:text-sm overflow-hidden shadow-2xl transition-transform group-hover:scale-105 bg-primary`}>
                {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" alt="Profile" /> : (user?.name?.[0] || 'U')}
              </div>
              <div className="hidden lg:flex flex-col items-start translate-y-[-1px]">
                <p className="text-xs font-black tracking-tight uppercase leading-none">{user?.name}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary mt-1">{user?.globalRole || 'Operative'}</p>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-500 opacity-30 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
            </button>

            {isProfileOpen && (
              <div className={`absolute right-0 top-full mt-4 w-64 md:w-72 rounded-[1.5rem] md:rounded-[2.5rem] shadow-4xl p-2 z-[100] animate-in zoom-in-95 duration-500 border backdrop-blur-4xl ${isDarkMode
                ? 'bg-black/90 border-white/10'
                : 'bg-white/95 border-slate-200'
                }`}>
                <div className={`p-6 md:p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} space-y-2`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Sparkles size={16} /></div>
                    <div>
                      <p className="text-sm md:text-md font-black italic tracking-tighter uppercase leading-none">{user?.name}</p>
                      <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-primary mt-1">Identity Verified</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 md:p-3 space-y-1 md:space-y-2">
                  <button
                    onClick={() => { onOpenProfile?.(); setIsProfileOpen(false); }}
                    className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl md:rounded-3xl transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <UserIcon size={14} className="md:size-[16px]" /> Central Profile
                    </div>
                    <ArrowLeft size={12} className="rotate-180 opacity-30" />
                  </button>

                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isDarkMode
                      ? 'text-rose-500 hover:bg-rose-500/10'
                      : 'text-rose-600 hover:bg-rose-50'
                      }`}
                  >
                    <LogOut size={14} className="md:size-[16px]" /> Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
