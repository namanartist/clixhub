const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const SEED_DATA = {
    users: [
        { 
            id: 'demo-student-001', 
            name: 'Aryan Sharma', 
            email: 'aryan@mitsgwl.ac.in', 
            globalRole: 'Student', 
            enrollmentNumber: '0901CS211001', 
            branch: 'Computer Science & IT', 
            department: 'Computer Science & IT', 
            phoneNumber: '9876543210', 
            skills: ['React', 'Node.js', 'MongoDB', 'Python'], 
            linkedin: 'https://linkedin.com/in/aryan-sharma', 
            github: 'https://github.com/aryan-sharma', 
            signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Signature_of_Theodore_Roosevelt.svg/2560px-Signature_of_Theodore_Roosevelt.svg.png', 
            clubMemberships: [
                { clubId: 'club-csit', role: 'President' },
                { clubId: 'club-robotics', role: 'Member' }
            ] 
        },
        { 
            id: 'demo-faculty-001', 
            name: 'Dr. Priya Verma', 
            email: 'priya.verma@mitsgwl.ac.in', 
            globalRole: 'Faculty', 
            enrollmentNumber: 'FAC-2024-01', 
            branch: 'Information Technology', 
            department: 'Information Technology', 
            designation: 'Associate Professor', 
            phoneNumber: '9123456780', 
            signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Signature_of_John_Hancock.png', 
            clubMemberships: [] 
        },
        { 
            id: 'demo-dean-001', 
            name: 'Dr. Manish Dixit', 
            email: 'dean.sw@mitsgwl.ac.in', 
            globalRole: 'Dean', 
            enrollmentNumber: 'DEAN-SW-01', 
            branch: 'Dean Student Welfare', 
            department: 'Dean Student Welfare', 
            designation: 'Dean of Student Welfare', 
            phoneNumber: '9000000001', 
            signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Signature_of_Theodore_Roosevelt.png', 
            clubMemberships: [] 
        },
        { 
            id: 'demo-admin', 
            name: 'Admin (Demo)', 
            email: 'admin@mitsgwl.ac.in', 
            globalRole: 'Super Admin', 
            enrollmentNumber: 'ADMIN-001', 
            branch: 'System', 
            department: 'Institutional Operations', 
            designation: 'Platform Administrator', 
            phoneNumber: '9001112223', 
            clubMemberships: [] 
        },
        { 
            id: 'demo-student-example', 
            name: 'Demo Student', 
            email: 'demo-student@example.com', 
            globalRole: 'Student', 
            enrollmentNumber: 'DEMO-STU-001', 
            branch: 'Computer Science & IT', 
            department: 'Computer Science & IT', 
            phoneNumber: '9999999999', 
            skills: ['Test Automation', 'UI Design'], 
            linkedin: 'https://linkedin.com/in/demo-student', 
            github: 'https://github.com/demo-student', 
            signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Signature_example.svg', 
            clubMemberships: [{ clubId: 'club-csit', role: 'Member' }] 
        }
    ],
    clubs: [
        { 
            id: 'club-csit', 
            name: 'CSIT Club', 
            category: 'Technical', 
            subdomain: 'csit', 
            facultyCoordinatorId: 'demo-faculty-001', 
            status: 'Active', 
            themeColor: '#2563eb', 
            leadership: { 'President': 'Aryan Sharma', 'Tech Head': 'Pooja Choudhary' },
            tagline: 'Code. Create. Conquer.',
            description: 'The premier technical club of MITS Gwalior.',
            recruitmentActive: true
        },
        { 
            id: 'club-robotics', 
            name: 'Robotics Club', 
            category: 'Technical', 
            subdomain: 'robotics', 
            facultyCoordinatorId: 'demo-faculty-001', 
            status: 'Active', 
            themeColor: '#dc2626', 
            leadership: { 'President': 'Vikram Singh' },
            tagline: 'Build the Future.',
            description: 'Exploring the boundaries of hardware and AI.',
            recruitmentActive: false
        },
        { 
            id: 'club-music', 
            name: 'Music Club', 
            category: 'Cultural', 
            subdomain: 'music', 
            facultyCoordinatorId: 'demo-dean-001', 
            status: 'Active', 
            themeColor: '#9333ea', 
            leadership: { 'President': 'Ananya Rai' },
            tagline: 'Melody in Motion.',
            description: 'Home of the MITS band.'
        }
    ],
    events: [
        { 
            id: 'event-001', 
            clubId: 'club-csit', 
            title: 'CodeQuest 2026', 
            description: 'National level coding competition.', 
            type: 'Free', 
            status: 'Approved', 
            date: '2026-05-15T10:00:00Z', 
            bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' 
        },
        { 
            id: 'event-002', 
            clubId: 'club-robotics', 
            title: 'RoboWars v6', 
            description: 'Battle of the bots.', 
            type: 'Paid', 
            fee: 200, 
            status: 'Approved', 
            date: '2026-06-20T09:00:00Z', 
            bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e' 
        },
        { 
            id: 'event-003', 
            clubId: 'club-csit', 
            title: 'React Workshop', 
            description: 'Hands-on frontend development.', 
            type: 'Free', 
            status: 'Pending', 
            date: '2026-04-30T14:00:00Z' 
        }
    ],
    registrations: [
        { 
            id: 'reg-001', 
            eventId: 'event-001', 
            studentId: 'demo-student-001', 
            studentName: 'Aryan Sharma', 
            studentRoll: '0901CS211001', 
            status: 'Approved', 
            paymentType: 'Free', 
            attendanceMarked: true, 
            certificateId: 'cert-001',
            ticketId: 'TKT-CQ26-001'
        },
        { 
            id: 'reg-002', 
            eventId: 'event-001', 
            studentId: 'demo-student-example', 
            studentName: 'Demo Student', 
            studentRoll: 'DEMO-STU-001', 
            status: 'Approved', 
            paymentType: 'Free', 
            attendanceMarked: true,
            ticketId: 'TKT-CQ26-002'
        },
        {
            id: 'reg-003',
            eventId: 'event-002',
            studentId: 'demo-student-001',
            studentName: 'Aryan Sharma',
            studentRoll: '0901CS211001',
            status: 'Pending',
            paymentType: 'UPI',
            transactionId: 'TXN987654321'
        }
    ],
    applicants: [
        { 
            id: 'app-001', 
            name: 'Aryan Sharma', 
            rollNumber: '0901CS211001', 
            branch: 'CSIT', 
            domain: 'Development', 
            stage: 'Selected', 
            whyJoin: 'Passionate about coding.', 
            clubId: 'club-csit', 
            email: 'aryan@mitsgwl.ac.in' 
        },
        { 
            id: 'app-002', 
            name: 'Demo Student', 
            rollNumber: 'DEMO-STU-001', 
            branch: 'CSIT', 
            domain: 'Design', 
            stage: 'Interview', 
            whyJoin: 'I love UI/UX.', 
            clubId: 'club-csit', 
            email: 'demo-student@example.com' 
        }
    ],
    logs: [
        { id: 'log-001', timestamp: new Date().toISOString(), user: 'Dr. Priya Verma', action: 'Approved event CodeQuest 2026', clubId: 'club-csit' },
        { id: 'log-002', timestamp: new Date().toISOString(), user: 'Admin (Demo)', action: 'Initialized institutional governance', clubId: 'Global' }
    ],
    batches: [
        {
            id: 'batch-001', 
            clubId: 'club-csit', 
            eventId: 'event-001', 
            status: 'Approved', 
            createdBy: 'Aryan Sharma', 
            createdAt: new Date().toISOString(),
            certificates: [
                { 
                    serialNumber: 'MITS-CSI-2026-00001', 
                    studentId: 'demo-student-001', 
                    studentName: 'Aryan Sharma', 
                    enrollmentNumber: '0901CS211001', 
                    eventName: 'CodeQuest 2026', 
                    clubId: 'club-csit', 
                    clubName: 'CSIT Club', 
                    date: '2026-05-15', 
                    hash: 'abc123hash-valid-cert', 
                    batchId: 'batch-001' 
                }
            ],
            approvalChain: [
                { role: 'Faculty', approverName: 'Dr. Priya Verma', status: 'Approved', approvedAt: new Date().toISOString() },
                { role: 'Dean', approverName: 'Dr. Manish Dixit', status: 'Approved', approvedAt: new Date().toISOString() }
            ]
        },
        {
            id: 'batch-002',
            clubId: 'club-robotics',
            eventId: 'event-002',
            status: 'PendingFaculty',
            createdBy: 'Vikram Singh',
            createdAt: new Date().toISOString(),
            certificates: [],
            approvalChain: [
                { role: 'Faculty', approverName: 'Dr. Priya Verma', status: 'Pending' }
            ]
        }
    ]
};

async function seed() {
    try {
        console.log('Seeding enriched demo data for all users...');
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
