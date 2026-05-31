import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../db';
import { CertificateBatch, IssuedCertificate } from '../../types';
import CertificatePreview from '../CertificatePreview';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  History,
  Download,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const CertificateVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    
    const [serialNumber, setSerialNumber] = useState(queryId || '');
    const [result, setResult] = useState<{ cert: IssuedCertificate, batch: CertificateBatch } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!serialNumber) return;

        setIsSearching(true);
        setError(null);
        setResult(null);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        const batches = await db.getBatches();
        let foundCert: IssuedCertificate | null = null;
        let foundBatch: CertificateBatch | null = null;

        for (const b of batches) {
            const c = b.certificates.find(cert => cert.serialNumber === serialNumber);
            if (c) {
                foundCert = c;
                foundBatch = b;
                break;
            }
        }

        if (foundCert && foundBatch) {
            setResult({ cert: foundCert, batch: foundBatch });
            // Add to logs
            await db.addLog({
                id: `verify-log-${Date.now()}`,
                timestamp: new Date().toLocaleString(),
                user: 'Public Visitor',
                action: `Verified Certificate: ${serialNumber}`,
                clubId: foundCert.clubId
            });
        } else {
            setError("The certificate serial number was not found in our institutional ledger. Ensure you have entered the full ID exactly as printed.");
        }
        setIsSearching(false);
    };

    useEffect(() => {
        if (queryId) {
            handleSearch();
        }
    }, [queryId]);

    return (
        <div className="min-h-screen bg-[#050B20] text-white selection:bg-blue-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <ShieldCheck size={14} />
                        MITS Institutional Ledger
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                        Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Authenticity</span>
                    </h1>
                    <p className="max-w-xl text-slate-400 font-medium leading-relaxed">
                        Enter the unique certificate serial number to verify its issuance details and cryptographic signature.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-20">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl group-hover:bg-blue-500/30 transition-all opacity-50" />
                        <div className="relative flex p-2 bg-white/ border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                            <div className="flex-1 flex items-center px-6">
                                <Search className="text-slate-500 mr-4" size={24} />
                                <input 
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                                    placeholder="MITS-CSIT-2026-00001"
                                    className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-600"
                                />
                            </div>
                            <button 
                                disabled={isSearching}
                                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-2"
                            >
                                {isSearching ? <span className="animate-pulse">Searching...</span> : 'Verify'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Loading State */}
                {isSearching && (
                    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                        <ShieldCheck className="text-blue-500 mb-4" size={64} />
                        <p className="font-black text-slate-500 uppercase tracking-widest">Accessing Secure Ledger...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-xl mx-auto p-12 rounded-[3rem] bg-rose-500/5 border border-rose-500/20 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={36} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 capitalize">Verification Failed</h3>
                        <p className="text-slate-400 font-medium">{error}</p>
                    </div>
                )}

                {/* Result Block */}
                {result && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {/* Certificate Preview */}
                        <div className="relative group" id="certificate-print-area">
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-50" />
                            <div className="relative rounded-sm overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10 group-hover:scale-[1.02] transition-all duration-500">
                                <CertificatePreview 
                                    studentName={result.cert.studentName}
                                    enrollmentNumber={result.cert.enrollmentNumber}
                                    eventName={result.cert.eventName}
                                    clubName={result.cert.clubName}
                                    id={result.cert.serialNumber}
                                    date={result.cert.date}
                                    template={result.batch.templateId}
                                />
                            </div>
                        </div>

                        {/* Metadata & Proof */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black tracking-tight mb-2">Verified Record</h2>
                                <p className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Digitally Authenticated by MITS Authority
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Serial Number', value: result.cert.serialNumber },
                                    { label: 'Issue Date', value: new Date(result.cert.date).toLocaleDateString() },
                                    { label: 'Recipient Name', value: result.cert.studentName },
                                    { label: 'Enrollment No.', value: result.cert.enrollmentNumber },
                                ]
                                .map((item, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-white/ border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.label}</p>
                                        <p className="text-lg font-bold">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 rounded-[3rem] bg-white/ border border-white/5 space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                                    <History size={14} /> Approval Chain Proof
                                </p>
                                <div className="space-y-4">
                                    {result.batch.approvalChain.map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">{step.approverName}</span>
                                                    <span className="px-2 py-0.5 rounded-md bg-white/ text-[8px] font-black uppercase text-slate-400">Approved</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                                    {step.role} • {step.approvedAt ? new Date(step.approvedAt).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Cryptographic Hash (SHA-256)</p>
                                <code className="text-[10px] font-mono text-slate-400 break-all bg-black/30 p-4 block rounded-xl">
                                    {result.cert.hash}
                                </code>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button 
                                    onClick={() => {
                                        const printAnchor = document.getElementById('certificate-print-area');
                                        if (!printAnchor) return;
                                        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                                            .map(s => s.outerHTML)
                                            .join('\n');
                                        const html = `<html><head><title>MITS Verified Record</title>${styles}<style>body{margin:0;padding:40px;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;color:#000;font-family:system-ui, sans-serif;}</style></head><body onload="setTimeout(() => { window.print(); window.close(); }, 1200);"><div style="width:1000px">${printAnchor.innerHTML}</div></body></html>`;
                                        const win = window.open('', '_blank', 'width=1100,height=850');
                                        if (win) { win.document.write(html); win.document.close(); }
                                    }}
                                    className="flex items-center gap-2 px-8 py-4 bg-white/ hover:bg-white/ text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 shadow-xl"
                                >
                                    <Download size={18} /> Download Record
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateVerification;