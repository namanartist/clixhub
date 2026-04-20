// seed-db.ts — Run this script to seed the database with demo data from db.json
// Usage: node --loader ts-node/esm seed-db.ts
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
    try {
        const dbPath = path.join(process.cwd(), 'db.json');
        if (!fs.existsSync(dbPath)) {
            console.error('db.json not found. Please run the server first to generate it.');
            process.exit(1);
        }
        const seedData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
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
