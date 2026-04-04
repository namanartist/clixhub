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
      setActivePrintId(serial);
      setTimeout(() => {
          window.print();
          setActivePrintId(null);
      }, 100);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen flex flex-col space-y-10">
      
      {/* Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-10" />
        <div className="relative bg-white dark:bg-[#111C44] rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
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
             <div className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
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
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
                <Award size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black dark:text-white">No Credentials Found</h2>
            <p className="text-slate-500 max-w-sm mt-2 font-medium">Your certificates will appear here once they are issued and approved by the Faculty Coordinator and Dean Student Welfare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
          {userCertificates.map(({ cert, batch }) => (
            <div key={cert.serialNumber} className="group flex flex-col bg-white dark:bg-[#111C44] rounded-[3.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
                
                {/* Certificate Visual Part */}
                <div className="p-8 pb-0 flex flex-col items-center bg-slate-50 dark:bg-black/20 group-hover:bg-transparent transition-colors" id={`print-${cert.serialNumber}`}>
                    <div className="w-full shadow-2xl rounded-sm overflow-hidden transform scale-95 group-hover:scale-100 transition-transform duration-500" 
                         id={cert.serialNumber === activePrintId ? "certificate-print-area" : undefined}>
                      <CertificatePreview 
                          studentName={cert.studentName}
                          enrollmentNumber={cert.enrollmentNumber}
                          eventName={cert.eventName}
                          clubName={cert.clubName}
                          id={cert.serialNumber}
                          date={cert.date}
                          template={batch.templateId}
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
                            onClick={() => handlePrint(cert.serialNumber)}
                            className="flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
                        >
                            <Printer size={18} /> Print Legal Copy
                        </button>
                        <button 
                            onClick={() => window.open(`/verify-cert?id=${cert.serialNumber}`, '_blank')}
                            className="flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            <ExternalLink size={18} /> Public Verification
                        </button>
                    </div>
                </div>

            </div>
          ))}
        </div>
      )}

      {/* Verification Notice */}
      <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
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
