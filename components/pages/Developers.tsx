import React, { useState, useEffect } from 'react';
import {
   Terminal, Users, Code, ArrowLeft, Github, Linkedin, Mail,
   Award, GraduationCap, ExternalLink, Zap, Sparkles, Globe,
   CheckCircle2, Star, Briefcase, Heart, Rocket, Cpu, Layers, Monitor, MousePointer2, Trash2
} from 'lucide-react';

interface Props {
   onBack: () => void;
   isDarkMode: boolean;
   currentUser?: any;
   allUsers?: any[];
   mode?: 'console' | 'public';
}

const Developers: React.FC<Props> = ({ onBack, isDarkMode }) => {
   const [scrollY, setScrollY] = useState(0);

   useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const projects = [
      {
         title: "Clean-Up Platform",
         subtitle: "SIH Project",
         desc: "Smart platform for managing cleanup drives and resources efficiently. Built for real-world problem solving during Smart India Hackathon.",
         tech: ["MERN", "React", "Node.js", "Express", "MongoDB"],
         status: "Active",
         link: "https://clean-up-eea39809.base44.app/",
         icon: <Trash2 size={20} className="text-emerald-500" />,
         color: "from-emerald-500/10 to-teal-500/10"
      },
      {
         title: "MITS Website Redesign",
         subtitle: "Modern UI Overhaul",
         desc: "Modern UI redesign of MITS Gwalior official website with focus on UX, performance, and institutional aesthetics.",
         tech: ["React.js", "Tailwind CSS", "Framer Motion"],
         status: "Completed",
         link: "https://mitsgwl.vercel.app",
         icon: <Globe size={20} className="text-blue-500" />,
         color: "from-blue-500/10 to-indigo-500/10"
      },
      {
         title: "Personal Portfolio",
         subtitle: "Professional Showcase",
         desc: "Digital signature showcasing projects, skills, and journey. Built with a modern high-performance web stack.",
         tech: ["React", "Tailwind", "Vercel"],
         status: "Active",
         link: "https://namanlahariya.vercel.app",
         icon: <Monitor size={20} className="text-purple-500" />,
         color: "from-purple-500/10 to-fuchsia-500/10"
      }
   ];

   const skills = [
      { category: "Languages", items: ["JavaScript", "Python", "C++"] },
      { category: "Frontend", items: ["React.js", "HTML", "CSS", "Tailwind"] },
      { category: "Backend", items: ["Node.js", "Express.js"] },
      { category: "Database", items: ["MongoDB"] },
      { category: "Tools", items: ["Git", "GitHub", "Vercel"] },
      { category: "Design", items: ["Problem Solving", "UI/UX Design"] }
   ];

   return (
      <div className={`min-h-screen font-sans selection:bg-primary selection:text-white ${isDarkMode ? 'bg-[#05060f] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>

         {/* Background Orbs */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-200'}`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-200'}`} />
         </div>

         {/* Floating Back Button */}
         <button
            onClick={onBack}
            className={`fixed top-8 left-8 z-50 p-4 rounded-2xl border backdrop-blur-3xl transition-all duration-500 group ${isDarkMode ? 'bg-white/ border-white/10 hover:border-white/20' : 'bg-white/ border-slate-200'
               }`}
         >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
         </button>

         <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-24">

            {/* Header Section */}
            <div className="text-center space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
                  <Code size={16} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Lead Architect</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">
                  Meet the <span className="text-primary">Developer</span>
               </h1>
               <p className="max-w-xl mx-auto text-slate-500 font-medium">
                  Full Stack Developer | Intelligent Systems Architect. Focused on building high-performance MERN stack applications and solving real-world institutional challenges.
               </p>
            </div>

            {/* Primary Developer Card */}
            <div className={`reveal rounded-[3rem] border p-8 md:p-12 transition-all duration-700 shadow-4xl ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200'
               }`}>
               <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="w-48 h-56 rounded-[2.5rem] bg-slate-800overflow-hidden relative border-4 border-primary/20">
                        <img src="/naman_profile.jpg" alt="Naman Lahariya" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                     </div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                     <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-primary">Naman Lahariya</h2>
                        <p className="text-lg font-bold flex items-center justify-center md:justify-start gap-2 mt-2 opacity-60">
                           <Zap size={18} className="text-primary" /> Student & MERN Stack Developer
                        </p>
                        <p className="text-sm font-bold flex items-center justify-center md:justify-start gap-2 mt-1 opacity-40">
                           <GraduationCap size={18} /> Mathematics and Computing | MITS Gwalior
                        </p>
                        <p className="text-xs font-bold flex items-center justify-center md:justify-start gap-2 mt-1 opacity-40">
                           <Globe size={14} /> Gwalior, India
                        </p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <a href="https://github.com/namanartist" target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/ text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                           <Github size={14} /> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/naman-lahariya" target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                           <Linkedin size={14} /> LinkedIn
                        </a>
                        <a href="mailto:lahariyanaman5@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                           <Mail size={14} /> Email
                        </a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Info Grid: Education & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200 shadow-xl'}`}>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 rounded-xl bg-primary/10 text-primary"><GraduationCap size={24} /></div>
                     <h3 className="text-xl font-black tracking-tight italic">Education</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800flex items-center justify-center overflow-hidden">
                           <img src="/mitslogo.jpg" alt="MITS" className="w-full h-full object-cover scale-150" />
                        </div>
                        <div>
                           <p className="font-black text-primary text-sm uppercase">Madhav Institute of Technology & Science</p>
                           <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Gwalior, Madhya Pradesh</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/ space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-40 text-primary">Degree</p>
                           <p className="text-xs font-black ">B.Tech in Mathematics and Computing</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/ space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-40 text-primary">Timeline</p>
                           <p className="text-xs font-black">2025 - 2029</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200 shadow-xl'}`}>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 rounded-xl bg-primary/10 text-primary"><Award size={24} /></div>
                     <h3 className="text-xl font-black tracking-tight italic">Key Achievements 🏆</h3>
                  </div>
                  <ul className="space-y-4">
                     {[
                        "Built project for Smart India Hackathon (SIH) for real-world problem solving",
                        "Developed Clean-Up Platform for efficient task/resource management",
                        "Participated in Frontend Battle @ MITS Gwalior, redesigning institute website",
                        "Designed and deployed modern web apps using MERN stack",
                        "Actively learning and building in Intelligent Systems + full-stack development"
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 group">
                           <Star size={14} className="mt-1 text-primary group-hover:rotate-45 transition-transform" />
                           <p className="text-xs font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{item}</p>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-12">
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                     <Zap size={16} className="fill-primary" />
                     <span className="text-xs font-black uppercase tracking-widest">Technical Toolkit</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {skills.map((s, i) => (
                     <div key={i} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/ border-white/10 hover:border-primary/30' : 'bg-whiteborder-slate-200 hover:border-primary/30 shadow-xl'} transition-all group`}>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 opacity-50">{s.category}</p>
                        <div className="space-y-2">
                           {s.items.map(item => (
                              <p key={item} className="text-xs font-bold tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">{item}</p>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Featured Projects Section */}
            <div className="space-y-12">
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                     <Heart size={16} className="fill-emerald-500" />
                     <span className="text-xs font-black uppercase tracking-widest">Featured Creations</span>
                  </div>
                  <p className="max-w-xl mx-auto text-slate-500 font-medium text-sm">
                     High-performance web applications and problem-solving systems.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {projects.map((p, i) => (
                     <a key={i} href={p.link} target="_blank" className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200 shadow-xl'}`}>
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/ flex items-center justify-center">{p.icon}</div>
                              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500`}>{p.status}</div>
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-xl font-black italic tracking-tight uppercase">{p.title}</h3>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{p.subtitle}</p>
                              <p className="text-[11px] leading-relaxed opacity-60 font-medium">{p.desc}</p>
                           </div>
                        </div>
                        <div className="pt-6 space-y-4">
                           <div className="flex flex-wrap gap-2">
                              {p.tech.map(t => (
                                 <span key={t} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/ text-[8px] font-black uppercase tracking-widest">{t}</span>
                              ))}
                           </div>
                           <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Launch Sequence <ExternalLink size={12} />
                           </div>
                        </div>
                     </a>
                  ))}
               </div>
            </div>

            {/* Portfolio CTA */}
            <div className={`p-12 rounded-[3.5rem] text-center space-y-8 relative overflow-hidden group ${isDarkMode ? 'bg-white/' : 'bg-whiteborder border-slate-200 shadow-3xl'}`}>
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Globe size={48} className="mx-auto text-primary animate-spin-slow opacity-30" />
               <div className="space-y-4 relative z-10">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">Explore My Portal</h2>
                  <p className="max-w-md mx-auto text-slate-500 text-sm font-medium">Dive deeper into my technical journey, case studies, and full portfolio.</p>
               </div>
               <a href="https://namanlahariya.vercel.app" target="_blank" className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-whitetext-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-4xl hover:scale-105 transition-all">
                  Launch Portfolio <ExternalLink size={14} />
               </a>
            </div>

            {/* Partners & Mentors */}
            <div className="space-y-24">
               {/* Supporting Partner */}
               <div className="space-y-12">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center"><Users size={20} /></div>
                     <h3 className="text-xl font-black tracking-tight italic">Supporting Partner</h3>
                  </div>
                  <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-whiteborder-slate-200'}`}>
                     <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800overflow-hidden shrink-0 border-2 border-primary/20">
                           <img src="/naitik.jpg" alt="Naitik Goyal" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div>
                              <h4 className="text-2xl font-black tracking-tight italic uppercase">Naitik Goyal</h4>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Technical Collaborator</p>
                           </div>
                           <p className="text-xs font-medium text-slate-500 italic max-w-2xl">
                              "Professional synergy and collaboration have been vital in refining the system architecture and ensuring institutional scalability."
                           </p>
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                              <a href="https://www.linkedin.com/in/naitik-goyal-og" target="_blank" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                 <Linkedin size={12} /> LinkedIn
                              </a>
                              <a href="https://naitikgoyal-portfolio.netlify.app/" target="_blank" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                                 <Globe size={12} /> Portfolio
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Institutional Guidance */}
               <div className="space-y-12 pb-24">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center"><GraduationCap size={20} /></div>
                     <h3 className="text-xl font-black tracking-tight italic">Institutional Guidance</h3>
                  </div>
                  <div className={`p-12 rounded-[3.5rem] border text-center space-y-8 ${isDarkMode ? 'bg-gradient-to-b from-white/5 to-transparent border-white/5' : 'bg-whiteborder-slate-200'}`}>
                     <div className="w-32 h-32 rounded-full mx-auto p-1.5 bg-gradient-to-br from-primary to-purple-600">
                        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800border-4 border-white dark:border-slate-900 overflow-hidden flex items-center justify-center">
                           <img src="/minakshi.jpg" alt="Dr. Minakshi Dahiya" className="w-full h-full object-cover" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-3xl font-black italic tracking-tighter uppercase italic">Dr. Minakshi Dahiya</h4>
                        <div className="space-y-1">
                           <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Assistant Professor</p>
                           <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Engineering Mathematics And Computing Department</p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 italic max-w-2xl mx-auto pt-6">
                           "Under the expert supervision and academic mentorship of Dr. Dahiya, this platform was benchmarked against institutional standards to ensure research-grade stability."
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                           <a href="https://www.linkedin.com/in/minakshi-poonia-15976424b" target="_blank" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                              <Linkedin size={12} /> LinkedIn
                           </a>
                           <a href="https://web.mitsgwalior.in/faculty-profiles-emc-2/dr-minakshi-dahiya" target="_blank" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                              <Globe size={12} /> Faculty Profile
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         <style>{`
        .reveal {
           animation: reveal 1s cubic-bezier(0.2, 0, 0, 1) forwards;
        }
        @keyframes reveal {
           from { opacity: 0; transform: translateY(40px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
           animation: spin 12s linear infinite;
        }
        @keyframes spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
   );
};

export default Developers;
