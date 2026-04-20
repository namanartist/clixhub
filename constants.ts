import { User, Role, ClubRole } from './types';

export const DEMO_USERS: User[] = [
    {
        id: 'demo-student-001',
        name: 'Aryan Sharma',
        email: 'aryan@mitsgwl.ac.in',
        globalRole: Role.STUDENT,
        enrollmentNumber: 'MITS2023001',
        department: 'Computer Science',
        branch: 'CSIT',
        photoUrl: '',
        clubMemberships: []
    },
    {
        id: 'demo-faculty-001',
        name: 'Dr. Priya Verma',
        email: 'priya.verma@mitsgwl.ac.in',
        globalRole: Role.FACULTY,
        department: 'Computer Science',
        designation: 'Associate Professor',
        photoUrl: '',
        clubMemberships: []
    },
    {
        id: 'demo-dean-001',
        name: 'Dr. Manish Dixit',
        email: 'dean.sw@mitsgwl.ac.in',
        globalRole: Role.DEAN,
        department: 'Student Welfare',
        designation: 'Dean of Student Welfare',
        photoUrl: '',
        clubMemberships: []
    },
    {
        id: 'demo-admin-001',
        name: 'System Admin',
        email: 'admin@mitsgwl.ac.in',
        globalRole: Role.SUPER_ADMIN,
        department: 'Administration',
        photoUrl: '',
        clubMemberships: []
    }
];
