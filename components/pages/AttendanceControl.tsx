
import React, { useState, useEffect } from 'react';
import { Registration, Event } from '../../types';
import {
  Camera,
  UserCheck,
  X,
  CheckCircle2,
  ScanLine,
  Search,
  UserPlus,
  Zap,
  Fingerprint,
  ShieldCheck,
  Activity,
  ToggleRight,
  ToggleLeft,
  ChevronDown,
  Calendar,
  Download,
  Users,
  AlertCircle,
  QrCode,
} from 'lucide-react';
// @ts-ignore
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface Props {
  registrations: Registration[];
  events?: Event[];
  onMark: (id: string, status: boolean) => void;
  onFinalize: () => void;
  isDarkMode?: boolean;
}

const AttendanceControl: React.FC<Props> = ({ registrations, events = [], onMark, onFinalize, isDarkMode = true }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickMarkRoll, setQuickMarkRoll] = useState('');
  const [scanResult, setScanResult] = useState<{ msg: string; status: 'success' | 'error' } | null>(null);

  /* Filter registrations by selected event */
  const activeRegs = selectedEventId === 'all'
    ? registrations
    : registrations.filter(r => r.eventId === selectedEventId);

  /* Search within active set */
  const filteredRegs = activeRegs.filter(r =>
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentRoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.ticketId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = activeRegs.filter(r => r.attendanceMarked).length;
  const totalCount = activeRegs.length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  /* QR Scanner lifecycle */
  useEffect(() => {
    let scanner: any;
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], // camera only, no file upload
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,  // useful for dark venues
        },
        false
      );
      scanner.render(
        (decoded: string) => {
          const reg = registrations.find(r => r.ticketId === decoded || r.id === decoded);
          if (reg) {
            if (!reg.attendanceMarked) {
              onMark(reg.id, true);
              setScanResult({ msg: `✓ Verified: ${reg.studentName}`, status: 'success' });
            } else {
              setScanResult({ msg: `Already present: ${reg.studentName}`, status: 'success' });
            }
          } else {
            setScanResult({ msg: `Invalid QR: ${decoded.slice(0, 24)}...`, status: 'error' });
          }
          setTimeout(() => setScanResult(null), 3500);
        },
        () => { /* suppress scan errors */ }
      );
    }
    return () => { if (scanner) scanner.clear().catch(() => {}); };
  }, [isScanning, registrations]);

  const handleQuickMark = (e: React.FormEvent) => {
    e.preventDefault();
    const reg = activeRegs.find(r => r.studentRoll.toUpperCase() === quickMarkRoll.toUpperCase());
    if (reg) {
      onMark(reg.id, true);
      setQuickMarkRoll('');
      setScanResult({ msg: `Manual Entry OK: ${reg.studentName}`, status: 'success' });
      setTimeout(() => setScanResult(null), 3000);
    } else {
      setScanResult({ msg: `Roll "${quickMarkRoll}" not found in this event's registrations`, status: 'error' });
      setTimeout(() => setScanResult(null), 4000);
    }
  };

  const markAll = () => {
    activeRegs.filter(r => !r.attendanceMarked).forEach(r => onMark(r.id, true));
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Roll No', 'Ticket ID', 'Status'],
      ...activeRegs.map(r => [r.studentName, r.studentRoll, r.ticketId || '—', r.attendanceMarked ? 'Present' : 'Absent'])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  /* Event name helper */
  const getEventName = (eventId: string) => events.find(e => e.id === eventId)?.title || eventId;

  return (
    <div className="p-6 md:p-10 max-w-[1700px] mx-auto min-h-screen flex flex-col gap-8">

      {/* ── HEADER ── */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-[#0055FF]/10 text-[#0055FF]">
              <Fingerprint size={26} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Gatekeeper Protocol</h1>
          </div>
          <p className="text-sm font-medium text-slate-400 ml-1">Real-time identity verification · Any club member can operate</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={exportCSV}
                  className="px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={markAll} disabled={presentCount === totalCount}
                  className="px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <Users size={14} /> Mark All Present
          </button>
          <button onClick={onFinalize}
                  className="px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all flex items-center gap-2">
            <ShieldCheck size={14} /> Finalize Session
          </button>
          <button onClick={() => setIsScanning(!isScanning)}
                  className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 ${isScanning ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-[#0055FF] text-white shadow-[#0055FF]/30'}`}>
            {isScanning ? <><X size={14} /> Abort Scan</> : <><Camera size={14} /> Scan QR</>}
          </button>
        </div>
      </header>

      {/* ── EVENT SELECTOR ── */}
      {events.length > 0 && (
        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-[#111C44] border border-white/5">
          <Calendar size={18} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Select Event for Attendance</p>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full bg-transparent text-white font-black text-sm outline-none pr-8 cursor-pointer appearance-none"
              >
                <option value="all" className="bg-[#111C44]">All Events ({registrations.length} registrations)</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id} className="bg-[#111C44]">
                    {ev.title} — {registrations.filter(r => r.eventId === ev.id).length} registered
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black text-white">{presentCount}<span className="text-sm text-slate-500">/{totalCount}</span></p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">present</p>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 flex-1 min-h-0">

        {/* LEFT: Controls */}
        <div className="space-y-6 lg:col-span-1">

          {/* Live Stat Card */}
          <div className="p-7 rounded-[3rem] bg-[#111C44] border border-white/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0055FF]/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Venue Occupancy</p>
                  <h3 className="text-5xl font-black tracking-tighter text-white">
                    {presentCount}<span className="text-2xl text-slate-500">/{totalCount}</span>
                  </h3>
                </div>
                {/* Arc progress */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-800" />
                    <circle cx="32" cy="32" r="28" stroke="#0055FF" strokeWidth="5" fill="transparent"
                            strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * percentage) / 100}
                            className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-xs font-black text-white">{percentage}%</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-800rounded-full overflow-hidden">
                <div className="h-full bg-[#0055FF] rounded-full transition-all duration-700"
                     style={{ width: `${percentage}%` }} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">System Online</span>
                </div>
                <Activity size={16} className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Quick Mark by Roll */}
          <div className="p-7 rounded-[3rem] bg-[#111C44] border border-white/5">
            <h3 className="text-base font-black tracking-tight text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Manual Entry by Roll No.
            </h3>
            <form onSubmit={handleQuickMark} className="flex gap-2">
              <input
                value={quickMarkRoll}
                onChange={e => setQuickMarkRoll(e.target.value.toUpperCase())}
                placeholder="e.g. 0901CS221001"
                className="flex-1 min-w-0 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none uppercase tracking-widest bg-[#0B1437] text-white focus:ring-2 focus:ring-[#0055FF] transition-all placeholder:text-slate-600"
              />
              <button type="submit" className="p-3.5 bg-[#0055FF] text-white rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-[#0055FF]/20">
                <UserPlus size={20} />
              </button>
            </form>

            {/* Scan result toast */}
            {scanResult && (
              <div className={`mt-4 p-4 rounded-2xl font-bold text-sm flex items-start gap-3 ${scanResult.status === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                {scanResult.status === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                <span>{scanResult.msg}</span>
              </div>
            )}
          </div>

          {/* QR Scanner Panel */}
          {isScanning && (
            <div className="rounded-[3rem] bg-black relative overflow-hidden border-4 border-[#0055FF] shadow-[0_0_60px_rgba(0,85,255,0.35)]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-[#0055FF]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">QR Scanner Active</p>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto" />
                </div>
                <div id="qr-reader" className="w-full rounded-2xl overflow-hidden" />
              </div>
            </div>
          )}

          {/* Info tip */}
          {!isScanning && (
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <ScanLine size={14} /> QR Scan Mode
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click "Scan QR" to activate camera. Point at student ticket QR code for instant verification. Also supports manual roll-number entry above.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Roster */}
        <div className="lg:col-span-2 rounded-[3rem] border border-white/5 bg-[#111C44] flex flex-col overflow-hidden">
          {/* Roster header */}
          <div className="p-7 border-b border-white/5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Session Ledger</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
                {selectedEventId === 'all' ? 'All events' : getEventName(selectedEventId)} · {filteredRegs.length} shown
              </p>
            </div>
            <div className="relative w-56">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Name / Roll / Ticket..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none bg-[#0B1437] text-white focus:ring-2 focus:ring-[#0055FF]/40 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Roster list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {filteredRegs.length === 0 ? (
              <div className="py-24 text-center opacity-25">
                <UserCheck size={48} className="mx-auto mb-4 text-white" />
                <p className="text-xs font-black uppercase tracking-widest text-white">No matching records</p>
              </div>
            ) : (
              filteredRegs.map(reg => (
                <div key={reg.id}
                     className="p-4 rounded-2xl flex items-center justify-between transition-all group bg-[#0B1437] hover:bg-[#151E40]">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${reg.attendanceMarked ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800text-slate-500'}`}>
                      {reg.attendanceMarked ? <CheckCircle2 size={20} /> : reg.studentName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{reg.studentName}</h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{reg.studentRoll}</p>
                        {reg.ticketId && (
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 border border-slate-700 px-1.5 py-0.5 rounded">
                            {reg.ticketId}
                          </p>
                        )}
                        {selectedEventId === 'all' && reg.eventId && (
                          <p className="text-[8px] text-slate-600 truncate max-w-[120px]">{getEventName(reg.eventId)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${reg.attendanceMarked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {reg.attendanceMarked ? 'Present' : 'Absent'}
                    </span>
                    <button
                      onClick={() => onMark(reg.id, !reg.attendanceMarked)}
                      title={reg.attendanceMarked ? 'Mark Absent' : 'Mark Present'}
                      className={`p-2.5 rounded-xl transition-all ${reg.attendanceMarked ? 'text-emerald-500 hover:bg-rose-500/10 hover:text-rose-500' : 'text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500'}`}>
                      {reg.attendanceMarked
                        ? <ToggleRight size={24} className="fill-current" />
                        : <ToggleLeft size={24} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Roster footer summary */}
          <div className="px-7 py-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-black text-emerald-400">{presentCount}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-rose-400">{totalCount - presentCount}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-white">{totalCount}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Attendance Rate</p>
              <p className="text-2xl font-black" style={{ color: percentage >= 70 ? '#10B981' : percentage >= 40 ? '#F59E0B' : '#EF4444' }}>
                {percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceControl;
