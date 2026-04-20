
import React, { useState, useRef, useMemo } from 'react';
// @ts-ignore
import { Club, CustomSection, Event } from '../../types';
import {
  CheckCircle2, Sparkles, Eye, Upload, Loader2, Plus, Trash2,
  Zap, Layout, Palette, FileText, Globe2, Layers,
  Rocket, Clock, Tag, CreditCard, X, Monitor, Smartphone,
  Wand2, ArrowRight, Image as ImageIcon
} from 'lucide-react';
// @ts-ignore
import { smartLogicService } from '../../logic';

/* ── 7 Pre-designed Themes ── */
const PRESET_THEMES = [
  { id: 'midnight-blue',  name: 'Midnight Blue',   color: '#0055FF', desc: 'Electric precision for tech clubs' },
  { id: 'emerald-tech',   name: 'Emerald Tech',    color: '#10B981', desc: 'Growth & innovation' },
  { id: 'crimson-force',  name: 'Crimson Force',   color: '#EF4444', desc: 'Bold energy & dominance' },
  { id: 'golden-hour',    name: 'Golden Hour',     color: '#F59E0B', desc: 'Premium warmth & prestige' },
  { id: 'cosmic-purple',  name: 'Cosmic Purple',   color: '#8B5CF6', desc: 'Galaxy-level aesthetics' },
  { id: 'rose-quartz',    name: 'Rose Quartz',     color: '#EC4899', desc: 'Creative & cultural vibes' },
  { id: 'arctic-frost',   name: 'Arctic Frost',    color: '#06B6D4', desc: 'Clean STEM precision' },
];

interface Props {
  club: Club;
  events: Event[];
  onSave: (updatedClub: Club) => void;
  isDarkMode: boolean;
}

/* ── HSL → hex helper ── */
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
};

const ClubSiteEditor: React.FC<Props> = ({ club, events, onSave }) => {
  const [formData, setFormData] = useState<Club>({ ...club, customSections: club.customSections || [] });
  const [activeTab, setActiveTab] = useState<'themes' | 'content' | 'posts' | 'preview'>('themes');
  const [showSaved, setShowSaved] = useState(false);

  /* Theme generation */
  const [aiThemePrompt, setAiThemePrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [aiTheme, setAiTheme] = useState<{ color: string; name: string; desc: string } | null>(null);

  /* Content AI generation */
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  /* Posts */
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  /* Preview */
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const bannerRef = useRef<HTMLInputElement>(null);

  /* Split posts from regular sections by marker */
  const posts = useMemo(() => (formData.customSections || []).filter(s => s.iconName === '__POST__'), [formData.customSections]);
  const sections = useMemo(() => (formData.customSections || []).filter(s => s.iconName !== '__POST__'), [formData.customSections]);

  /* ── Handlers ── */
  const handleSave = () => { onSave(formData); setShowSaved(true); setTimeout(() => setShowSaved(false), 3000); };

  const applyTheme = (color: string) => setFormData(prev => ({ ...prev, themeColor: color }));

  const handleGenerateAITheme = async () => {
    if (!aiThemePrompt.trim()) return;
    setIsGeneratingTheme(true);
    try {
      const p = aiThemePrompt.toLowerCase();
      let h = 210, s = 90, l = 55;
      if (p.includes('tech') || p.includes('code') || p.includes('robot') || p.includes('digital'))   { h = 210; s = 100; l = 55; }
      else if (p.includes('nature') || p.includes('eco') || p.includes('green'))                       { h = 145; s = 75; l = 45; }
      else if (p.includes('fire') || p.includes('energy') || p.includes('sport') || p.includes('power')) { h = 15; s = 95; l = 55; }
      else if (p.includes('art') || p.includes('creative') || p.includes('media') || p.includes('design')) { h = 300; s = 70; l = 55; }
      else if (p.includes('science') || p.includes('research') || p.includes('physics') || p.includes('lab')) { h = 185; s = 80; l = 45; }
      else if (p.includes('culture') || p.includes('music') || p.includes('dance'))                    { h = 330; s = 80; l = 55; }
      else if (p.includes('social') || p.includes('nss') || p.includes('community'))                   { h = 25;  s = 85; l = 55; }
      else { const hash = aiThemePrompt.split('').reduce((a, c) => a + c.charCodeAt(0), 0); h = hash % 360; s = 65 + (hash % 30); l = 44 + (hash % 16); }
      const color = hslToHex(h, s, l);
      const words = aiThemePrompt.split(' ').slice(0, 3).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
      setAiTheme({ color, name: `${words} Theme`, desc: `System-crafted for: "${aiThemePrompt}"` });
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    try {
      const result = await smartLogicService.generateClubContent(formData.name, formData.category);
      setFormData(prev => ({
        ...prev,
        tagline: result.tagline,
        description: result.mission,
        customSections: [
          ...(prev.customSections || []).filter(s => s.iconName === '__POST__'),
          ...result.sections.map((s: any) => ({ id: `ai-${Date.now()}-${Math.random()}`, title: s.title, content: s.content, iconName: s.iconName }))
        ]
      }));
    } catch { alert('Content Engine is at capacity. Try again shortly.'); }
    finally { setIsGeneratingContent(false); }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const addSection = () => setFormData(prev => ({
    ...prev,
    customSections: [...(prev.customSections || []), { id: `sec-${Date.now()}`, title: 'New Section', content: 'Describe this section...', iconName: 'Layers' }]
  }));

  const removeSection = (id: string) => setFormData(prev => ({ ...prev, customSections: (prev.customSections || []).filter(s => s.id !== id) }));

  const updateSection = (id: string, field: 'title' | 'content', val: string) => setFormData(prev => ({
    ...prev, customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, [field]: val } : s)
  }));

  const addPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post: CustomSection = { id: `post-${Date.now()}`, title: newPost.title, content: newPost.content, iconName: '__POST__' };
    setFormData(prev => ({ ...prev, customSections: [...(prev.customSections || []), post] }));
    setNewPost({ title: '', content: '' });
    setIsAddingPost(false);
  };

  const removePost = (id: string) => setFormData(prev => ({ ...prev, customSections: (prev.customSections || []).filter(s => s.id !== id) }));

  const inputCls = 'w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-primary/60 text-white font-medium text-sm transition-all placeholder:text-white/25';
  const areaCls  = `${inputCls} leading-relaxed resize-none`;

  const tabs = [
    { id: 'themes',  label: 'Themes',  icon: Palette,   count: null },
    { id: 'content', label: 'Content', icon: FileText,   count: null },
    { id: 'posts',   label: 'Posts',   icon: Globe2,     count: posts.length > 0 ? posts.length : null },
    { id: 'preview', label: 'Preview', icon: Eye,        count: null },
  ] as const;

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden" style={{ background: '#040710' }}>

      {/* ══ LEFT EDITOR PANEL ══ */}
      <div className="w-[430px] shrink-0 flex flex-col border-r border-white/5" style={{ background: '#070c18' }}>

        {/* Header */}
        <div className="px-7 py-5 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary"><Layout size={18} /></div>
            <h1 className="text-xl font-black tracking-tight text-white">Site Studio</h1>
          </div>
          <p className="text-xs text-white/35 italic ml-1">Editing: {club.name}</p>
        </div>

        {/* Tab Nav */}
        <div className="flex px-3 pt-3 gap-0.5 border-b border-white/5 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all relative rounded-t-lg ${active ? 'text-primary' : 'text-white/35 hover:text-white/60'}`}>
                <Icon size={12} />{tab.label}
                {tab.count != null && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[7px]">{tab.count}</span>}
                {active && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">

          {/* ── THEMES TAB ── */}
          {activeTab === 'themes' && (
            <div className="space-y-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/35">7 Pre-designed Themes</p>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_THEMES.map(theme => {
                  const active = formData.themeColor === theme.color;
                  return (
                    <button key={theme.id} onClick={() => applyTheme(theme.color)}
                            className={`text-left p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${active ? 'border-2 scale-[1.02]' : 'border-white/5 hover:border-white/15 bg-white/[0.025]'}`}
                            style={active ? { borderColor: theme.color, background: `${theme.color}18` } : {}}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-7 h-7 rounded-lg shadow-lg" style={{ background: theme.color }} />
                        {active && <CheckCircle2 size={14} style={{ color: theme.color }} />}
                      </div>
                      <p className="text-[11px] font-black text-white tracking-tight">{theme.name}</p>
                      <p className="text-[8px] text-white/35 mt-0.5 leading-tight">{theme.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* AI Theme Generator */}
              <div className="p-4 rounded-2xl border border-primary/20 space-y-3" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,85,255,0.08))' }}>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/15 text-primary"><Wand2 size={16} /></div>
                  <div>
                    <p className="text-[11px] font-black text-white">Smart Color Schematics</p>
                    <p className="text-[8px] text-white/35">Describe your club's personality</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input value={aiThemePrompt} onChange={e => setAiThemePrompt(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleGenerateAITheme()}
                         placeholder="e.g. futuristic robotics, coding warriors..."
                         className="flex-1 bg-white/8 border border-white/10 px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/25 outline-none focus:border-primary/50 transition-all" />
                  <button onClick={handleGenerateAITheme} disabled={isGeneratingTheme || !aiThemePrompt.trim()}
                          className="px-3 py-2 rounded-xl bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 transition-all disabled:opacity-40 flex items-center gap-1.5">
                    {isGeneratingTheme ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  </button>
                </div>
                {aiTheme && (
                  <button onClick={() => applyTheme(aiTheme.color)}
                          className={`w-full p-3 rounded-xl border-2 text-left hover:scale-[1.01] transition-all ${formData.themeColor === aiTheme.color ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}
                          style={{ borderColor: aiTheme.color, background: `${aiTheme.color}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg" style={{ background: aiTheme.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-white truncate">{aiTheme.name}</p>
                        <p className="text-[8px] text-white/40 truncate">{aiTheme.desc}</p>
                      </div>
                      {formData.themeColor === aiTheme.color && <CheckCircle2 size={14} style={{ color: aiTheme.color }} />}
                    </div>
                  </button>
                )}
              </div>

              {/* Active color chip */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: formData.themeColor }} />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/25">Active Color</p>
                  <code className="text-xs font-black text-white/60">{formData.themeColor}</code>
                </div>
              </div>
            </div>
          )}

          {/* ── CONTENT TAB ── */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <button onClick={handleGenerateContent} disabled={isGeneratingContent}
                      className="w-full py-3.5 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, var(--primary), #8B5CF6)' }}>
                {isGeneratingContent ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Auto-Generate Content Modules
              </button>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-white/35 ml-1">Hero Tagline</label>
                <input type="text" value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                       placeholder="High-impact mission summary..." className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-white/35 ml-1">Club Description / Vision</label>
                <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}
                          placeholder="The definitive purpose of your club..." className={areaCls} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/35 ml-1">Banner Image URL</label>
                  <button onClick={() => bannerRef.current?.click()}
                          className="text-[8px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                    <Upload size={10} /> Upload
                  </button>
                  <input type="file" accept="image/*" className="hidden" ref={bannerRef} onChange={handleBannerUpload} />
                </div>
                <input type="text" value={formData.bannerUrl || ''} onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })}
                       placeholder="https://example.com/banner.jpg" className={inputCls} />
                {formData.bannerUrl && (
                  <div className="h-20 rounded-xl overflow-hidden border border-white/10 mt-1">
                    <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Custom sections */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/35 ml-1">Content Modules</label>
                  <button onClick={addSection} className="text-[8px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                    <Plus size={10} /> Add
                  </button>
                </div>
                {sections.map(sec => (
                  <div key={sec.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2 group relative">
                    <button onClick={() => removeSection(sec.id)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={12} />
                    </button>
                    <input type="text" value={sec.title} onChange={e => updateSection(sec.id, 'title', e.target.value)}
                           placeholder="Section title" className={`${inputCls} text-xs h-9 py-2`} />
                    <textarea rows={2} value={sec.content} onChange={e => updateSection(sec.id, 'content', e.target.value)}
                              placeholder="Section content..." className={`${areaCls} text-xs`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── POSTS TAB ── */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">Club Posts</p>
                  <p className="text-[9px] text-white/35">Public announcements &amp; updates</p>
                </div>
                <button onClick={() => setIsAddingPost(true)}
                        className="px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-1.5">
                  <Plus size={12} /> New Post
                </button>
              </div>

              {isAddingPost && (
                <div className="p-4 rounded-2xl border border-primary/25 space-y-3" style={{ background: 'rgba(0,85,255,0.05)' }}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-primary">New Post</p>
                  <input type="text" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                         placeholder="Post title..." className={inputCls} />
                  <textarea rows={4} value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                            placeholder="Write your announcement or update..." className={areaCls} />
                  <div className="flex gap-2">
                    <button onClick={addPost} disabled={!newPost.title.trim() || !newPost.content.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-[1.01] transition-all disabled:opacity-40">
                      Publish
                    </button>
                    <button onClick={() => { setIsAddingPost(false); setNewPost({ title: '', content: '' }); }}
                            className="px-4 py-2.5 rounded-xl bg-white/5 text-white/50 text-[9px] font-black uppercase hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {posts.length === 0 && !isAddingPost && (
                <div className="py-14 text-center space-y-2.5 opacity-25">
                  <Globe2 size={36} className="mx-auto text-white" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white">No posts yet</p>
                </div>
              )}

              {posts.map((post, i) => (
                <div key={post.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] group space-y-1.5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[7px] font-black uppercase tracking-widest mb-0.5" style={{ color: formData.themeColor }}>Post #{i + 1}</p>
                      <h4 className="text-sm font-black text-white tracking-tight truncate">{post.title}</h4>
                    </div>
                    <button onClick={() => removePost(post.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── PREVIEW INFO TAB ── */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Current Config</p>
                {[
                  ['Theme Color', <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md inline-block" style={{ background: formData.themeColor }} /><code className="text-[10px]">{formData.themeColor}</code></span>],
                  ['Tagline', formData.tagline || '—'],
                  ['Content Sections', sections.length],
                  ['Published Posts', posts.length],
                  ['Banner', formData.bannerUrl ? <span className="text-emerald-400">Configured</span> : <span className="text-white/25">Default</span>],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex items-center justify-between text-xs gap-3">
                    <span className="text-white/40 shrink-0">{k}</span>
                    <span className="text-white/70 text-right">{v as any}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {(['desktop', 'mobile'] as const).map(m => (
                  <button key={m} onClick={() => setPreviewMode(m)}
                          className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${previewMode === m ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                    {m === 'desktop' ? <Monitor size={13} /> : <Smartphone size={13} />} {m}
                  </button>
                ))}
              </div>
              <p className="text-[8px] text-white/20 text-center">Live preview always visible on the right →</p>
            </div>
          )}
        </div>

        {/* Save Footer */}
        <div className="p-5 border-t border-white/5 space-y-2.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
          {showSaved && (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-2.5">
              <CheckCircle2 size={14} /> Published successfully!
            </div>
          )}
          <button onClick={handleSave}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  style={{ background: 'var(--primary)', boxShadow: `0 8px 30px ${formData.themeColor}40` }}>
            <Rocket size={16} /> Publish Changes
          </button>
        </div>
      </div>

      {/* ══ LIVE PREVIEW PANEL ══ */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#02040a' }}>
        {/* Preview bar */}
        <div className="px-7 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Live Preview</span>
          </div>
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            {(['desktop', 'mobile'] as const).map(m => (
              <button key={m} onClick={() => setPreviewMode(m)}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${previewMode === m ? 'bg-white/10 text-white' : 'text-white/25'}`}>
                {m === 'desktop' ? <Monitor size={11} /> : <Smartphone size={11} />}{m}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable preview frame */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center custom-scrollbar">
          <div className={`${previewMode === 'mobile' ? 'w-[370px]' : 'w-full max-w-3xl'} rounded-[1.75rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/70 transition-all duration-500`}
               style={{ background: '#0a0f1a' }}>

            {/* Hero */}
            <div className="relative h-48 overflow-hidden">
              {formData.bannerUrl
                ? <img src={formData.bannerUrl} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${formData.themeColor}44 0%, #0a0f1a 100%)` }} />
              }
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,15,26,0.9))' }} />
              <div className="absolute bottom-5 left-6 space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-xl"
                       style={{ background: formData.themeColor }}>
                    {formData.name[0]}
                  </div>
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.3em]">MITS Council Org</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">{formData.name}</h2>
                {formData.tagline && <p className="text-xs text-white/60 italic">"{formData.tagline}"</p>}
              </div>
            </div>

            {/* Body */}
            <div className="p-7 space-y-7">
              {formData.description && (
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: formData.themeColor }}>Mission</p>
                  <p className="text-xs text-white/60 leading-relaxed">{formData.description}</p>
                </div>
              )}

              {sections.length > 0 && (
                <div className="grid gap-3">
                  {sections.slice(0, 3).map(sec => (
                    <div key={sec.id} className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.025)' }}>
                      <h4 className="text-xs font-black mb-1" style={{ color: formData.themeColor }}>{sec.title}</h4>
                      <p className="text-[10px] text-white/40 line-clamp-2">{sec.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {posts.length > 0 && (
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: formData.themeColor }}>Latest Posts</p>
                  <div className="space-y-2">
                    {posts.slice(0, 2).map(post => (
                      <div key={post.id} className="p-3.5 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.025)' }}>
                        <p className="text-xs font-black text-white mb-0.5">{post.title}</p>
                        <p className="text-[10px] text-white/40 line-clamp-2">{post.content}</p>
                      </div>
                    ))}
                    {posts.length > 2 && <p className="text-[8px] text-white/20 text-center">+{posts.length - 2} more posts</p>}
                  </div>
                </div>
              )}

              {events.length > 0 && (
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: formData.themeColor }}>Upcoming Events</p>
                  <div className="space-y-2">
                    {events.slice(0, 2).map(ev => (
                      <div key={ev.id} className="p-3.5 rounded-xl border border-white/5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.025)' }}>
                        <div>
                          <p className="text-xs font-black text-white">{ev.title}</p>
                          <p className="text-[8px] text-white/30">{ev.date}</p>
                        </div>
                        <span className={`text-[7px] font-black uppercase px-2 py-1 rounded-full border ${ev.type === 'Paid' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>{ev.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/15">© 2026 MITS GWALIOR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSiteEditor;
