
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Club } from '../../types';
import { Globe, Search, ArrowUpRight, Users } from 'lucide-react';

interface Props {
  clubs: Club[];
  onBack: () => void;
  isDarkMode?: boolean;
}

const ClubDirectoryPublic: React.FC<Props> = ({ clubs, onBack, isDarkMode = true }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredClubs = clubs.filter(c =>
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClubClick = (clubId: string) => {
    navigate(`/club/${clubId}/website`);
  };

  const categories = ['All', 'Technical', 'Cultural', 'Social', 'Sports'];

  return (
    <div className={`min-h-screen font-sans selection:bg-[#0099FF] selection:text-white ${isDarkMode ? 'bg-[#02040a] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`fixed top-8 left-8 z-50 p-3 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
        title="Back"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse ${isDarkMode ? 'bg-[#0099FF]/15' : 'bg-blue-200/40'}`} style={{ animationDuration: '4s' }} />
          <div className={`absolute -bottom-20 left-1/2 w-[800px] h-[400px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-900/8' : 'bg-blue-50/30'}`} />
        </div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md mb-8" style={{ borderColor: isDarkMode ? 'rgba(34,211,238,0.3)' : 'rgba(34,211,238,0.2)', background: isDarkMode ? 'rgba(34,211,238,0.08)' : 'rgba(34,211,238,0.06)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Club Ecosystem Directory</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[0.88] mb-6">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>Join Your</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Community.</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {clubs.length || 40}+ student-led communities. Technical, cultural, social, and sports wings. Join, lead, and make an impact across campus.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className={`py-8 px-6 border-b sticky top-0 z-40 backdrop-blur-xl ${isDarkMode ? 'bg-[#02040a]/80 border-white/[0.06]' : 'bg-white/ border-slate-200'}`}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full rounded-2xl pl-14 pr-6 py-3.5 text-sm font-bold transition-all outline-none border ${isDarkMode ? 'bg-white/ border-white/10 text-white placeholder:text-slate-600 focus:bg-white/ focus:border-cyan-400/50' : 'bg-whiteborder-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-400'}`}
              />
            </div>

            <div className={`flex gap-2 p-2 rounded-2xl border overflow-x-auto ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200'}`}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-[#0099FF] mb-3`}>Directory</p>
            <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {filteredClubs.length} Club{filteredClubs.length !== 1 ? 's' : ''} Available
            </h2>
          </div>

          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <div
                  key={club.id}
                  onClick={() => handleClubClick(club.id)}
                  className={`group relative p-8 rounded-3xl border transition-all hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden ${isDarkMode ? 'bg-[#0d121d]border-white/10 hover:border-cyan-400/50 hover:shadow-2xl' : 'bg-whiteborder-slate-200 hover:shadow-xl'}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-3xl -mr-4 -mt-4 group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: club.themeColor || '#0099FF' }}
                      >
                        {club.name[0]}
                      </div>
                      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                        ✓ Verified
                      </div>
                    </div>

                    <h3 className={`text-2xl font-black tracking-tight mb-3 group-hover:text-cyan-400 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {club.name}
                    </h3>

                    <p className={`text-sm font-medium leading-relaxed mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {club.tagline || `The official ${club.category} community of MITS Gwalior.`}
                    </p>

                    <div className={`pt-6 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {club.category}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <Users size={12} /> Active Community
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClubClick(club.id); }}
                        className={`p-3 rounded-full transition-all active:scale-95 ${isDarkMode ? 'bg-white/ text-cyan-400 hover:bg-cyan-500 hover:text-white' : 'bg-slate-100 text-cyan-600 hover:bg-cyan-500 hover:text-white'}`}
                      >
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`py-20 text-center space-y-4 rounded-3xl border ${isDarkMode ? 'bg-[#0d121d]/50 border-white/5' : 'bg-slate-50border-slate-200'}`}>
              <Globe size={64} className={isDarkMode ? 'text-slate-700 mx-auto' : 'text-slate-300 mx-auto'} />
              <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No clubs found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClubDirectoryPublic;
