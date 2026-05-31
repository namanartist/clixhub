import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Send,
  CheckCircle2,
  GraduationCap,
  Lock,
  Globe,
  Users
} from 'lucide-react';
import { db } from '../../db';
import { User, Club, Role, ClubRole } from '../../types';

// --- SHARED LAYOUT ---
interface LayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack: () => void;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const PublicLayout: React.FC<LayoutProps> = ({ title, subtitle, icon, onBack, children, isDarkMode = true }) => (
  <div className={`min-h-screen font-sans selection:bg-[#0099FF] selection:text-white ${isDarkMode ? 'bg-[#02040a] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>
    {/* Back Button */}
    <button
      onClick={onBack}
      className={`fixed top-8 left-8 z-50 p-3 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
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
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">CLIX HUB</span>
        </div>

        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 mb-6 shadow-2xl shadow-cyan-500/20">
            {icon}
          </div>
        )}

        <h1 className={`text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.88] mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h1>

        {subtitle && (
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>

    {/* Content Section */}
    <section className={`py-24 px-6 border-t ${isDarkMode ? 'bg-white/10[0.015] border-white/[0.06]' : 'bg-slate-50/10 border-slate-200/50'}`}>
      <div className="max-w-[1200px] mx-auto">
        {children}
      </div>
    </section>
  </div>
);

// --- LEGAL PAGES ---
export const LegalDocs: React.FC<{ type: 'privacy' | 'tos'; onBack: () => void }> = ({ type, onBack }) => {
  const content = type === 'privacy' ? {
    title: 'Privacy & Security',
    subtitle: 'How CLIX HUB Protects Your Campus Identity',
    body: (
      <div className="space-y-10 text-slate-300 leading-relaxed font-light">
        <div className="bg-cyan-500/5 border border-cyan-400/20 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-lg font-medium text-white">CLIX HUB operates under institutional-grade data protection standards, ensuring your academic and organizational identity remains secure and private.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <ShieldCheck size={24} /> Data Collection & Storage
            </h3>
            <p>We collect only essential identity markers required for authentication, event registration, and certification verification: institutional email, enrollment number, and role information. All personal data is encrypted end-to-end and stored on secured servers with multi-factor access controls.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <ShieldCheck size={24} /> Verifiable Credentials
            </h3>
            <p>Certificates and achievements issued through CLIX HUB are cryptographically hashed with timestamp verification. This ensures all credentials are immutable, tamper-proof, and verifiable by institutional partners and external organizations without exposing sensitive personal data.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <ShieldCheck size={24} /> Tiered Access Control
            </h3>
            <p>Your profile data is protected by role-based access restrictions. Student leaders can opt into public directory visibility for networking purposes. Faculty moderators have secured access to aggregated analytics. Personal contact information is never exposed without your explicit consent.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <ShieldCheck size={24} /> Audit & Compliance
            </h3>
            <p>All administrative actions—from event approvals to financial transactions—are logged in an immutable audit trail. This ensures institutional transparency and accountability. No data is deleted; historical records are archived for compliance purposes.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <ShieldCheck size={24} /> Third-Party Privacy
            </h3>
            <p>CLIX HUB does not share personal data with external organizations without institutional authorization. LinkedIn and GitHub profiles are linked only with your explicit consent for professional networking features.</p>
          </div>
        </div>
      </div>
    )
  } : {
    title: 'Terms of Service',
    subtitle: 'Campus Guidelines & Usage Terms',
    body: (
      <div className="space-y-10 text-slate-300 leading-relaxed font-light">
        <div className="bg-cyan-500/5 border border-cyan-400/20 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-lg font-medium text-white">By accessing CLIX HUB, you agree to operate within institutional guidelines and respect the community's shared digital space.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">1. Institutional Identity Requirement</h3>
            <p>All accounts must be registered using your official MITS institutional email address. Account sharing, proxy usage, or impersonation violates the student code of conduct and will result in immediate account suspension and disciplinary action.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">2. Financial Integrity</h3>
            <p>All transactions for paid club events are processed through secure UPI channels and subject to institutional audit. Uploading fraudulent payment proofs, forging receipts, or attempting financial manipulation will result in suspension of club privileges and potential legal action.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">3. Content Standards</h3>
            <p>Club pages and event descriptions must maintain institutional dignity standards. Hate speech, harassment, political activism, or content violating campus values will be immediately removed. Repeat violations will result in club deactivation.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">4. Attendance & Verification</h3>
            <p>Event attendance is tracked via QR codes and biometric verification. Falsifying attendance records or attempting to claim fraudulent participation hours will invalidate all associated certificates and result in academic discipline.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">5. Leadership Accountability</h3>
            <p>Club leaders accept fiduciary responsibility for club funds and institutional compliance. Leadership decisions are logged and subject to faculty oversight. Gross mismanagement or financial irregularities will trigger investigation and potential role removal.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">6. Platform Availability</h3>
            <p>CLIX HUB operates as a critical institutional system. We guarantee 99.5% uptime during academic terms. Emergency maintenance may require temporary service disruptions with advance notice.</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <PublicLayout
      title={content.title}
      subtitle={content.subtitle}
      icon={<FileText size={32} className="text-cyan-400" />}
      onBack={onBack}
    >
      <div className="bg-[#111C44]/50 border border-cyan-400/20 rounded-[2.5rem] p-10 md:p-16 shadow-2xl backdrop-blur-md space-y-8">
        {content.body}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-500 font-medium uppercase tracking-widest">
          Last Updated: January 2025 | CLIX HUB v1.0
        </div>
      </div>
    </PublicLayout>
  );
};

// --- REPORT ISSUE ---
export const ReportIssue: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'bug' | 'security' | 'feedback'>('bug');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Anonymous Reporter',
      action: `[${category.toUpperCase()}] ${desc}`,
      clubId: 'System'
    });
    setSubmitted(true);
    setTimeout(() => onBack(), 3000);
  };

  if (submitted) {
    return (
      <PublicLayout title="Report Received" onBack={onBack} icon={<CheckCircle2 size={32} className="text-emerald-400" />}>
        <div className="text-center space-y-8 bg-[#111C44]/50 border border-emerald-400/30 rounded-[2.5rem] p-16 shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
          <p className="text-xl text-slate-300 leading-relaxed">Thank you for helping improve CLIX HUB. Your report has been logged and will be reviewed by our technical team within 24 hours.</p>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">Redirecting to home...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
      title="Report an Issue"
      subtitle="Help us improve CLIX HUB by reporting bugs, security concerns, and feature requests."
      icon={<AlertTriangle size={32} className="text-amber-400" />}
      onBack={onBack}
    >
      <div className="bg-[#111C44]/50 border border-amber-400/20 rounded-[2.5rem] p-10 md:p-16 shadow-2xl backdrop-blur-md max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-amber-400 ml-2">Report Category</label>
            <div className="grid grid-cols-3 gap-4">
              {(['bug', 'security', 'feedback'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-4 px-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${category === cat
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 text-slate-400 hover:bg-white/10 border border-white/10'
                    }`}
                >
                  {cat === 'bug' && '🐛 Bug'}
                  {cat === 'security' && '🔒 Security'}
                  {cat === 'feedback' && '💡 Feature'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-amber-400 ml-2">Detailed Description</label>
            <textarea
              required
              rows={8}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Provide as much detail as possible to help us understand and fix the issue..."
              className="w-full bg-[#0B1437] border border-amber-400/20 rounded-3xl p-6 text-white outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all font-medium placeholder:text-slate-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!desc.trim()}
            className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

// --- FACULTY PORTAL INFO ---
export const FacultyPortalInfo: React.FC<{ onBack: () => void; onLogin: () => void }> = ({ onBack, onLogin }) => {
  const features = [
    { icon: '✓', title: 'Event Approvals', desc: 'Review and authorize all club events with instant notifications' },
    { icon: '✓', title: 'Budget Oversight', desc: 'Audit financial transactions and fund allocations in real-time' },
    { icon: '✓', title: 'Certificates & Credentials', desc: 'Issue verified and tamper-proof digital credentials' },
    { icon: '✓', title: 'Leadership Registry', desc: 'Maintain records of all club leadership positions and transitions' },
    { icon: '✓', title: 'Attendance Verification', desc: 'Confirm genuine participation in institutional events' },
    { icon: '✓', title: 'Performance Analytics', desc: 'Track club engagement, event success metrics, and student outcomes' }
  ];

  return (
    <PublicLayout
      title="Faculty Portal"
      subtitle="Institutional Oversight & Leadership Governance"
      icon={<GraduationCap size={32} className="text-emerald-400" />}
      onBack={onBack}
    >
      <div className="space-y-12">
        {/* Access Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 rounded-[2.5rem] p-10 space-y-6 shadow-xl shadow-emerald-500/10 backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Governance Authority</h3>
              <p className="text-slate-300 leading-relaxed">Faculty coordinators serve as the institutional oversight body, ensuring all student club activities align with campus standards and educational mission.</p>
            </div>
            <ul className="space-y-3">
              {['View all club proposals', 'Approve/reject event applications', 'Monitor financial compliance'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-[2.5rem] p-10 space-y-6 shadow-xl shadow-cyan-500/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 mb-6">
                <Lock size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure Access</h3>
              <p className="text-slate-300 leading-relaxed mb-6">Access to the Faculty Portal is restricted to verified institutional accounts with multi-factor authentication and role-based permissions.</p>
            </div>
            <button
              onClick={onLogin}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-cyan-600/30 transition-all"
            >
              Access Faculty Portal
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Portal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-[#111C44]/50 border border-cyan-400/10 rounded-2xl p-8 space-y-4 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group"
              >
                <div className="text-3xl font-black text-cyan-400 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Info */}
        <div className="bg-gradient-to-r from-[#111C44]/50 to-[#0F1A3D]/50 border border-white/10 rounded-[2.5rem] p-12 space-y-6">
          <h2 className="text-2xl font-bold text-white">Enrollment Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">1</div>
              <h4 className="text-lg font-bold text-white">Request Access</h4>
              <p className="text-slate-400 text-sm">Contact your institutional administrator with your institutional email ID and faculty designation.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">2</div>
              <h4 className="text-lg font-bold text-white">Verification</h4>
              <p className="text-slate-400 text-sm">Your credentials will be verified through MITS directory and you'll receive activation instructions.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">3</div>
              <h4 className="text-lg font-bold text-white">Activate Portal</h4>
              <p className="text-slate-400 text-sm">Set up your secure password and enable two-factor authentication to begin managing clubs.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

// --- STUDENT LEADERSHIP ---
export const StudentLeadership: React.FC<{ clubs: Club[]; users: User[]; onBack: () => void }> = ({ clubs, users, onBack }) => {
  const leaders = clubs.map(club => {
    const president = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
    const vicePresident = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.VICE_PRESIDENT));
    const treasurer = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === 'Treasurer'));
    return { club, president, vicePresident, treasurer };
  }).filter(item => item.president);

  return (
    <PublicLayout
      title="Campus Leadership"
      subtitle="Meet the student leaders driving CLIX HUB innovation"
      icon={<Users size={32} className="text-purple-400" />}
      onBack={onBack}
    >
      <div className="space-y-12">
        {/* Leadership Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-2xl p-8 text-center space-y-2">
            <div className="text-4xl font-black text-purple-400">{leaders.length}</div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Club Presidents</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl p-8 text-center space-y-2">
            <div className="text-4xl font-black text-cyan-400">{clubs.length}</div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Active Clubs</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-8 text-center space-y-2">
            <div className="text-4xl font-black text-emerald-400">{users.length}</div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Total Members</p>
          </div>
        </div>

        {/* Leadership Grid */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Club Presidents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map(({ club, president, vicePresident, treasurer }) => (
              <div
                key={club.id}
                className="group bg-gradient-to-br from-[#111C44]/80 to-[#0B1437]/80 border border-purple-400/20 rounded-[2.5rem] overflow-hidden hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                {/* Club Color Header */}
                <div
                  className="h-32 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${club.themeColor || '#8b5cf6'}80, ${club.themeColor || '#8b5cf6'}20)`
                  }}
                >
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white via-transparent to-transparent" />
                </div>

                {/* Profile Photo */}
                <div className="absolute top-20 left-8 z-10 p-1 bg-gradient-to-br from-[#0B1437] to-[#111C44] rounded-3xl">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-600 to-slate-800 overflow-hidden border-2 border-purple-400/30">
                    {president?.photoUrl ? (
                      <img src={president.photoUrl} className="w-full h-full object-cover" alt={president.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-purple-400">
                        {president?.name[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 px-8 pb-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">{president?.name}</h3>
                    <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mt-2">President</p>
                    <p className="text-xs text-slate-400 mt-1">{club.name}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Branch</p>
                      <p className="text-sm font-medium text-slate-300">{president?.branch || 'General'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Tenure</p>
                      <p className="text-sm font-medium text-slate-300">2025-26</p>
                    </div>
                  </div>

                  {/* Other Leaders */}
                  {(vicePresident || treasurer) && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Leadership Team</p>
                      {vicePresident && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-slate-400">VP: <span className="text-white font-medium">{vicePresident.name}</span></span>
                        </div>
                      )}
                      {treasurer && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-slate-400">Treasurer: <span className="text-white font-medium">{treasurer.name}</span></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Verification Badge */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-400/20 rounded-xl text-xs font-bold text-purple-400 uppercase tracking-widest">
                      <ShieldCheck size={14} /> Verified Leader
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {leaders.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 opacity-40">
                <Users size={64} className="mx-auto" />
                <p className="text-xl font-bold">Leadership Roster Syncing...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};