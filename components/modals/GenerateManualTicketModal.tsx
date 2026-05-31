import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { db } from '../../db';
import { X, Search, Ticket, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
    eventId: string;
    isDarkMode: boolean;
    onClose: () => void;
    onTicketGenerated: () => void;
}

const GenerateManualTicketModal: React.FC<Props> = ({ eventId, isDarkMode, onClose, onTicketGenerated }) => {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchTicketCandidates();
    }, [eventId]);

    useEffect(() => {
        const filtered = candidates.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.enrollmentNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCandidates(filtered);
    }, [searchTerm, candidates]);

    const fetchTicketCandidates = async () => {
        try {
            setLoading(true);
            const cands = await db.getTicketCandidates(eventId);
            setCandidates(cands);
        } catch (err) {
            setError('Failed to load candidates');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTicket = async () => {
        if (!selectedStudent) {
            setError('Please select a student');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await db.generateManualTicket(
                eventId,
                selectedStudent.id,
                selectedStudent.name,
                selectedStudent.enrollmentNumber || ''
            );
            setSuccess('Ticket generated successfully!');
            setTimeout(() => {
                onTicketGenerated();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to generate ticket');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-3xl w-full max-w-md p-6 md:p-8 ${isDarkMode ? 'bg-[#111C44]' : 'bg-white} border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} shadow-2xl`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                            Generate Ticket
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Manually issue an event ticket to a student
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/' : 'hover:bg-slate-100'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        {success}
                    </div>
                )}

                {/* Search */}
                <div className="mb-4 relative">
                    <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors ${isDarkMode
                            ? 'bg-white/ border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50'
                            : 'bg-whiteborder-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500'
                            }`}
                    />
                </div>

                {/* Candidates List */}
                <div className={`mb-4 max-h-64 overflow-y-auto rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    {loading && filteredCandidates.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">Loading students...</div>
                    ) : filteredCandidates.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No students available</div>
                    ) : (
                        filteredCandidates.map(candidate => (
                            <button
                                key={candidate.id}
                                onClick={() => setSelectedStudent(candidate)}
                                className={`w-full p-3 text-left border-b transition-colors ${selectedStudent?.id === candidate.id
                                        ? isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                                        : isDarkMode ? 'hover:bg-white/' : 'hover:bg-slate-50
                                    } ${isDarkMode ? 'border-white/5' : 'border-slate-100'} last:border-b-0`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                                            {candidate.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {candidate.enrollmentNumber} • {candidate.department || 'N/A'}
                                        </p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedStudent?.id === candidate.id
                                            ? 'bg-blue-600 border-blue-600'
                                            : isDarkMode ? 'border-white/30' : 'border-slate-300'
                                        }`}>
                                        {selectedStudent?.id === candidate.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Student Info */}
                {selectedStudent && (
                    <div className={`mb-6 p-3 rounded-xl ${isDarkMode ? 'bg-white/ border border-white/10' : 'bg-slate-50border border-slate-200'}`}>
                        <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                            Selected Student
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                            {selectedStudent.name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {selectedStudent.enrollmentNumber || 'No enrollment number'}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${isDarkMode
                            ? 'bg-white/ hover:bg-white/ text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-[#1B2559]'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerateTicket}
                        disabled={!selectedStudent || loading}
                        className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <Ticket size={14} />
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateManualTicketModal;
