import React, { useState, useEffect, useRef } from 'react';
import { User, Club, Notification } from '../types';
import { Bell, Menu, Search, ChevronDown, Command, LogOut, User as UserIcon, Settings, Zap, Sun, Moon, Sparkles } from 'lucide-react';
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
}

const Navbar: React.FC<NavbarProps> = ({
  user, clubs, activeContext, onLogout, isDarkMode, onToggleTheme, onToggleMobileMenu, onGoHome, onOpenProfile
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
    <nav className="h-20 md:h-28 px-4 md:px-8 flex items-center sticky top-0 z-40">
      <div className={`w-full max-w-7xl mx-auto h-16 md:h-20 rounded-[2rem] px-6 md:px-10 flex items-center justify-between transition-all border shadow-2xl ${isDarkMode
        ? 'bg-[#0d121d]/40 backdrop-blur-3xl border-white/5 shadow-black/40'
        : 'bg-white/60 backdrop-blur-3xl border-white shadow-blue-500/5'
        }`}>

        {/* Context Branding */}
        <div className="flex items-center gap-4">
          <button onClick={onToggleMobileMenu} className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CLIX HUB</span>
              <span className="w-1 h-1 rounded-full bg-slate-500/30" />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{contextName}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter font-display text-[var(--text-main)]">
              {activeContext === 'Global' ? 'Campus Nexus' : contextName}
            </h2>
          </div>
          {/* Mobile view branding */}
          <div className="md:hidden flex items-center gap-2">
            <Zap size={20} className="text-cyan-400 fill-cyan-400" />
            <span className="font-black text-sm tracking-tighter text-[var(--text-main)]">CLIX</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Global Search Bar (Glass Layout) */}
          <div className="relative group hidden md:block">
            <div className={`flex items-center rounded-2xl px-5 py-2.5 w-64 border transition-all duration-300 ${isDarkMode
              ? 'bg-white/5 border-white/5 focus-within:bg-white/10'
              : 'bg-slate-500/5 border-transparent focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5'
              }`}>
              <Search size={16} className={isDarkMode ? 'text-slate-500' : 'text-[#A3AED0]'} />
              <input
                type="text"
                placeholder="Omni Search..."
                className="bg-transparent border-none outline-none text-xs ml-3 w-full font-bold placeholder-[#A3AED0] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-[#1B2559] hover:bg-slate-500/5'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2.5 rounded-xl transition-all relative ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-[#1B2559] hover:bg-slate-500/5'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl border transition-all group ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-500/5 border-transparent hover:bg-white hover:shadow-lg'
                }`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-lg shadow-blue-500/20">
                {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" /> : (user?.name?.[0] || 'U')}
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className={`absolute right-0 top-full mt-4 w-64 rounded-[2rem] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 border backdrop-blur-3xl ${isDarkMode ? 'bg-[#0d121d]/90 border-white/10 text-white' : 'bg-white/90 border-white text-[#1B2559]'
                }`}>
                <div className="p-5 space-y-1">
                  <p className="font-black text-sm tracking-tight truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">{user?.globalRole}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { onOpenProfile?.(); setIsProfileOpen(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-blue-500/5 text-slate-500 hover:text-blue-600'
                      }`}
                  >
                    <span className="flex items-center gap-3"><UserIcon size={16} /> Identity</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-3"><LogOut size={16} /> Terminate</span>
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
