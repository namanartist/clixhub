import React, { useState, useEffect } from 'react';
import { User, ClubRole } from '../../types';
import { db } from '../../db';
import { X, Search, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
    clubId: string;
    isDarkMode: boolean;
    onClose: () => void;
    onMemberAdded: () => void;
}

const AddClubMemberModal: React.FC<Props> = ({ clubId, isDarkMode, onClose, onMemberAdded }) => {
    const [availableMembers, setAvailableMembers] = useState<User[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<ClubRole>(ClubRole.MEMBER);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailableMembers();
    }, [clubId]);

    useEffect(() => {
        const filtered = availableMembers.filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.enrollmentNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [searchTerm, availableMembers]);

    const fetchAvailableMembers = async () => {
        try {
            setLoading(true);
            const members = await db.getAvailableMembers(clubId);
            setAvailableMembers(members);
        } catch (err) {
            setError('Failed to load available members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedMemberId) {
            setError('Please select a member');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await db.addClubMember(clubId, selectedMemberId, selectedRole);
            setSuccess('Member added successfully!');
            setTimeout(() => {
                onMemberAdded();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to add member');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-3xl w-full max-w-md p-6 md:p-8 ${isDarkMode ? 'bg-[#111C44]' : 'bg-white'} border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} shadow-2xl`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                            Add Member
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Select a student to join the club
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
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
                        placeholder="Search by name, email, or enrollment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors ${isDarkMode
                            ? 'bg-white/10 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50'
                            : 'bg-white/40 border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500'
                            }`}
                    />
                </div>

                {/* Members List */}
                <div className={`mb-4 max-h-64 overflow-y-auto rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    {loading && filteredMembers.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">Loading members...</div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No members available</div>
                    ) : (
                        filteredMembers.map(member => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedMemberId(member.id)}
                                className={`w-full p-3 text-left border-b transition-colors ${selectedMemberId === member.id
                                        ? isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                                        : isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                                    } ${isDarkMode ? 'border-white/5' : 'border-slate-100'} last:border-b-0`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {member.enrollmentNumber} • {member.department || 'N/A'}
                                        </p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMemberId === member.id
                                            ? 'bg-blue-600 border-blue-600'
                                            : isDarkMode ? 'border-white/30' : 'border-slate-300'
                                        }`}>
                                        {selectedMemberId === member.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Role Selection */}
                {selectedMemberId && (
                    <div className="mb-6 space-y-2">
                        <label className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as ClubRole)}
                            className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-colors ${isDarkMode
                                ? 'bg-white/10 border-white/10 text-white focus:border-blue-500/50'
                                : 'bg-white/40 border-slate-200 text-[#1B2559] focus:border-blue-500'
                                }`}
                        >
                            {Object.values(ClubRole).map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${isDarkMode
                            ? 'bg-white/10 hover:bg-white/10 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-[#1B2559]'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddMember}
                        disabled={!selectedMemberId || loading}
                        className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <UserPlus size={14} />
                        Add Member
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddClubMemberModal;
