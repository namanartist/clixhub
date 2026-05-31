import React, { useMemo, useState } from 'react';
import { User, CertificateBatch, IssuedCertificate } from '../../types';
import CertificatePreview from '../CertificatePreview';
import { 
  Award, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Props {
  currentUser: User;
  batches: CertificateBatch[];
}

const MyCertificates: React.FC<Props> = ({ currentUser, batches }) => {
  const [activePrintId, setActivePrintId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{cert: IssuedCertificate, batch: CertificateBatch} | null>(null);
  const userCertificates = useMemo(() => {
    return batches
      .filter(batch => batch.status === 'Approved')
      .flatMap(batch => 
        batch.certificates
          .filter(cert => cert.studentId === currentUser.id || cert.enrollmentNumber === currentUser.enrollmentNumber)
          .map(cert => ({ cert, batch }))
      );
  }, [batches, currentUser]);

  const handlePrint = (serial: string) => {
      // 1. Identify the hidden print container or clone the current preview
      // We'll use a temporary strategy to ensure the exact design is used.
      const printAnchor = document.getElementById(`cert-preview-${serial}`);
      if (!printAnchor) {
          // If not in DOM, we might need to render it.
          // But usually, it's available in the list.
          alert("Certificate node not ready for mission deployment. Please try again.");
          return;
      }

      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(s => s.outerHTML)
          .join('\n');

      const html = `
        <html>
          <head>
            <title>MITS Certificate - ${serial}</title>
            ${styles}
            <style>
              body { background: white !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
              @page { size: landscape; margin: 0; }
              /* Force dark mode styles to show up if needed, or ensuring light mode for print */
              .dark { color-scheme: light !important; }
            </style>
          </head>
          <body onload="setTimeout(() => { window.print(); window.close(); }, 1200);">
            <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
               ${printAnchor.innerHTML}
            </div>
          </body>
        </html>
      `;

      const win = window.open('', '_blank', 'width=1100,height=850');
      if (win) {
          win.document.write(html);
          win.document.close();
      }
  };

  const handlePreview = (cert: IssuedCertificate, batch: CertificateBatch) => {
    setSelectedCert({ cert, batch });
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen flex flex-col space-y-10">
      
      {/* Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-10" />
        <div className="relative bg-whitedark:bg-[#111C44] rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <Award size={40} />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tight dark:text-white">Credentials Portfolio</h1>
                <p className="text-slate-500 font-medium mt-1">Institutional certificates and verified achievements.</p>
             </div>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl bg-slate-50dark:bg-white/10 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Issued</span>
                <span className="text-2xl font-black dark:text-white">{userCertificates.length}</span>
             </div>
             <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Authenticity</span>
                <span className="text-lg font-black text-emerald-500 leading-none mt-1">Verified</span>
             </div>
          </div>
        </div>
      </div>

      {userCertificates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[4rem] p-20 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-8">
                <Award size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black dark:text-white">No Credentials Found</h2>
            <p className="text-slate-500 max-w-sm mt-2 font-medium">Your certificates will appear here once they are issued and approved by the Faculty Coordinator and Dean Student Welfare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
          {userCertificates.map(({ cert, batch }) => (
            <div key={cert.serialNumber} className="group flex flex-col bg-whitedark:bg-[#111C44] rounded-[3.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
                
                <div 
                   id={`cert-preview-${cert.serialNumber}`}
                   className="p-8 pb-0 flex flex-col items-center bg-slate-50dark:bg-black/20 group-hover:bg-transparent transition-colors cursor-zoom-in" 
                   onClick={() => handlePreview(cert, batch)}>
                    <div className="w-full shadow-2xl rounded-sm overflow-hidden transform scale-95 group-hover:scale-100 transition-transform duration-500">
                      <CertificatePreview 
                          studentName={cert.studentName}
                          enrollmentNumber={cert.enrollmentNumber}
                          eventName={cert.eventName}
                          clubName={cert.clubName}
                          id={cert.serialNumber}
                          date={cert.date}
                          template={batch.templateId || 'classic'}
                      />
                    </div>
                </div>

                {/* Info Part */}
                <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-600/20 mb-2 inline-block">Institutional Record</span>
                            <h3 className="text-2xl font-black dark:text-white tracking-tight">{cert.eventName}</h3>
                            <p className="text-slate-500 font-bold text-sm tracking-tight">{cert.clubName} • Issued {new Date(cert.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <code className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">{cert.serialNumber}</code>
                            <div className="flex items-center gap-1 mt-2 text-emerald-500">
                                <ShieldCheck size={14}/>
                                <span className="text-[10px] font-black uppercase tracking-widest">Immutable Hash</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handlePreview(cert, batch)}
                            className="flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
                        >
                            <Printer size={18} /> Print Legal Copy
                        </button>
                        <button 
                            onClick={() => window.open(`/verify-cert?id=${cert.serialNumber}`, '_blank')}
                            className="flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-white/10 dark:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            <ExternalLink size={18} /> Public Verification
                        </button>
                    </div>
                </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview & Print Modal */}
      {isPreviewModalOpen && selectedCert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
              <div className="relative w-full max-w-[1240px] flex flex-col items-center gap-8 max-h-screen overflow-y-auto py-10 no-scrollbar">
                  <button 
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="absolute top-4 right-4 md:top-8 md:right-8 p-4 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 text-white rounded-2xl border border-white/10 transition-all z-[1100]"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>

                  <div className="text-center space-y-2 mb-2 relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                         <Printer size={14} /> Print Protocol Active
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">Institutional Credential Preview</h2>
                      <p className="text-slate-400 font-medium italic opacity-60">"Set Destination to 'PDF' or 'Printer', Layout to 'Landscape', and Margins to 'None'"</p>
                  </div>

                  <div className="w-full shadow-[0_0_150px_rgba(37,99,235,0.25)] rounded-sm overflow-hidden border border-white/10 bg-whitetransition-all transform scale-[1.0] md:scale-[1.05] mt-4 print-preview-container">
                    <CertificatePreview 
                        studentName={selectedCert.cert.studentName}
                        enrollmentNumber={selectedCert.cert.enrollmentNumber}
                        eventName={selectedCert.cert.eventName}
                        clubName={selectedCert.cert.clubName}
                        id={selectedCert.cert.serialNumber}
                        date={selectedCert.cert.date}
                        template={selectedCert.batch.templateId || 'classic'}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-2xl px-6">
                     <button 
                        onClick={() => handlePrint(selectedCert.cert.serialNumber)}
                        className="flex-1 px-12 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-3xl shadow-blue-600/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4"
                     >
                        <Printer size={22} /> Execute Print
                     </button>
                     <button 
                        onClick={() => setIsPreviewModalOpen(false)}
                        className="px-12 py-7 bg-white/10 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                     >
                        Cancel
                     </button>
                  </div>
              </div>

              {/* Hidden Print Area – made visible by @media print in CertificatePreview */}
              {activePrintId === selectedCert.cert.serialNumber && (
                <div id="cert-print-root" style={{position:'fixed',inset:0,zIndex:9999,background:'white',opacity:0,pointerEvents:'none'}}>
                    <CertificatePreview 
                        studentName={selectedCert.cert.studentName}
                        enrollmentNumber={selectedCert.cert.enrollmentNumber}
                        eventName={selectedCert.cert.eventName}
                        clubName={selectedCert.cert.clubName}
                        id={selectedCert.cert.serialNumber}
                        date={selectedCert.cert.date}
                        template={selectedCert.batch.templateId || 'classic'}
                        isPrintReady={true}
                    />
                </div>
              )}
          </div>
      )}

      {/* Verification Notice */}
      <div className="bg-slate-900rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={32} />
              </div>
              <div className="max-w-xl">
                  <h3 className="text-xl font-black text-white">Trust & Security Protocol</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Every certificate issued by MITS CCMS is backed by a cryptographic signature from both the Faculty Coordinator and Dean Student Welfare. All records are stored in the institutional immutable ledger.</p>
              </div>
          </div>
          <button 
            onClick={() => window.open('/verify-cert', '_blank')}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 relative z-10"
          >
              Verify Any Serial
          </button>
      </div>

    </div>
  );
};

export default MyCertificates;
