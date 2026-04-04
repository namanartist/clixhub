import { Club, Applicant, Registration, Event, AuditLog, User, Role, ClubRole, Inquiry, SavedEvent, Message, Notification, SessionArchive, TeamMember, Mentor, DevConfig, PollOption, CertificateBatch, IssuedCertificate, Activity } from './types';
import { SEED_USERS, CLUBS, EVENTS, INITIAL_REGISTRATIONS, INITIAL_APPLICANTS, INITIAL_AUDIT_LOGS } from './constants';
import { storage } from './lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE = 'http://127.0.0.1:4000/api';

class InstitutionalAPI {
    private hasInitialized = false;

    async initialize(): Promise<void> {
        if (this.hasInitialized) return;
        try {
            const res = await fetch(`${API_BASE}/health`);
            const status = await res.json();
            console.log('Backend connection status:', status);

            // Note: Seeding is now handled by the backend or manually.
            // If you need to seed, you can implement a /api/seed endpoint in server/index.js
        } catch (e) {
            console.error('Failed to connect to backend API:', e);
        }
        this.hasInitialized = true;
    }

    // --- Auth Helpers (kept for compatibility) ---
    setToken(token: string) { localStorage.setItem('ccms_auth_token', token); }
    clearToken() { localStorage.removeItem('ccms_auth_token'); }

    // --- Chat mocks ---
    async getMessages(_clubId?: string, _userId?: string, _otherUserId?: string): Promise<Message[]> { return []; }
    async sendMessage(_message: Message): Promise<void> { }
    async votePoll(_messageId: string, _optionId: string, _userId: string): Promise<void> { }

    private async request(path: string, options?: RequestInit) {
        const token = localStorage.getItem('ccms_auth_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options?.headers
        };

        const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: res.statusText }));
            console.error(`API Error (${path}):`, err);
            throw new Error(err.error || 'API Request Failed');
        }
        return res.json();
    }

    // ─── USERS ─────────────────────────────────────────────────────────────
    async getUsers(): Promise<User[]> {
        try {
            return await this.request('/users');
        } catch (e) { return []; }
    }

    async getUser(id: string): Promise<User | null> {
        try {
            return await this.request(`/users/${id}`);
        } catch (e) { return null; }
    }

    async getMe(): Promise<User | null> {
        try {
            return await this.request('/auth/me');
        } catch (e) { return null; }
    }

    async demoLogin(email: string): Promise<{ token: string, user: User }> {
        const data = await this.request('/auth/demo-login', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        this.setToken(data.token);
        return data;
    }

    async supabaseLogin(email: string, name: string, id: string): Promise<{ token: string, user: User }> {
        const data = await this.request('/auth/supabase-login', {
            method: 'POST',
            body: JSON.stringify({ email, name, id }),
        });
        this.setToken(data.token);
        return data;
    }

    async seedDatabase(data: any) {
        return await this.request('/db/seed', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async saveUser(user: User): Promise<User> {
        return await this.request(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        });
    }

    async deleteUser(id: string) {
        await this.request(`/users/${id}`, { method: 'DELETE' });
    }

    // ─── CLUBS ─────────────────────────────────────────────────────────────
    async getClubs(): Promise<Club[]> {
        try {
            return await this.request('/clubs');
        } catch (e) { return []; }
    }

    async addClub(c: Club) {
        return await this.request('/clubs', {
            method: 'POST',
            body: JSON.stringify(c)
        });
    }

    async updateClub(c: Club) {
        await this.request(`/clubs/${c.id}`, {
            method: 'PATCH',
            body: JSON.stringify(c)
        });
    }

    async appointPresident(cId: string, sId: string) {
        try {
            const user = await this.getUser(sId);
            if (!user) return;
            const memberships = user.clubMemberships || [];
            const existing = memberships.findIndex(m => m.clubId === cId);
            if (existing >= 0) memberships[existing].role = ClubRole.PRESIDENT;
            else memberships.push({ clubId: cId, role: ClubRole.PRESIDENT });
            await this.saveUser({ ...user, clubMemberships: memberships });

            const club = await this.request(`/clubs/${cId}`);
            if (club) {
                if (!club.leadership) club.leadership = {};
                club.leadership['President'] = user.name;
                await this.updateClub(club);
            }
        } catch (e) { console.error('appointPresident:', e); }
    }

    async assignFaculty(cId: string, faculty: User) {
        try {
            await this.updateClub({ id: cId, facultyCoordinatorId: faculty.id, facultyCoordinatorNames: [faculty.name] } as any);
        } catch (e) { console.error('assignFaculty:', e); }
    }

    // ─── EVENTS ─────────────────────────────────────────────────────────────
    async getEvents(): Promise<Event[]> {
        try {
            return await this.request('/events');
        } catch (e) { return []; }
    }

    async saveEvent(event: Event) {
        // If it has _id, it's an update
        const method = event.id ? 'PATCH' : 'POST';
        const path = event.id ? `/events/${event.id}` : '/events';
        return await this.request(path, {
            method: method,
            body: JSON.stringify(event)
        });
    }

    async deleteEvent(id: string) {
        await this.request(`/events/${id}`, { method: 'DELETE' });
    }

    // ─── REGISTRATIONS ──────────────────────────────────────────────────────
    async getRegistrations(): Promise<Registration[]> {
        try {
            return await this.request('/registrations');
        } catch (e) { return []; }
    }

    async saveRegistration(reg: Registration) {
        const method = reg.id ? 'PATCH' : 'POST';
        const path = reg.id ? `/registrations/${reg.id}` : '/registrations';
        await this.request(path, {
            method: method,
            body: JSON.stringify(reg)
        });
    }

    // ─── APPLICANTS ─────────────────────────────────────────────────────────
    async getApplicants(): Promise<Applicant[]> {
        try {
            return await this.request('/applicants');
        } catch (e) { return []; }
    }

    async saveApplicant(a: Applicant) {
        const method = a.id ? 'PATCH' : 'POST';
        const path = a.id ? `/applicants/${a.id}` : '/applicants';
        await this.request(path, {
            method: method,
            body: JSON.stringify(a)
        });
    }

    async deleteApplicant(id: string) {
        await this.request(`/applicants/${id}`, { method: 'DELETE' });
    }

    // ─── LOGS ───────────────────────────────────────────────────────────────
    async getLogs(): Promise<AuditLog[]> {
        try {
            return await this.request('/logs');
        } catch (e) { return []; }
    }

    async addLog(log: AuditLog) {
        await this.request('/logs', {
            method: 'POST',
            body: JSON.stringify(log)
        });
    }

    // ─── CERTIFICATE BATCHES ───────────────────────────────────────────────
    async getBatches(): Promise<CertificateBatch[]> {
        try {
            return await this.request('/batches');
        } catch (e) { return []; }
    }

    async saveBatch(batch: CertificateBatch) {
        const method = batch.id ? 'PATCH' : 'POST';
        const path = batch.id ? `/batches/${batch.id}` : '/batches';
        return await this.request(path, {
            method: method,
            body: JSON.stringify(batch)
        });
    }

    async deleteBatch(id: string) {
        await this.request(`/batches/${id}`, { method: 'DELETE' });
    }

    // ─── ACTIVITIES ──────────────────────────────────────────────────────────
    async getActivities(): Promise<Activity[]> {
        try {
            return await this.request('/activities');
        } catch (e) { return []; }
    }

    async saveActivity(activity: Activity) {
        const method = activity.id ? 'PATCH' : 'POST';
        const path = activity.id ? `/activities/${activity.id}` : '/activities';
        return await this.request(path, {
            method: method,
            body: JSON.stringify(activity)
        });
    }

    async deleteActivity(id: string) {
        await this.request(`/activities/${id}`, { method: 'DELETE' });
    }

    // ─── CLUB MEMBER MANAGEMENT ────────────────────────────────────────────────
    async getAvailableMembers(clubId: string): Promise<User[]> {
        try {
            return await this.request(`/clubs/${clubId}/available-members`);
        } catch (e) {
            console.error('getAvailableMembers:', e);
            return [];
        }
    }

    async addClubMember(clubId: string, userId: string, role: ClubRole = ClubRole.MEMBER) {
        try {
            return await this.request(`/clubs/${clubId}/members`, {
                method: 'POST',
                body: JSON.stringify({ userId, role })
            });
        } catch (e) {
            console.error('addClubMember:', e);
            throw e;
        }
    }

    async removeClubMember(clubId: string, userId: string) {
        try {
            return await this.request(`/clubs/${clubId}/members/${userId}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('removeClubMember:', e);
            throw e;
        }
    }

    // ─── MANUAL TICKET GENERATION ──────────────────────────────────────────────
    async getTicketCandidates(eventId: string): Promise<User[]> {
        try {
            return await this.request(`/events/${eventId}/ticket-candidates`);
        } catch (e) {
            console.error('getTicketCandidates:', e);
            return [];
        }
    }

    async generateManualTicket(eventId: string, studentId: string, studentName: string, studentRoll: string) {
        try {
            return await this.request(`/events/${eventId}/generate-ticket`, {
                method: 'POST',
                body: JSON.stringify({ studentId, studentName, studentRoll })
            });
        } catch (e) {
            console.error('generateManualTicket:', e);
            throw e;
        }
    }

    // ─── REAL-TIME MESSAGES ────────────────────────────────────────────────────
    async sendMessage(message: Message) {
        try {
            return await this.request('/messages', {
                method: 'POST',
                body: JSON.stringify(message)
            });
        } catch (e) {
            console.error('sendMessage:', e);
            throw e;
        }
    }

    async getMessages(clubId?: string, userId?: string, otherUserId?: string): Promise<Message[]> {
        try {
            const params = new URLSearchParams();
            if (clubId) params.append('clubId', clubId);
            if (userId) params.append('userId', userId);
            if (otherUserId) params.append('otherUserId', otherUserId);
            return await this.request(`/messages?${params.toString()}`);
        } catch (e) {
            console.error('getMessages:', e);
            return [];
        }
    }

    async markMessageAsRead(messageId: string) {
        try {
            return await this.request(`/messages/${messageId}/read`, {
                method: 'PATCH'
            });
        } catch (e) {
            console.error('markMessageAsRead:', e);
            throw e;
        }
    }

    // ─── Utilities ───────────────────────────────────────────────────────────
    generateRandomPassword() { return Math.random().toString(36).slice(-8).toUpperCase(); }

    // Mocks
    async getNotifications() { return []; }
    async sendNotification(_n: Notification) { }
    async getDevelopers() { return []; }
    async saveDeveloper(_d: TeamMember) { }
    async deleteDeveloper(_id: string) { }
    async getMentors() { return []; }
    async saveMentor(_m: Mentor) { }
    async deleteMentor(_id: string) { }
    async getSavedEvents(_userId: string) { return []; }
    async toggleSavedEvent(_userId: string, _eventId: string) { }
    async getDevConfig(): Promise<DevConfig | null> { return null; }
    async saveDevConfig(_d: DevConfig) { }

    // ─── FIREBASE STORAGE (kept for file uploads) ────────────────────────────
    async uploadAsset(file: File, path: string): Promise<string> {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }
}

export const db = new InstitutionalAPI();
