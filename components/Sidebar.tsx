import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Globe,
  ShieldCheck,
  FileText,
  Activity,
  CreditCard,
  ScanLine,
  Ticket,
  PieChart,
  Settings as SettingsIcon,
  Layout,
  Briefcase,
  X,
  CheckCircle2,
  ChevronDown,
  Layers,
  MessageSquare,
  Zap,
  UserCog,
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';
import { ClubRole, Role, User, Club } from '../types';

interface SidebarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onContextChange: (id: string) => void;
  userRole: Role;
  clubRole: ClubRole | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole?: (role: Role) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  user, clubs, activeContext, onContextChange, userRole, clubRole, activeTab, setActiveTab, isOpen, onClose, isDarkMode
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = userRole === Role.SUPER_ADMIN;
  const isFaculty = userRole === Role.FACULTY;
  const isDean = userRole === Role.DEAN;

  const currentClub = clubs.find(c => c.id === activeContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePerspectiveSelect = (id: string) => {
    onContextChange(id);
    setIsSwitcherOpen(false);
  };

  const menuItems: SidebarItem[] = [];

  if (activeContext === 'Global') {
    if (isSuperAdmin) {
      menuItems.push(
        { id: 'admin-dashboard', label: 'Admin Hub', icon: ShieldCheck },
        { id: 'chat', label: 'Central Comm', icon: MessageSquare },
        { id: 'student-registry', label: 'Student Fleet', icon: Users },
        { id: 'faculty-registry', label: 'Faculty Hub', icon: UserCog },
        { id: 'clubs', label: 'Club Assets', icon: Globe },
        { id: 'analytics', label: 'Core Intelligence', icon: Activity },
        { id: 'global-audit', label: 'Security Logs', icon: FileText }
      );
    } else if (isFaculty || isDean) {
      menuItems.push(
        { id: 'faculty-dashboard', label: isDean ? 'Dean Overview' : 'Faculty Feed', icon: LayoutDashboard },
        { id: 'chat', label: 'Comm. Center', icon: MessageSquare },
        { id: 'approvals', label: 'Protocol Approvals', icon: CheckCircle2 },
        { id: 'reports', label: 'Institutional KPIs', icon: Activity }
      );
    } else {
      menuItems.push(
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'chat', label: 'Secure Messages', icon: MessageSquare },
        { id: 'clubs', label: 'Protocol Directories', icon: Globe },
        { id: 'events', label: 'Operation Feed', icon: Calendar },
        { id: 'recruitment', label: 'Recruitment Status', icon: Briefcase },
        { id: 'my-certificates', label: 'Asset Ledger', icon: Award },
        { id: 'tickets', label: 'Session Tickets', icon: Ticket },
        { id: 'payments', label: 'Financial Ledger', icon: CreditCard }
      );
    }
  } else {
    menuItems.push(
      { id: 'club-dashboard', label: 'Hub Console', icon: LayoutDashboard },
      { id: 'chat', label: 'Internal Comms', icon: MessageSquare },
      { id: 'attendance', label: 'Attendance', icon: ScanLine },
      { id: 'website', label: 'Public Website', icon: Globe },
    );

    const isClubAdmin = clubRole && clubRole !== ClubRole.MEMBER;
    if (isClubAdmin || isFaculty || isDean || isSuperAdmin) {
      menuItems.push(
        { id: 'members', label: 'Personnel', icon: Users },
        { id: 'club-events', label: 'Ops Manager', icon: Calendar },
        { id: 'club-finance', label: 'Treasury', icon: CreditCard },
        { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
        { id: 'certificates', label: 'Issuance', icon: Award },
        { id: 'site-editor', label: 'Site Studio', icon: Layout },
      );
    }

    if (clubRole === ClubRole.PRESIDENT || isFaculty || isDean || isSuperAdmin) {
      menuItems.push(
        { id: 'club-settings', label: 'System Config', icon: SettingsIcon }
      );
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-500 animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-full sm:w-80 flex flex-col p-4 sm:p-6
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:h-screen
        transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
      `}>
        <div className={`w-full h-full rounded-[2rem] sm:rounded-[3rem] flex flex-col overflow-hidden border shadow-4xl transition-all bg-[var(--bg-surface)]/95 backdrop-blur-3xl border-[var(--border-color)]`}>

          {/* Header Section */}
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-[var(--text-main)]">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-400/30 rotate-12">
                  <Zap size={22} className="fill-white" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight font-display">CLIX<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> HUB</span></span>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-400/60 to-blue-500/60 bg-clip-text text-transparent leading-none mt-1">Campus Nexus</p>
                </div>
              </div>
              <button onClick={onClose} className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              </button>
            </div>

            {/* Perspective Switcher */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className={`w-full p-4 rounded-3xl transition-all flex items-center gap-4 group border ${isDarkMode
                  ? 'bg-white/10 border-white/5 hover:bg-white/10 text-white'
                  : 'bg-white/10 hover:bg-white/10 hover:shadow-xl border-white/50 text-[#1B2559]'
                  }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:scale-105 overflow-hidden`}
                  style={{ backgroundColor: activeContext === 'Global' ? '#2563eb' : currentClub?.themeColor || '#2563eb' }}>
                  {activeContext === 'Global' ? <Command size={20} /> : currentClub?.name?.[0]}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Scope</h3>
                  <p className="text-sm font-bold truncate">{activeContext === 'Global' ? 'Institutional' : currentClub?.name}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSwitcherOpen && (
                <div className={`absolute left-0 right-0 top-full mt-3 z-[100] border rounded-[2rem] shadow-[0_32px_64px_rgba(0,0,0,0.3)] overflow-hidden p-2 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl bg-[var(--bg-surface)] border-[var(--border-color)]`}>
                  <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                    <button
                      onClick={() => handlePerspectiveSelect('Global')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white/10 text-[var(--text-main)]`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white"><Layers size={16} /></div>
                      <span className="text-xs font-black uppercase tracking-widest">Global Ops</span>
                    </button>
                    {user.clubMemberships.map((m) => {
                      const c = clubs.find(cl => cl.id === m.clubId);
                      if (!c) return null;
                      return (
                        <button
                          key={c.id}
                          onClick={() => handlePerspectiveSelect(c.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-blue-500/5 text-[#1B2559]'}`}
                        >
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-black/10" style={{ backgroundColor: c.themeColor }}>{c.name[0]}</div>
                          <span className="text-xs font-black uppercase tracking-widest truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Core */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group relative ${isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                    : isDarkMode
                      ? 'text-slate-500 hover:text-white hover:bg-white/10'
                      : 'text-slate-400 hover:text-[#1B2559] hover:bg-slate-500/5'
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <Icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                    <span className="text-xs font-black uppercase tracking-[0.15em]">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Session Bottom Block */}
          <div className={`p-6 mt-auto border-t transition-all ${isDarkMode ? 'border-white/5' : 'border-white/30'}`}>
            <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-white/10 border-white/50 shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                  <div className={`w-full h-full rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#0d121d]' : 'bg-white'}`}>
                    {user.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-xs font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>{user?.name?.[0]}</div>}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black tracking-tight truncate text-[var(--text-main)]">{user?.name}</p>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mt-1">Authenticated</p>
                </div>
              </div>
              <button
                onClick={() => { onContextChange('Global'); setActiveTab('profile'); onClose(); }}
                className={`w-full group py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/10 backdrop-blur-md text-blue-600 shadow-xl shadow-blue-500/5 hover:bg-blue-600 hover:text-white border border-white/50'
                  }`}
              >
                <UserCog size={16} className="transition-transform group-hover:rotate-45" /> Profile Settings
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
