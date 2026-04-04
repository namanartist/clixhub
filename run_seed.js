const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const SEED_DATA = {
    users: [
        { id: 'demo-student-001', name: 'Aryan Sharma', email: 'aryan@mitsgwl.ac.in', globalRole: 'Student', enrollmentNumber: '0901CS211001', branch: 'Computer Science & IT', department: 'Computer Science & IT', phoneNumber: '9876543210', skills: ['React', 'Node.js', 'MongoDB', 'Python'], linkedin: 'https://linkedin.com/in/aryan-sharma', github: 'https://github.com/aryan-sharma', signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Signature_of_Theodore_Roosevelt.svg/2560px-Signature_of_Theodore_Roosevelt.svg.png', clubMemberships: [{ clubId: 'club-csit', role: 'President' }] },
        { id: 'demo-faculty-001', name: 'Dr. Priya Verma', email: 'priya.verma@mitsgwl.ac.in', globalRole: 'Faculty', enrollmentNumber: 'FAC-2024-01', branch: 'Information Technology', department: 'Information Technology', designation: 'Associate Professor', phoneNumber: '9123456780', signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Signature_of_John_Hancock.png', clubMemberships: [] },
        { id: 'demo-dean-001', name: 'Dr. Manish Dixit', email: 'dean.sw@mitsgwl.ac.in', globalRole: 'Dean', enrollmentNumber: 'DEAN-SW-01', branch: 'Dean Student Welfare', department: 'Dean Student Welfare', designation: 'Dean of Student Welfare', phoneNumber: '9000000001', signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Signature_of_Theodore_Roosevelt.png', clubMemberships: [] },
        { id: 'demo-admin', name: 'Admin (Demo)', email: 'admin@mitsgwl.ac.in', globalRole: 'Super Admin', enrollmentNumber: 'ADMIN-001', branch: 'System', department: 'Institutional Operations', designation: 'Platform Administrator', phoneNumber: '9001112223', clubMemberships: [] },
        { id: 'demo-student-002', name: 'Sneha Gupta', email: 'demo-student-002@mitsgwl.ac.in', globalRole: 'Student', enrollmentNumber: '0901IT211045', branch: 'IT', clubMemberships: [{ clubId: 'club-robotics', role: 'Member' }] },
        // Demo users for quick login
        { id: 'demo-student-example', name: 'Demo Student', email: 'demo-student@example.com', globalRole: 'Student', enrollmentNumber: 'DEMO-STU-001', branch: 'Computer Science & IT', department: 'Computer Science & IT', phoneNumber: '9999999999', skills: ['Test Automation', 'UI Design'], linkedin: 'https://linkedin.com/in/demo-student', github: 'https://github.com/demo-student', signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Signature_example.svg', clubMemberships: [{ clubId: 'club-csit', role: 'Member' }] },
        { id: 'demo-faculty-example', name: 'Demo Faculty', email: 'demo-faculty@example.com', globalRole: 'Faculty', enrollmentNumber: 'DEMO-FAC-001', branch: 'Information Technology', department: 'Information Technology', designation: 'Assistant Professor', phoneNumber: '8888888888', linkedin: 'https://linkedin.com/in/demo-faculty', signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Signature_of_John_Hancock.png', clubMemberships: [] },
        { id: 'demo-admin-example', name: 'Demo Admin', email: 'demo-admin@example.com', globalRole: 'Super Admin', enrollmentNumber: 'DEMO-ADMIN-001', branch: 'System', department: 'Campus Systems', designation: 'Platform Administrator', phoneNumber: '7777777777', clubMemberships: [] }
    ],
    clubs: [
        { id: 'club-csit', name: 'CSIT Club', category: 'Technical', subdomain: 'csit', facultyCoordinatorId: 'demo-faculty-001', status: 'Active', themeColor: '#2563eb', leadership: { 'President': 'Aryan Sharma' } },
        { id: 'club-robotics', name: 'Robotics Club', category: 'Technical', subdomain: 'robotics', facultyCoordinatorId: 'demo-faculty-001', status: 'Active', themeColor: '#dc2626', leadership: { 'President': 'Vikram Singh' } },
        { id: 'club-music', name: 'Music Club', category: 'Cultural', subdomain: 'music', facultyCoordinatorId: 'demo-faculty-001', status: 'Active', themeColor: '#9333ea', leadership: { 'President': 'Ananya Rai' } }
    ],
    events: [
        { id: 'event-001', clubId: 'club-csit', title: 'CodeQuest 2024', description: 'National level coding competition.', type: 'Free', status: 'Approved', date: '2024-04-15T10:00:00Z', bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
        { id: 'event-002', clubId: 'club-robotics', title: 'RoboWars v5', description: 'Battle of the bots.', type: 'Paid', fee: 200, status: 'Approved', date: '2024-05-20T09:00:00Z', bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e' }
    ],
    registrations: [
        { id: 'reg-001', eventId: 'event-001', studentId: 'demo-student-001', studentName: 'Aryan Sharma', studentRoll: '0901CS211001', status: 'Approved', paymentType: 'Free', attendanceMarked: true, certificateId: 'cert-001' },
        { id: 'reg-002', eventId: 'event-001', studentId: 'demo-student-002', studentName: 'Sneha Gupta', studentRoll: '0901IT211045', status: 'Approved', paymentType: 'Free', attendanceMarked: true }
    ],
    applicants: [
        { id: 'app-001', name: 'Rahul Mishra', rollNumber: '0901CS221089', branch: 'CSIT', domain: 'Development', stage: 'Interview', whyJoin: 'Passionate about coding.', clubId: 'club-csit', email: 'rahul@example.com' }
    ],
    logs: [
        { id: 'log-001', timestamp: new Date().toISOString(), user: 'Dr. Priya Verma', action: 'Approved event CodeQuest 2024', clubId: 'club-csit' }
    ],
    batches: [
        {
            id: 'batch-001', clubId: 'club-csit', eventId: 'event-001', status: 'Approved', createdBy: 'Aryan Sharma', createdAt: new Date().toISOString(),
            certificates: [
                { serialNumber: 'MITS-CSI-2024-00001', studentId: 'demo-student-001', studentName: 'Aryan Sharma', enrollmentNumber: '0901CS211001', eventName: 'CodeQuest 2024', clubId: 'club-csit', clubName: 'CSIT Club', date: '2024-04-15', hash: 'abc123hash', batchId: 'batch-001' }
            ],
            approvalChain: [
                { role: 'Faculty', approverName: 'Dr. Priya Verma', status: 'Approved', approvedAt: new Date().toISOString() },
                { role: 'Dean', approverName: 'Dr. Manish Dixit', status: 'Approved', approvedAt: new Date().toISOString() }
            ]
        }
    ]
};

async function seed() {
    try {
        console.log('Seeding enriched demo data...');
        const res = await fetch('http://127.0.0.1:4000/api/db/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(SEED_DATA)
        });
        const result = await res.json();
        console.log('Seed Result:', result);
    } catch (e) {
        console.error('Seed Failed:', e.message);
    }
}

seed();
