const fs = require('fs');
const path = require('path');

import http from 'http';


const DB_PATH = path.join(__dirname, 'db.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// ── FUTURE EVENTS (next 3-6 months from April 2026) ──────────────────────────
const futureEvents = [
  {
    id: 'evt-f01',
    title: 'HackMITS 2026 – National Hackathon',
    type: 'Hackathon',
    date: '2026-05-15',
    description: '36-hour national hackathon with ₹2,00,000 prize pool. Build solutions for real-world problems.',
    venue: 'MITS Main Auditorium',
    registrationFee: 200,
    capacity: 300,
    status: 'Approved',
    clubId: 'club-csit',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
  },
  {
    id: 'evt-f02',
    title: 'RoboWars 2026 – Combat Robotics',
    type: 'Competition',
    date: '2026-05-28',
    description: 'Pit your robot against others in MITS\'s premier combat robotics tournament.',
    venue: 'MITS Sports Ground',
    registrationFee: 150,
    capacity: 120,
    status: 'Approved',
    clubId: 'club-robo',
    imageUrl: 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800',
  },
  {
    id: 'evt-f03',
    title: 'Rangmanch 2026 – Annual Cultural Fest',
    type: 'Cultural',
    date: '2026-06-10',
    description: 'MITS\'s biggest cultural extravaganza — music, dance, drama, art and fashion.',
    venue: 'Open Air Theatre, MITS',
    registrationFee: 50,
    capacity: 1000,
    status: 'Approved',
    clubId: 'club-cultural',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
  },
  {
    id: 'evt-f04',
    title: 'Deep Learning Bootcamp',
    type: 'Workshop',
    date: '2026-05-20',
    description: '5-day intensive bootcamp on Neural Networks, CNNs, Transformers and LLMs.',
    venue: 'CS Lab Block B',
    registrationFee: 300,
    capacity: 60,
    status: 'Approved',
    clubId: 'club-csit',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
  },
  {
    id: 'evt-f05',
    title: 'MITS Premier Cricket League 2026',
    type: 'Sports',
    date: '2026-06-05',
    description: 'Inter-branch cricket league. 8 teams, 3 weeks of action.',
    venue: 'MITS Cricket Ground',
    registrationFee: 100,
    capacity: 200,
    status: 'Approved',
    clubId: 'club-sports',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
  },
  {
    id: 'evt-f06',
    title: 'IoT Smart City Hackathon',
    type: 'Hackathon',
    date: '2026-07-01',
    description: 'Build IoT solutions for smart cities. Sponsored by ISRO & DRDO.',
    venue: 'Robotics Lab, MITS',
    registrationFee: 0,
    capacity: 80,
    status: 'Approved',
    clubId: 'club-robo',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  },
  {
    id: 'evt-f07',
    title: 'Open Mic Night – Poetry & Music',
    type: 'Cultural',
    date: '2026-05-25',
    description: 'An evening of raw talent — spoken word, indie music, stand-up.',
    venue: 'Campus Amphitheatre',
    registrationFee: 0,
    capacity: 400,
    status: 'Approved',
    clubId: 'club-cultural',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  },
  {
    id: 'evt-f08',
    title: 'Cybersecurity CTF 2026',
    type: 'Competition',
    date: '2026-06-20',
    description: 'Capture The Flag competition. Prove your hacking skills ethically.',
    venue: 'CS Lab A & B',
    registrationFee: 100,
    capacity: 150,
    status: 'Approved',
    clubId: 'club-csit',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
  },
];

// ── REGISTRATIONS for demo-student-001 (Aryan Sharma) ────────────────────────
const aryanFutureRegs = [
  { id: 'reg-f01', eventId: 'evt-f01', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-HACK2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-18T09:00:00Z', attendanceMarked: false },
  { id: 'reg-f02', eventId: 'evt-f02', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-ROBO2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-19T10:00:00Z', attendanceMarked: false },
  { id: 'reg-f03', eventId: 'evt-f03', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-RANG2026-ARS001', paymentType: 'Free', registrationDate: '2026-04-20T08:00:00Z', attendanceMarked: false },
  { id: 'reg-f04', eventId: 'evt-f04', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-DLBT2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-17T14:00:00Z', attendanceMarked: false },
  { id: 'reg-f05', eventId: 'evt-f08', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Pending', ticketId: 'TKT-CTF2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-20T11:00:00Z', attendanceMarked: false },
];

// Fix ticketId on existing past registrations
db.registrations = db.registrations.map(r => {
  if (r.studentId === 'demo-student-001' && !r.ticketId) {
    return { ...r, ticketId: `TKT-${r.eventId.toUpperCase().replace(/-/g,'')}-ARS` };
  }
  return r;
});

// Add future regs (avoid duplicates)
for (const reg of aryanFutureRegs) {
  if (!db.registrations.find(r => r.id === reg.id)) {
    db.registrations.push(reg);
  }
}

// Add future events (avoid duplicates)
for (const evt of futureEvents) {
  if (!db.events.find(e => e.id === evt.id)) {
    db.events.push(evt);
  }
}

// ── ADD RICH ACTIVITIES ────────────────────────────────────────────────────────
const now = new Date();
const activities = [
  { id: 'act-001', type: 'registration', userId: 'demo-student-001', message: 'Registered for HackMITS 2026', timestamp: new Date(now - 6*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-002', type: 'registration', userId: 'demo-student-001', message: 'Registered for RoboWars 2026', timestamp: new Date(now - 5*3600000).toISOString(), clubId: 'club-robo' },
  { id: 'act-003', type: 'certificate', userId: 'demo-student-001', message: 'Certificate issued for CodeQuest 2024', timestamp: new Date(now - 2*24*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-004', type: 'application', userId: 'demo-student-001', message: 'Applied to CSIT Club Tech Team', timestamp: new Date(now - 5*24*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-005', type: 'attendance', userId: 'demo-student-001', message: 'Attendance marked for Web Dev Bootcamp', timestamp: new Date(now - 10*24*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-006', type: 'registration', userId: 'stu-002', message: 'Sneha registered for Rangmanch 2026', timestamp: new Date(now - 1*3600000).toISOString(), clubId: 'club-cultural' },
  { id: 'act-007', type: 'event', userId: 'demo-admin-001', message: 'New event created: Deep Learning Bootcamp', timestamp: new Date(now - 3*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-008', type: 'certificate', userId: 'stu-003', message: 'Certificate issued for RoboWars 2024', timestamp: new Date(now - 7*24*3600000).toISOString(), clubId: 'club-robo' },
  { id: 'act-009', type: 'login', userId: 'demo-faculty-001', message: 'Faculty Dr. Priya Verma logged in', timestamp: new Date(now - 30*60000).toISOString(), clubId: null },
  { id: 'act-010', type: 'approval', userId: 'demo-faculty-001', message: 'Approved certificate batch for AI/ML Workshop', timestamp: new Date(now - 2*3600000).toISOString(), clubId: 'club-csit' },
  { id: 'act-011', type: 'registration', userId: 'stu-004', message: 'Anjali registered for Open Mic Night', timestamp: new Date(now - 45*60000).toISOString(), clubId: 'club-cultural' },
  { id: 'act-012', type: 'registration', userId: 'stu-005', message: 'Vikram registered for Cricket League 2026', timestamp: new Date(now - 2*3600000).toISOString(), clubId: 'club-sports' },
];

db.activities = activities;

// ── RICH AUDIT LOGS ────────────────────────────────────────────────────────────
const logs = [
  { id: 'log-001', user: 'Aryan Sharma', action: 'Registered for HackMITS 2026', timestamp: new Date(now - 6*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-002', user: 'Aryan Sharma', action: 'Downloaded ticket TKT-HACK2026-ARS001', timestamp: new Date(now - 5*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-003', user: 'Dr. Priya Verma', action: 'Approved certificate batch batch-004', timestamp: new Date(now - 2*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-004', user: 'Admin (Demo)', action: 'Created event: Deep Learning Bootcamp', timestamp: new Date(now - 3*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-005', user: 'Sneha Jain', action: 'Registered for Rangmanch 2026', timestamp: new Date(now - 1*3600000).toLocaleString('en-IN'), clubId: 'club-cultural' },
  { id: 'log-006', user: 'Rahul Mishra', action: 'Updated RoboWars 2026 event details', timestamp: new Date(now - 4*3600000).toLocaleString('en-IN'), clubId: 'club-robo' },
  { id: 'log-007', user: 'Aryan Sharma', action: 'Approved recruitment application – Stage: Interview', timestamp: new Date(now - 15*60000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-008', user: 'Vikram Tiwari', action: 'Registered for MITS Cricket League 2026', timestamp: new Date(now - 2*3600000).toLocaleString('en-IN'), clubId: 'club-sports' },
  { id: 'log-009', user: 'System', action: 'Auto-generated certificate batch for Open Source Day', timestamp: new Date(now - 8*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-010', user: 'Dr. Manish Dixit', action: 'Signed & approved batch batch-007', timestamp: new Date(now - 1*24*3600000).toLocaleString('en-IN'), clubId: 'club-cultural' },
  { id: 'log-011', user: 'Anjali Gupta', action: 'Registered for Open Mic Night 2026', timestamp: new Date(now - 45*60000).toLocaleString('en-IN'), clubId: 'club-cultural' },
  { id: 'log-012', user: 'Admin (Demo)', action: 'Added new student: Priya Singh to Student Registry', timestamp: new Date(now - 2*24*3600000).toLocaleString('en-IN'), clubId: null },
  { id: 'log-013', user: 'Aryan Sharma', action: 'Registered for Deep Learning Bootcamp', timestamp: new Date(now - 3*24*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-014', user: 'System', action: 'Attendance finalized for AI/ML Workshop (45 students)', timestamp: new Date(now - 5*24*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-015', user: 'Aryan Sharma', action: 'Marked attendance for 12 members in CSIT Club', timestamp: new Date(now - 6*24*3600000).toLocaleString('en-IN'), clubId: 'club-csit' },
];

db.logs = logs;

// ── ADD MORE APPLICANTS ─────────────────────────────────────────────────────────
const moreApplicants = [
  { id: 'app-f01', name: 'Tanmay Sharma', rollNumber: '0901CS231041', email: 'tanmay@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'Passionate about web dev and hackathons', stage: 'Applied', domain: 'Technical', clubId: 'club-csit' },
  { id: 'app-f02', name: 'Richa Agarwal', rollNumber: '0901EC231042', email: 'richa@mitsgwl.ac.in', branch: 'EC', whyJoin: 'Love robotics and want to contribute to projects', stage: 'Interview', domain: 'Technical', clubId: 'club-robo' },
  { id: 'app-f03', name: 'Karan Patel', rollNumber: '0901ME231043', email: 'karan@mitsgwl.ac.in', branch: 'ME', whyJoin: 'Want to organize cultural events and perform', stage: 'Applied', domain: 'Cultural', clubId: 'club-cultural' },
  { id: 'app-f04', name: 'Sanjana Mishra', rollNumber: '0901CS231044', email: 'sanjana@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'Interested in AI/ML and data science projects', stage: 'Selected', domain: 'Technical', clubId: 'club-csit' },
  { id: 'app-f05', name: 'Devendra Yadav', rollNumber: '0901CE231045', email: 'devendra@mitsgwl.ac.in', branch: 'CE', whyJoin: 'Sports is my passion, want to represent MITS', stage: 'Applied', domain: 'Sports', clubId: 'club-sports' },
  { id: 'app-f06', name: 'Ishika Jain', rollNumber: '0901IT231046', email: 'ishika@mitsgwl.ac.in', branch: 'IT', whyJoin: 'Full-stack developer, want to build SaaS tools', stage: 'Interview', domain: 'Technical', clubId: 'club-csit' },
];

for (const app of moreApplicants) {
  if (!db.applicants.find(a => a.id === app.id)) {
    db.applicants.push(app);
  }
}

// ── ENHANCED CERTIFICATE BATCHES ───────────────────────────────────────────────
// Add an approved batch that includes Aryan for recent events
const newBatches = [
  {
    id: 'batch-f01',
    clubId: 'club-csit',
    eventId: 'evt-f04',
    templateId: 'modern',
    status: 'Approved',
    createdBy: 'Aryan Sharma',
    createdAt: '2026-04-15T10:00:00Z',
    certificates: [
      { serialNumber: 'MITS-CSI-2026-00010', studentId: 'demo-student-001', studentName: 'Aryan Sharma', enrollmentNumber: '0901CS211001', eventName: 'Deep Learning Bootcamp', clubId: 'club-csit', clubName: 'CSIT Club', date: '2026-04-15', hash: 'a1b2c3d4e5f6789012345678', batchId: 'batch-f01' },
      { serialNumber: 'MITS-CSI-2026-00011', studentId: 'stu-006', studentName: 'Pooja Choudhary', enrollmentNumber: '0901CS211006', eventName: 'Deep Learning Bootcamp', clubId: 'club-csit', clubName: 'CSIT Club', date: '2026-04-15', hash: 'e5d4c3b2a1f6789012345679', batchId: 'batch-f01' },
      { serialNumber: 'MITS-CSI-2026-00012', studentId: 'stu-015', studentName: 'Shreya Pandey', enrollmentNumber: '0901CS221015', eventName: 'Deep Learning Bootcamp', clubId: 'club-csit', clubName: 'CSIT Club', date: '2026-04-15', hash: 'f1e2d3c4b5a6789012345680', batchId: 'batch-f01' },
    ],
    approvalChain: [
      { role: 'Faculty', approverName: 'Prof. Suresh Kumar', status: 'Approved', approvedAt: '2026-04-16T09:00:00Z' },
      { role: 'Dean', approverName: 'Dr. Manish Dixit', status: 'Approved', approvedAt: '2026-04-17T14:00:00Z' },
    ]
  }
];

for (const batch of newBatches) {
  if (!db.batches.find(b => b.id === batch.id)) {
    db.batches.push(batch);
  }
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log('✅ Demo data injected successfully!');
console.log('Events total:', db.events.length);
console.log('Registrations total:', db.registrations.length);
console.log('Aryan registrations:', db.registrations.filter(r => r.studentId === 'demo-student-001').length);
console.log('Applicants total:', db.applicants.length);
console.log('Batches total:', db.batches.length);
console.log('Activities total:', db.activities.length);
console.log('Logs total:', db.logs.length);

