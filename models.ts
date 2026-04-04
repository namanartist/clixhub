import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    globalRole: { type: String, enum: ['Student', 'Faculty Coordinator', 'Super Admin'], default: 'Student' },
    clubMemberships: [{
        clubId: String,
        role: String
    }],
    photoUrl: String,
    signatureUrl: String,
    linkedin: String,
    github: String,
    phoneNumber: String,
    enrollmentNumber: String,
    address: String,
    branch: String,
    fatherName: String,
    motherName: String,
    profileLocked: { type: Boolean, default: false },
    skills: [String],
    lastSeen: String,
    isOnline: { type: Boolean, default: false }
}, { timestamps: true });

const ClubSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['Technical', 'Cultural', 'Social', 'Sports'], required: true },
    themeColor: { type: String, default: '#2563eb' },
    subdomain: String,
    logoUrl: String,
    facultyCoordinatorId: String,
    facultyCoordinatorNames: [String],
    leadership: { type: Map, of: String, default: {} },
    isFrozen: { type: Boolean, default: false },
    recruitmentActive: { type: Boolean, default: false },
    tagline: String,
    bannerUrl: String,
    description: String,
    achievements: [{
        id: String,
        title: String,
        description: String,
        date: String,
        link: String
    }],
    customSections: [{
        id: String,
        title: String,
        content: String,
        iconName: String
    }],
    defaultUpiQrUrl: String,
    quotations: [{
        id: String,
        title: String,
        vendorName: String,
        amount: Number,
        description: String,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        date: String,
        fileUrl: String
    }],
    paymentGatewayConfig: {
        provider: String,
        apiKey: String,
        secretKey: String,
        merchantId: String,
        isActive: { type: Boolean, default: false }
    },
    certificateConfig: {
        templateId: String,
        customBackgroundUrl: String,
        showMITSLogo: { type: Boolean, default: true },
        showClubLogo: { type: Boolean, default: true },
        signatureTextFaculty: String,
        signatureTextPresident: String
    }
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clubId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Free', 'Paid'], required: true },
    fee: Number,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    date: { type: String, required: true },
    upiQrUrl: String,
    bannerUrl: String,
    isFinalized: { type: Boolean, default: false },
    createdBy: String
}, { timestamps: true });

const RegistrationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    studentRoll: { type: String, required: true },
    studentBranch: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    paymentType: { type: String, enum: ['Free', 'UPI', 'Gateway'], default: 'Free' },
    paymentProofUrl: String,
    transactionId: String,
    ticketId: String,
    attendanceMarked: { type: Boolean, default: false },
    certificateId: String
}, { timestamps: true });

const ApplicantSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    branch: { type: String, required: true },
    domain: { type: String, required: true },
    stage: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Selected', 'Rejected'], default: 'Applied' },
    whyJoin: { type: String, required: true },
    resumeUrl: String,
    notes: String,
    recruitmentCycle: String
}, { timestamps: true });

const AuditLogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    user: { type: String, required: true },
    action: { type: String, required: true },
    clubId: String
});

const ActivitySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clubId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    location: String,
    outcome: String,
    mediaUrls: [String],
    participantsCount: Number,
    isPublic: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Club = mongoose.model('Club', ClubSchema);
export const Event = mongoose.model('Event', EventSchema);
export const Registration = mongoose.model('Registration', RegistrationSchema);
export const Applicant = mongoose.model('Applicant', ApplicantSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export const Activity = mongoose.model('Activity', ActivitySchema);
