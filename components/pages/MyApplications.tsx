
import React, { useState } from 'react';
import { Applicant, Club } from '../../types';
import { 
  Briefcase, CheckCircle2, Clock, AlertCircle, ChevronRight, Sparkles,
  MapPin, Calendar, Zap, Loader2, Activity, Hash, Copy, Check,
  Search, Filter, Shield, ArrowUpRight, ChevronDown, X
} from 'lucide-react';

interface Props {
  applicants: Applicant[];
  clubs: Club[];
  userName: string;
  isDarkMode: boolean;
  onUpdateStatus?: (appId: string, stage: Applicant['stage']) => void;
}

const MyApplications: React.FC<Props> = ({ applicants, clubs, userName, isDarkMode, onUpdateStatus }) => {
  const myApps = applicants.filter(a => a.name === userName);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stages: Applicant['stage'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Selected'];

  const getStageColor = (stage: Applicant['stage']) => {
    switch (stage) {
      case 'Applied': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Screening': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Interview': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Offer': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Selected': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStageProgress = (stage: Applicant['stage']) => {
    const idx = stages.indexOf(stage);
    return idx < 0 ? 0 : Math.round((idx / (stages.length - 1)) * 100);
  };

  const getStageHint = (stage: Applicant['stage']) => {
    switch (stage) {
      case 'Applied': return 'Identity logged in recruitment pipeline. Awaiting initial screening by club leadership.';
      case 'Screening': return 'Leadership is reviewing your intent statement and skills portfolio. Expect a response in 2–3 days.';
      case 'Interview': return 'Technical and cultural rounds are being scheduled. Check your email for a slot confirmation.';
      case 'Offer': return 'Congratulations! Your offer letter is being generated. Await official club communication.';
      case 'Selected': return 'Welcome to the council! Final onboarding will begin within 48 hours.';
      case 'Rejected': return 'Feedback cycle closed. You can re-apply in the next recruitment cycle. Keep building your skills!';
      default: return 'Synchronizing status with the institutional mainframe...';
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadOffer = (appId: string) => {
    const app = applicants.find(a => a.id === appId);
    const club = clubs.find(c => c.id === app?.clubId);
    if (!app || !club) return;

    const trackingId = getTrackingId(app);
    const html = `
      <html>
        <head>
          <title>MITS Offer Letter - ${trackingId}</title>
          <style>
            body { font-family: serif; color: #000; padding: 40px; line-height: 1.6; }
            .container { border: 8px double #333; padding: 60px; max-width: 800px; margin: auto; position: relative; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { width: 60px; height: 60px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; border-radius: 10px; }
            .title { text-align: center; margin-bottom: 40px; }
            .title h1 { text-transform: uppercase; font-size: 28px; letter-spacing: 2px; }
            .field-row { display: flex; justify-content: space-between; border-top: 1px solid #eee; padding: 15px 0; margin-top: 20px; }
            .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #666; }
            .value { font-size: 16px; font-weight: bold; }
            .footer { margin-top: 80px; display: flex; justify-content: space-between; }
            .sig-line { width: 200px; border-top: 1px solid #000; text-align: center; font-size: 10px; font-weight: bold; padding-top: 5px; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; opacity: 0.03; font-weight: 900; z-index: -1; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="container">
            <div class="watermark">MITS INSTITUTIONAL</div>
            <div class="header">
              <div class="logo">M</div>
              <div style="text-align: right;">
                <div style="font-weight: 900; font-size: 18px;">CLIXHUB RECRUITMENT</div>
                <div style="font-size: 10px; opacity: 0.6;">REF: ${trackingId}</div>
                <div style="font-size: 10px; opacity: 0.6;">DATE: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="title">
              <h1>Offer of Membership</h1>
              <p>MITS Student Organizations Council</p>
            </div>

            <div style="margin-bottom: 30px;">
              <p>Dear <b>${app.name}</b>,</p>
              <p>On behalf of the <b>${club.name}</b>, we are pleased to offer you the position of <b>${app.domain} Member</b> for the Academic Session 2024-25.</p>
              <p>Your selection was based on your exceptional technical aptitude and alignment with the club's vision of institutional excellence at Madhav Institute of Technology & Science.</p>
            </div>

            <div class="field-row">
              <div><div class="label">Organization</div><div class="value">${club.name}</div></div>
              <div style="text-align: right;"><div class="label">Domain Node</div><div class="value">${app.domain}</div></div>
            </div>
            <div class="field-row">
              <div><div class="label">Candidate Roll</div><div class="value">${app.rollNumber}</div></div>
              <div style="text-align: right;"><div class="label">Registry Status</div><div class="value">PROVISIONAL_ACCEPTED</div></div>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #555;"><i>"This offer is subject to the candidate's adherence to the MITS code of conduct and club governance protocols."</i></p>

            <div class="footer">
              <div class="sig-line">Club President</div>
              <div class="sig-line">Faculty Coordinator</div>
            </div>

            <div style="text-align: center; margin-top: 40px; font-size: 8px; opacity: 0.5;">
              ELECTRONICALLY GENERATED DOCUMENT. VERIFICATION CODE: ${app.id.slice(-10).toUpperCase()}
            </div>
          </div>
        </body>
      </html>
    `;

    const win = window.open('', '_blank', 'width=800,height=900');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  // Generate a tracking ID from the applicant ID
  const getTrackingId = (app: Applicant) => {
    const prefix = app.clubId ? app.clubId.replace('club-', '').toUpperCase().slice(0, 4) : 'MITS';
    const suffix = app.id.slice(-6).toUpperCase();
    return `MITS-${prefix}-${suffix}`;
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield size={16}/>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Recruitment Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
          Application <span className="text-gradient">Tracker</span>
        </h1>
        <p className="text-slate-500 font-medium">Live status of your club membership applications and recruitment pipelines.</p>
      </header>

      {myApps.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
          <div className="w-20 h-20 rounded-[2rem] bg-white/ flex items-center justify-center mx-auto">
            <Briefcase size={36} className="text-slate-600" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-white/20 uppercase tracking-widest">No Active Applications</p>
            <p className="text-slate-600 max-w-md mx-auto text-sm">
              Browse the Club Registry to find organizations and begin your journey as a student leader.
            </p>
          </div>
          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all">
            Explore Registry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {myApps.map((app) => {
            const currentStageIndex = stages.indexOf(app.stage);
            const isRejected = app.stage === 'Rejected';
            const isExpanded = expandedId === app.id;
            const trackingId = getTrackingId(app);
            const club = clubs.find(c => c.id === app.clubId);
            const progress = getStageProgress(app.stage);

            return (
              <div
                key={app.id}
                className="rounded-[2.5rem] border border-white/5 bg-white/ overflow-hidden transition-all hover:border-white/10 hover:shadow-xl"
              >
                {/* Top color accent */}
                <div
                  className="h-1 w-full"
                  style={{ background: isRejected ? 'linear-gradient(90deg,#ef4444,#b91c1c)' : `linear-gradient(90deg, ${club?.themeColor || '#4318FF'}, #a855f7)` }}
                />

                <div className="p-8 md:p-10">
                  {/* Row 1: club + status badge + tracking ID */}
                  <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl"
                        style={{ background: club?.themeColor || '#4318FF' }}
                      >
                        {(club?.name || app.domain)[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-black text-white tracking-tight">{club?.name || app.domain + ' Wing'}</h3>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStageColor(app.stage)}`}>
                            {app.stage}
                          </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                          {app.domain} Domain • Cycle {app.recruitmentCycle || new Date().getFullYear()}
                        </p>
                      </div>
                    </div>

                    {/* Tracking ID */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Application ID</p>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/ border border-white/10 rounded-xl group">
                        <Hash size={12} className="text-primary"/>
                        <code className="text-[11px] font-mono font-black text-white">{trackingId}</code>
                        <button
                          onClick={() => handleCopy(trackingId)}
                          className={`p-1.5 rounded-lg transition-all ${copiedId === trackingId ? 'text-emerald-400' : 'text-slate-600 hover:text-white'}`}
                        >
                          {copiedId === trackingId ? <Check size={12}/> : <Copy size={12}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {!isRejected ? (
                    <div className="space-y-6 mb-8">
                      {/* Stage dots */}
                      <div className="relative">
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/ rounded-full" />
                        <div
                          className="absolute top-5 left-0 h-0.5 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%`, background: club?.themeColor || '#4318FF' }}
                        />
                        <div className="relative flex justify-between">
                          {stages.map((stage, i) => {
                            const isCompleted = i < currentStageIndex;
                            const isCurrent = i === currentStageIndex;
                            return (
                              <div key={stage} className="flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500 ${
                                  isCompleted ? 'bg-primary border-primary text-white' :
                                  isCurrent ? 'border-primary text-primary bg-primary/10 ring-4 ring-primary/20 scale-110' :
                                  'bg-white/ border-white/10 text-white/20'
                                }`}>
                                  {isCompleted ? <CheckCircle2 size={16}/> : isCurrent ? <Loader2 size={16} className="animate-spin"/> : <span className="text-[10px] font-black">{i+1}</span>}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest hidden md:block ${isCurrent || isCompleted ? 'text-primary' : 'text-white/20'}`}>{stage}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stage hint */}
                      <div className="p-5 rounded-2xl bg-white/ border border-white/5 flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0"><Activity size={16}/></div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Pipeline Update</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{getStageHint(app.stage)}</p>
                            </div>
                        </div>

                        {/* Offer controls */}
                        {app.stage === 'Offer' && (
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                                <button 
                                    onClick={() => onUpdateStatus?.(app.id, 'Selected')}
                                    className="flex-1 h-14 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                                >
                                    Accept Core Offer
                                </button>
                                <button 
                                    onClick={() => onUpdateStatus?.(app.id, 'Rejected')}
                                    className="px-6 h-14 bg-white/ text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                                >
                                    Decline
                                </button>
                                <button 
                                    onClick={() => handleDownloadOffer(app.id)}
                                    className="px-6 h-14 border border-primary/20 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                                >
                                    Download Offer Letter <Sparkles size={14}/>
                                </button>
                            </div>
                        )}
                        {app.stage === 'Selected' && (
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => handleDownloadOffer(app.id)}
                                    className="px-6 h-14 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                                >
                                    View Digital Credentials
                                </button>
                            </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col sm:flex-row items-center gap-6 mb-8">
                      <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500">
                        <AlertCircle size={32} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-black text-rose-500 uppercase italic tracking-tighter">Mission Terminated</h4>
                        <p className="text-sm text-slate-500 mt-1">{getStageHint('Rejected')}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400/50 mt-4">Thank You!! for your interest .</p>
                      </div>
                    </div>
                  )}

                  {/* Footer: expand/collapse */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="w-full flex items-center justify-between pt-4 border-t border-white/5 text-slate-600 hover:text-white transition-colors group"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">Application Details</span>
                    <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                  </button>

                  {isExpanded && (
                    <div className="mt-6 p-6 rounded-2xl bg-white/ border border-white/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Domain Applied</p>
                          <p className="text-sm font-black text-white">{app.domain}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Branch</p>
                          <p className="text-sm font-black text-white">{app.branch || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Roll Number</p>
                          <p className="text-sm font-black text-white">{app.rollNumber}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Cycle</p>
                          <p className="text-sm font-black text-white">{app.recruitmentCycle || new Date().getFullYear()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2">Why I Want to Join</p>
                        <p className="text-sm text-slate-400 leading-relaxed italic">"{app.whyJoin}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
