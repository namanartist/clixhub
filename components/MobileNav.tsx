import React, { useMemo } from 'react';
import { LayoutDashboard, Calendar, Globe, Menu, MessageSquare } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleMenu: () => void;
  isDarkMode: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onToggleMenu, isDarkMode }) => {
  const tabs = useMemo(() => [
    { id: 'dashboard', label: 'Core', icon: LayoutDashboard, pattern: ['dashboard', 'club-dashboard'] },
    { id: 'events', label: 'Ops', icon: Calendar, pattern: ['events', 'club-events'] },
    { id: 'clubs', label: 'Nexus', icon: Globe, pattern: ['clubs'] },
    { id: 'chat', label: 'Comm', icon: MessageSquare, pattern: ['chat'] },
  ], []);

  const activeIndex = useMemo(() => {
    const idx = tabs.findIndex(t => t.pattern.includes(activeTab));
    return idx === -1 ? 0 : idx;
  }, [activeTab, tabs]);

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-[100]">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-blue-600/20 blur-[40px] rounded-[3rem] -z-10 animate-pulse-slow" />
      
      <div className={`relative px-1.5 py-1.5 rounded-[2.8rem] border backdrop-blur-4xl shadow-4xl flex items-center justify-between transition-all duration-700 ${
        isDarkMode 
          ? 'bg-black/40 border-white/10' 
          : 'bg-white/ border-white/60'
      }`}>
        
        {/* Morphing Sliding Indicator */}
        <div 
          className="absolute h-14 w-[18.5%] bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-600/40 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{ 
            left: `calc(${activeIndex * 20}% + 6px)`,
            opacity: activeIndex !== -1 ? 1 : 0
          }}
        >
           <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-white/20 to-transparent rounded-[2rem]" />
           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/ blur-sm rounded-full" />
        </div>

        {tabs.map((tab) => {
          const isActive = tab.pattern.includes(activeTab);
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center h-14 rounded-[2rem] transition-all duration-500 group active:scale-90 ${
                isActive ? 'text-white' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon size={isActive ? 20 : 18} className={`transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_white]' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`} />
                {isActive && (
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1 duration-500">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Global Action / Menu Divider */}
        <div className={`w-px h-8 mx-1 ${isDarkMode ? 'bg-white/' : 'bg-slate-200'}`} />

        {/* Menu Button */}
        <button
          onClick={onToggleMenu}
          className={`relative flex flex-col items-center justify-center h-14 w-14 rounded-[2rem] transition-all duration-500 group active:scale-90 ${
            isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-blue-600'
          }`}
        >
          <div className="relative z-10 p-2 rounded-xl bg-white/ border border-white/5 group-hover:border-blue-500/30 transition-all">
            <Menu size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </div>
          
          {/* Status Dot */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-black animate-pulse" />
        </button>

      </div>
    </div>
  );
};

export default MobileNav;
