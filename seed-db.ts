import { SEED_USERS, CLUBS, EVENTS, INITIAL_REGISTRATIONS, INITIAL_APPLICANTS, INITIAL_AUDIT_LOGS } from './constants.tsx';

const seedData = {
    users: SEED_USERS,
    clubs: CLUBS,
    events: EVENTS,
    registrations: INITIAL_REGISTRATIONS,
    applicants: INITIAL_APPLICANTS,
    logs: INITIAL_AUDIT_LOGS
};

async function seed() {
    try {
        const res = await fetch('http://localhost:4000/api/db/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seedData)
        });
        const result = await res.json();
        console.log('Seed Result:', result);
    } catch (e) {
        console.error('Seed Failed:', e);
    }
}

seed();
