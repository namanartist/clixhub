
-- =================================================================
-- MITS CLUB MANAGEMENT SYSTEM (CCMS) - SUPABASE SCHEMA V3
-- =================================================================

-- 1. CLEANUP
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.batches CASCADE;
DROP TABLE IF EXISTS public.logs CASCADE;
DROP TABLE IF EXISTS public.applicants CASCADE;
DROP TABLE IF EXISTS public.registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.clubs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. TABLES

-- USERS
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "globalRole" TEXT DEFAULT 'Student',
    "photoUrl" TEXT,
    "signatureUrl" TEXT,
    linkedin TEXT,
    github TEXT,
    "phoneNumber" TEXT,
    "enrollmentNumber" TEXT,
    address TEXT,
    branch TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "profileLocked" BOOLEAN DEFAULT false,
    skills TEXT[] DEFAULT '{}',
    "clubMemberships" JSONB DEFAULT '[]'::jsonb,
    "lastSeen" TEXT,
    "isOnline" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CLUBS
CREATE TABLE public.clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    "themeColor" TEXT DEFAULT '#2563eb',
    subdomain TEXT,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    tagline TEXT,
    description TEXT,
    "facultyCoordinatorId" TEXT,
    "facultyCoordinatorNames" TEXT[] DEFAULT '{}',
    leadership JSONB DEFAULT '{}'::jsonb,
    "isFrozen" BOOLEAN DEFAULT false,
    "recruitmentActive" BOOLEAN DEFAULT false,
    achievements JSONB DEFAULT '[]'::jsonb,
    "customSections" JSONB DEFAULT '[]'::jsonb,
    quotations JSONB DEFAULT '[]'::jsonb,
    "defaultUpiQrUrl" TEXT,
    "paymentGatewayConfig" JSONB DEFAULT '{"provider": "ManualUPI", "isActive": true}'::jsonb,
    "certificateConfig" JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EVENTS
CREATE TABLE public.events (
    id TEXT PRIMARY KEY,
    "clubId" TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'Free',
    fee NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    date TEXT NOT NULL,
    "upiQrUrl" TEXT,
    "bannerUrl" TEXT,
    "isFinalized" BOOLEAN DEFAULT false,
    "createdBy" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REGISTRATIONS
CREATE TABLE public.registrations (
    id TEXT PRIMARY KEY,
    "eventId" TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "studentRoll" TEXT,
    "studentBranch" TEXT,
    status TEXT DEFAULT 'Pending',
    "paymentType" TEXT DEFAULT 'Free',
    "paymentProofUrl" TEXT,
    "transactionId" TEXT,
    "ticketId" TEXT,
    "attendanceMarked" BOOLEAN DEFAULT false,
    "certificateId" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- APPLICANTS
CREATE TABLE public.applicants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "rollNumber" TEXT,
    branch TEXT,
    domain TEXT,
    stage TEXT DEFAULT 'Applied',
    "whyJoin" TEXT,
    "resumeUrl" TEXT,
    notes TEXT,
    "recruitmentCycle" TEXT,
    "clubId" TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LOGS
CREATE TABLE public.logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    timestamp TEXT NOT NULL,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    "clubId" TEXT REFERENCES public.clubs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BATCHES (Certificate Batches)
CREATE TABLE public.batches (
    id TEXT PRIMARY KEY,
    "clubId" TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    "eventId" TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    "templateId" TEXT,
    status TEXT DEFAULT 'Draft',
    "createdBy" TEXT,
    "createdAt" TEXT,
    certificates JSONB DEFAULT '[]'::jsonb,
    "approvalChain" JSONB DEFAULT '[]'::jsonb,
    created_at_db TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACTIVITIES
CREATE TABLE public.activities (
    id TEXT PRIMARY KEY,
    "clubId" TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date TEXT NOT NULL,
    location TEXT,
    outcome TEXT,
    "mediaUrls" TEXT[] DEFAULT '{}',
    "participantsCount" INTEGER DEFAULT 0,
    "isPublic" BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS (Disable for MVP Seeding, can be enabled later)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.applicants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.activities FOR ALL USING (true) WITH CHECK (true);
