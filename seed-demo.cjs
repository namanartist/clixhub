const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const now = new Date();

// ─── FUTURE EVENTS (2026) ────────────────────────────────────────────────────
const futureEvents = [
  { id: 'evt-f01', title: 'HackMITS 2026 – National Hackathon', type: 'Hackathon', date: '2026-05-15', description: '36-hour national hackathon with ₹2,00,000 prize pool.', venue: 'MITS Main Auditorium', registrationFee: 200, capacity: 300, status: 'Approved', clubId: 'club-csit', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
  { id: 'evt-f02', title: 'RoboWars 2026 – Combat Robotics', type: 'Competition', date: '2026-05-28', description: 'Pit your robot against others in MITS combat robotics tournament.', venue: 'MITS Sports Ground', registrationFee: 150, capacity: 120, status: 'Approved', clubId: 'club-robo', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
  { id: 'evt-f03', title: 'Rangmanch 2026 – Annual Cultural Fest', type: 'Cultural', date: '2026-06-10', description: 'MITS biggest cultural extravaganza – music, dance, drama, art and fashion.', venue: 'Open Air Theatre, MITS', registrationFee: 50, capacity: 1000, status: 'Approved', clubId: 'club-cultural', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' },
  { id: 'evt-f04', title: 'Deep Learning Bootcamp', type: 'Workshop', date: '2026-05-20', description: '5-day intensive bootcamp on Neural Networks, CNNs, Transformers and LLMs.', venue: 'CS Lab Block B', registrationFee: 300, capacity: 60, status: 'Approved', clubId: 'club-csit', imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800' },
  { id: 'evt-f05', title: 'MITS Premier Cricket League 2026', type: 'Sports', date: '2026-06-05', description: 'Inter-branch cricket league. 8 teams, 3 weeks of action.', venue: 'MITS Cricket Ground', registrationFee: 100, capacity: 200, status: 'Approved', clubId: 'club-sports', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800' },
  { id: 'evt-f06', title: 'IoT Smart City Hackathon', type: 'Hackathon', date: '2026-07-01', description: 'Build IoT solutions for smart cities. Sponsored by ISRO and DRDO.', venue: 'Robotics Lab, MITS', registrationFee: 0, capacity: 80, status: 'Approved', clubId: 'club-robo', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
  { id: 'evt-f07', title: 'Open Mic Night – Poetry & Music', type: 'Cultural', date: '2026-05-25', description: 'An evening of raw talent – spoken word, indie music, stand-up.', venue: 'Campus Amphitheatre', registrationFee: 0, capacity: 400, status: 'Approved', clubId: 'club-cultural', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' },
  { id: 'evt-f08', title: 'Cybersecurity CTF 2026', type: 'Competition', date: '2026-06-20', description: 'Capture The Flag competition. Prove your hacking skills ethically.', venue: 'CS Lab A & B', registrationFee: 100, capacity: 150, status: 'Approved', clubId: 'club-csit', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' },
];

for (const e of futureEvents) {
  if (!db.events.find(x => x.id === e.id)) db.events.push(e);
}

// ─── FIX TICKET IDs ON EXISTING REGISTRATIONS ────────────────────────────────
db.registrations = db.registrations.map(r => {
  if (!r.ticketId) {
    return { ...r, ticketId: 'TKT-' + r.eventId.toUpperCase().replace(/-/g,'').slice(0,8) + '-' + (r.studentId||'').slice(-3).toUpperCase() };
  }
  return r;
});

// ─── FUTURE REGISTRATIONS for Aryan (demo-student-001) ───────────────────────
const futureRegs = [
  { id: 'reg-f01', eventId: 'evt-f01', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-HACK2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-18T09:00:00Z', attendanceMarked: false },
  { id: 'reg-f02', eventId: 'evt-f02', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-ROBO2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-19T10:00:00Z', attendanceMarked: false },
  { id: 'reg-f03', eventId: 'evt-f03', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-RANG2026-ARS001', paymentType: 'Free', registrationDate: '2026-04-20T08:00:00Z', attendanceMarked: false },
  { id: 'reg-f04', eventId: 'evt-f04', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-DLBT2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-17T14:00:00Z', attendanceMarked: false },
  { id: 'reg-f05', eventId: 'evt-f05', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', ticketId: 'TKT-CRIC2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-20T12:00:00Z', attendanceMarked: false },
  { id: 'reg-f06', eventId: 'evt-f08', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Pending', ticketId: 'TKT-CTF2026-ARS001', paymentType: 'Online', registrationDate: '2026-04-20T11:00:00Z', attendanceMarked: false },
  // Other students
  { id: 'reg-f07', eventId: 'evt-f01', studentId: 'stu-002', studentName: 'Sneha Jain', studentRoll: '0901CS211002', status: 'Approved', ticketId: 'TKT-HACK2026-SNJ001', paymentType: 'Online', registrationDate: '2026-04-18T10:00:00Z', attendanceMarked: false },
  { id: 'reg-f08', eventId: 'evt-f03', studentId: 'stu-004', studentName: 'Anjali Gupta', studentRoll: '0901CE211004', status: 'Approved', ticketId: 'TKT-RANG2026-ANG001', paymentType: 'Free', registrationDate: '2026-04-19T11:00:00Z', attendanceMarked: false },
  { id: 'reg-f09', eventId: 'evt-f05', studentId: 'stu-005', studentName: 'Vikram Tiwari', studentRoll: '0901ME211005', status: 'Approved', ticketId: 'TKT-CRIC2026-VKT001', paymentType: 'Online', registrationDate: '2026-04-19T09:00:00Z', attendanceMarked: false },
  { id: 'reg-f10', eventId: 'evt-f02', studentId: 'stu-003', studentName: 'Rahul Mishra', studentRoll: '0901EC211003', status: 'Approved', ticketId: 'TKT-ROBO2026-RHM001', paymentType: 'Online', registrationDate: '2026-04-20T08:30:00Z', attendanceMarked: false },
];

for (const r of futureRegs) {
  if (!db.registrations.find(x => x.id === r.id)) db.registrations.push(r);
}

// ─── ACTIVITIES ────────────────────────────────────────────────────────────────
db.activities = [
  { id: 'act-001', type: 'registration', userId: 'demo-student-001', message: 'Aryan Sharma registered for HackMITS 2026', timestamp: new Date(now - 6*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-002', type: 'registration', userId: 'demo-student-001', message: 'Aryan Sharma registered for RoboWars 2026', timestamp: new Date(now - 5*3600*1000).toISOString(), clubId: 'club-robo' },
  { id: 'act-003', type: 'certificate', userId: 'demo-student-001', message: 'Certificate issued: MITS-CSI-2024-00001', timestamp: new Date(now - 2*24*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-004', type: 'approval', userId: 'demo-faculty-001', message: 'Dr. Priya Verma approved certificate batch batch-004', timestamp: new Date(now - 2*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-005', type: 'event', userId: 'demo-admin-001', message: 'New event created: Deep Learning Bootcamp', timestamp: new Date(now - 3*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-006', type: 'registration', userId: 'stu-002', message: 'Sneha Jain registered for HackMITS 2026', timestamp: new Date(now - 1*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-007', type: 'registration', userId: 'stu-004', message: 'Anjali Gupta registered for Rangmanch 2026', timestamp: new Date(now - 45*60*1000).toISOString(), clubId: 'club-cultural' },
  { id: 'act-008', type: 'attendance', userId: 'demo-student-001', message: 'Attendance marked for AI/ML Workshop', timestamp: new Date(now - 4*24*3600*1000).toISOString(), clubId: 'club-csit' },
  { id: 'act-009', type: 'login', userId: 'demo-faculty-001', message: 'Faculty Dr. Priya Verma logged in', timestamp: new Date(now - 30*60*1000).toISOString(), clubId: null },
  { id: 'act-010', type: 'registration', userId: 'stu-005', message: 'Vikram Tiwari registered for Cricket League 2026', timestamp: new Date(now - 2*3600*1000).toISOString(), clubId: 'club-sports' },
  { id: 'act-011', type: 'application', userId: 'stu-003', message: 'Rahul Mishra moved to Interview stage', timestamp: new Date(now - 20*60*1000).toISOString(), clubId: 'club-robo' },
  { id: 'act-012', type: 'certificate', userId: 'stu-008', message: 'Certificate issued: MITS-CUL-2024-0001', timestamp: new Date(now - 3*24*3600*1000).toISOString(), clubId: 'club-cultural' },
];

// ─── AUDIT LOGS ────────────────────────────────────────────────────────────────
db.logs = [
  { id: 'log-001', user: 'Aryan Sharma', action: 'Registered for HackMITS 2026', timestamp: new Date(now - 6*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-002', user: 'Aryan Sharma', action: 'Downloaded ticket TKT-HACK2026-ARS001', timestamp: new Date(now - 5*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-003', user: 'Dr. Priya Verma', action: 'Approved certificate batch batch-004', timestamp: new Date(now - 2*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-004', user: 'Admin (Demo)', action: 'Created event: Deep Learning Bootcamp', timestamp: new Date(now - 3*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-005', user: 'Sneha Jain', action: 'Registered for HackMITS 2026', timestamp: new Date(now - 1*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-006', user: 'Rahul Mishra', action: 'Updated RoboWars 2026 registration', timestamp: new Date(now - 4*3600*1000).toLocaleString('en-IN'), clubId: 'club-robo' },
  { id: 'log-007', user: 'Aryan Sharma', action: 'Moved applicant to Interview stage', timestamp: new Date(now - 15*60*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-008', user: 'Vikram Tiwari', action: 'Registered for MITS Cricket League 2026', timestamp: new Date(now - 2*3600*1000).toLocaleString('en-IN'), clubId: 'club-sports' },
  { id: 'log-009', user: 'System', action: 'Auto-generated certificate batch for Open Source Day', timestamp: new Date(now - 8*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-010', user: 'Dr. Manish Dixit', action: 'Signed and approved batch batch-007', timestamp: new Date(now - 1*24*3600*1000).toLocaleString('en-IN'), clubId: 'club-cultural' },
  { id: 'log-011', user: 'Anjali Gupta', action: 'Registered for Open Mic Night 2026', timestamp: new Date(now - 45*60*1000).toLocaleString('en-IN'), clubId: 'club-cultural' },
  { id: 'log-012', user: 'Admin (Demo)', action: 'Added new student to Student Registry', timestamp: new Date(now - 2*24*3600*1000).toLocaleString('en-IN'), clubId: null },
  { id: 'log-013', user: 'Aryan Sharma', action: 'Registered for Deep Learning Bootcamp', timestamp: new Date(now - 3*24*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-014', user: 'System', action: 'Attendance finalized for AI/ML Workshop – 45 students', timestamp: new Date(now - 5*24*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
  { id: 'log-015', user: 'Aryan Sharma', action: 'Marked 12 member attendances in CSIT Club', timestamp: new Date(now - 6*24*3600*1000).toLocaleString('en-IN'), clubId: 'club-csit' },
];

// ─── MORE APPLICANTS ─────────────────────────────────────────────────────────
// ─── MORE APPLICANTS WITH TRACKING IDs ───────────────────────────────────────
const moreApplicants = [
  { id: 'app-f01', name: 'Tanmay Sharma', rollNumber: '0901CS231041', email: 'tanmay@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'Passionate about web dev and hackathons', stage: 'Applied', domain: 'Technical', clubId: 'club-csit', recruitmentCycle: '2026' },
  { id: 'app-f02', name: 'Richa Agarwal', rollNumber: '0901EC231042', email: 'richa@mitsgwl.ac.in', branch: 'EC', whyJoin: 'Love robotics and want to contribute to projects', stage: 'Interview', domain: 'Technical', clubId: 'club-robo', recruitmentCycle: '2026' },
  { id: 'app-f03', name: 'Karan Patel', rollNumber: '0901ME231043', email: 'karan@mitsgwl.ac.in', branch: 'ME', whyJoin: 'Want to organize cultural events and perform', stage: 'Applied', domain: 'Cultural', clubId: 'club-cultural', recruitmentCycle: '2026' },
  { id: 'app-f04', name: 'Sanjana Mishra', rollNumber: '0901CS231044', email: 'sanjana@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'Interested in AI/ML and data science projects', stage: 'Selected', domain: 'Technical', clubId: 'club-csit', recruitmentCycle: '2026' },
  { id: 'app-f05', name: 'Devendra Yadav', rollNumber: '0901CE231045', email: 'devendra@mitsgwl.ac.in', branch: 'CE', whyJoin: 'Sports is my passion, want to represent MITS', stage: 'Applied', domain: 'Sports', clubId: 'club-sports', recruitmentCycle: '2026' },
  { id: 'app-f06', name: 'Ishika Jain', rollNumber: '0901IT231046', email: 'ishika@mitsgwl.ac.in', branch: 'IT', whyJoin: 'Full-stack developer, want to build SaaS tools', stage: 'Interview', domain: 'Technical', clubId: 'club-csit', recruitmentCycle: '2026' },
  { id: 'app-f07', name: 'Aryan Sharma', rollNumber: '0901CS211001', email: 'aryan@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'I want to lead the technical wing and organize national hackathons.', stage: 'Screening', domain: 'Technical', clubId: 'club-csit', recruitmentCycle: '2026' },
  { id: 'app-f08', name: 'Aryan Sharma', rollNumber: '0901CS211001', email: 'aryan@mitsgwl.ac.in', branch: 'CSIT', whyJoin: 'I have experience in robotics and want to contribute to the next RoboWars.', stage: 'Interview', domain: 'Technical', clubId: 'club-robo', recruitmentCycle: '2026' },
];

for (const a of moreApplicants) {
  if (!db.applicants.find(x => x.id === a.id)) db.applicants.push(a);
}

// ─── CHAT MESSAGES ──────────────────────────────────────────────────────────
db.messages = [
  { id: 'm1', senderId: 'demo-student-001', senderName: 'Aryan Sharma', content: 'Hey everyone! Is the HackMITS registration open?', timestamp: new Date(now - 12*3600*1000).toISOString(), type: 'text', status: 'read', clubId: 'club-csit' },
  { id: 'm2', senderId: 'stu-002', senderName: 'Sneha Jain', content: 'Yes Aryan! Just registered. The dashboard UI looks amazing.', timestamp: new Date(now - 11.5*3600*1000).toISOString(), type: 'text', status: 'read', clubId: 'club-csit' },
  { id: 'm3', senderId: 'demo-student-001', senderName: 'Aryan Sharma', content: 'Awesome! See you there.', timestamp: new Date(now - 11*3600*1000).toISOString(), type: 'text', status: 'read', clubId: 'club-csit' },
  { id: 'm4', senderId: 'demo-faculty-001', senderName: 'Dr. Priya Verma', content: 'Good to see the enthusiasm. Please ensure all technical requirements are met.', timestamp: new Date(now - 10*3600*1000).toISOString(), type: 'text', status: 'read', clubId: 'club-csit' },
  { id: 'm5', senderId: 'stu-003', senderName: 'Rahul Mishra', content: 'Aryan, did you get your RoboWars interview slot?', timestamp: new Date(now - 2*3600*1000).toISOString(), type: 'text', status: 'sent', recipientId: 'demo-student-001' },
];

// ─── APPROVED CERT BATCH for Deep Learning Bootcamp ─────────────────────────
const newBatch = {
  id: 'batch-f01', clubId: 'club-csit', eventId: 'evt-f04', templateId: 'modern', status: 'Approved',
  createdBy: 'Aryan Sharma', createdAt: '2026-04-15T10:00:00Z',
  certificates: [
    { serialNumber: 'MITS-CSI-2026-00010', studentId: 'demo-student-001', studentName: 'Aryan Sharma', enrollmentNumber: '0901CS211001', eventName: 'Deep Learning Bootcamp', clubId: 'club-csit', clubName: 'CSIT Club', date: '2026-04-15', hash: 'a1b2c3d4e5f6789012345678', batchId: 'batch-f01' },
    { serialNumber: 'MITS-CSI-2026-00011', studentId: 'stu-006', studentName: 'Pooja Choudhary', enrollmentNumber: '0901CS211006', eventName: 'Deep Learning Bootcamp', clubId: 'club-csit', clubName: 'CSIT Club', date: '2026-04-15', hash: 'e5d4c3b2a1f6789012345679', batchId: 'batch-f01' },
  ],
  approvalChain: [
    { role: 'Faculty', approverName: 'Prof. Suresh Kumar', status: 'Approved', approvedAt: '2026-04-16T09:00:00Z' },
    { role: 'Dean', approverName: 'Dr. Manish Dixit', status: 'Approved', approvedAt: '2026-04-17T14:00:00Z' },
  ]
};

if (!db.batches.find(b => b.id === newBatch.id)) db.batches.push(newBatch);

// ─── SAVE ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('✅ Demo data injected successfully!');
console.log('Events total:', db.events.length);
console.log('Registrations total:', db.registrations.length);
console.log('Aryan registrations:', db.registrations.filter(r => r.studentId === 'demo-student-001').length);
console.log('Applicants total:', db.applicants.length);
console.log('Batches total:', db.batches.length);
console.log('Activities total:', (db.activities||[]).length);
console.log('Logs total:', db.logs.length);

// Print Aryan active tickets
const aryanRegs = db.registrations.filter(r => r.studentId === 'demo-student-001');
const futureEvtIds = new Set(db.events.filter(e => new Date(e.date) >= new Date()).map(e => e.id));
const activeTickets = aryanRegs.filter(r => futureEvtIds.has(r.eventId));
console.log('\nAryan ACTIVE tickets (future events):', activeTickets.length);
activeTickets.forEach(r => console.log(' -', r.ticketId, r.status, db.events.find(e=>e.id===r.eventId)?.title));
