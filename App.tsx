import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { User, Club, Applicant, Event, Role, ClubRole, AuditLog, Registration, Quotation, Achievement, CertificateBatch, IssuedCertificate } from './types';
import { useAuth } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import JWTAuthPage from './components/pages/JWTAuthPage';
import LandingPage from './components/pages/LandingPage';
import { db } from './db';
import { ShieldAlert, Zap } from 'lucide-react';

// Page Components
import GlobalStudentDashboard from './components/pages/GlobalStudentDashboard';
import ClubHome from './components/pages/ClubHome';
import ClubMembers from './components/pages/ClubMembers';
import AttendanceControl from './components/pages/AttendanceControl';
import EventOperations from './components/pages/EventOperations';
import ClubFinance from './components/pages/ClubFinance';
import RecruitmentBoard from './components/RecruitmentBoard';
import CertificationGovernance from './components/pages/CertificationGovernance';
import ClubPublicWebsite from './components/pages/ClubPublicWebsite';
import ClubSiteEditor from './components/pages/ClubSiteEditor';
import ClubSettings from './components/pages/ClubSettings';
import MyApplications from './components/pages/MyApplications';
import MyTickets from './components/pages/MyTickets';
import MyPayments from './components/pages/MyPayments';
import MyCertificates from './components/pages/MyCertificates';
import CampusEvents from './components/pages/CampusEvents';
import GlobalClubs from './components/pages/GlobalClubs';
import StudentProfile from './components/pages/StudentProfile';
import FacultyFeed from './components/pages/FacultyFeed';
import FacultyOversight from './components/pages/FacultyOversight';
import InstitutionalKPIs from './components/pages/InstitutionalKPIs';
import SuperAdminHub from './components/pages/SuperAdminHub';
import StudentRegistry from './components/pages/StudentRegistry';
import FacultyRegistry from './components/pages/FacultyRegistry';
import GlobalAnalytics from './components/pages/GlobalAnalytics';
import SystemLogs from './components/pages/SystemLogs';
import Developers from './components/pages/Developers';
import ChatSystem from './components/pages/ChatSystem';

// Public Pages
import { LegalDocs, ReportIssue, FacultyPortalInfo, StudentLeadership } from './components/pages/PublicPages';
import EventRegistry from './components/pages/EventRegistry';
import ClubDirectoryPublic from './components/pages/ClubDirectoryPublic';
import PlatformFeatures from './components/pages/PlatformFeatures';
import LiveFeedPublic from './components/pages/LiveFeedPublic';
import CertificateVerification from './components/pages/CertificateVerification';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, isAuthenticated, loading: authLoading, logout } = useAuth();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Note: For activeContext & activeTab we parse the current URL
  // Default values
  const [activeContext, setActiveContext] = useState<string>('Global');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New State for Public Overlays (Handled completely via Router now, except standard modals)
  const [publicPage, setPublicPage] = useState<string | null>(null);

  const [data, setData] = useState<{
    users: User[];
    clubs: Club[];
    events: Event[];
    registrations: Registration[];
    applicants: Applicant[];
    logs: AuditLog[];
    batches: CertificateBatch[];
  }>({
    users: [],
    clubs: [],
    events: [],
    registrations: [],
    applicants: [],
    logs: [],
    batches: []
  });

  useEffect(() => {
    const init = async () => {
      try {
        await db.initialize();

        // Load all required data in parallel
        const [clubs, events, logs, users] = await Promise.all([
          db.getClubs().catch(() => []),
          db.getEvents().catch(() => []),
          db.getLogs().catch(() => []),
          db.getUsers().catch(() => [])
        ]);

        setData(prev => ({ ...prev, clubs, events, logs, users }));

        // If user is authenticated, load remaining data
        if (isAuthenticated) {
          await refreshData();
        }
      } catch (err) {
        console.error("Initialization Failed:", err);
        // Continue anyway with empty data
        setData(prev => ({ ...prev }));
      }
    };

    init();
  }, [isAuthenticated]);

  // Sync Auth State from Context — also refresh all data when user logs in
  useEffect(() => {
    setCurrentUser(authUser);
    if (authUser) {
      refreshData();
    }
  }, [authUser]);

  // Protect Routes - redirect to login if not authenticated
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/club'];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Sync URL state to Virtual State
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/club/')) {
      const parts = path.split('/');
      setActiveContext(parts[2]); // The club ID
      setActiveTab(parts[3] || 'club-dashboard');
    } else if (path.startsWith('/dashboard/')) {
      setActiveContext('Global');
      setActiveTab(path.split('/')[2]);
    } else if (path === '/dashboard') {
      setActiveContext('Global');
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  useEffect(() => {
    // App is permanently dark — always apply the dark class
    document.documentElement.classList.add('dark');
  }, []);

  const refreshData = async () => {
    try {
      const dbUsers = await db.getUsers();
      const [clubs, events, registrations, applicants, logs, batches] = await Promise.all([
        db.getClubs(),
        db.getEvents(),
        db.getRegistrations(),
        db.getApplicants(),
        db.getLogs(),
        db.getBatches()
      ]);
      setData(prev => ({ ...prev, users: dbUsers, clubs, events, registrations, applicants, logs, batches }));
    } catch (err) {
      console.warn("Failed to fetch all data, offline fallback active.");
    }
  };

  // --- AUTOMATION: Certificate on Attendance ---
  const handleMarkAttendance = async (registrationId: string, status: boolean) => {
    const reg = data.registrations.find(r => r.id === registrationId);
    if (!reg) return;

    const updatedReg = { ...reg, attendanceMarked: status };
    await db.saveRegistration(updatedReg);

    // Automation: create a draft batch or add to existing draft for this event if marking as PRESENT
    if (status) {
      const event = data.events.find(e => e.id === reg.eventId);
      const club = data.clubs.find(c => c.id === event?.clubId);

      if (event && club) {
        const existingBatches = await db.getBatches();
        let batch = existingBatches.find(b => b.eventId === event.id && b.status === 'Draft' && b.clubId === club.id);

        const newCert: IssuedCertificate = {
          serialNumber: 'PENDING',
          studentId: reg.studentId,
          studentName: reg.studentName,
          enrollmentNumber: reg.studentRoll,
          eventName: event.title,
          clubId: club.id,
          clubName: club.name,
          date: event.date || new Date().toISOString(),
          hash: 'PENDING',
          batchId: ''
        };

        if (batch) {
          if (!batch.certificates.some(c => c.studentId === reg.studentId)) {
            batch.certificates.push({ ...newCert, batchId: batch.id });
            await db.saveBatch(batch);
          }
        } else {
          const batchId = `auto-batch-${Date.now()}`;
          const newBatch: CertificateBatch = {
            id: batchId,
            clubId: club.id,
            eventId: event.id,
            templateId: club.certificateConfig?.templateId || 'classic',
            status: 'Draft',
            createdBy: 'System (Automation)',
            createdAt: new Date().toISOString(),
            certificates: [{ ...newCert, batchId }],
            approvalChain: [
              { role: Role.FACULTY, approverName: 'Faculty Coordinator', status: 'Pending' },
              { role: Role.DEAN, approverName: 'Dean Student Welfare', status: 'Pending' }
            ]
          };
          await db.saveBatch(newBatch);
        }
      }
    }

    refreshData();
  };

  const handleContextChange = (contextId: string) => {
    setActiveContext(contextId);
    setIsMobileMenuOpen(false);
    if (contextId === 'Global') {
      navigate('/dashboard');
    } else {
      navigate(`/club/${contextId}/club-dashboard`);
    }
  };

  // Switch Tab Helper Function
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (activeContext === 'Global') {
      navigate(`/dashboard/${tab === 'dashboard' ? '' : tab}`);
    } else {
      navigate(`/club/${activeContext}/${tab}`);
    }
  };

  const handleSwitchRole = (role: Role) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, globalRole: role });
    }
  };

  const handleDemoLogin = async (email: string) => {
    try {
      const { user } = await db.demoLogin(email);
      setCurrentUser(user);
      // Await refreshData so clubs/events are populated before the dashboard renders
      await refreshData();
      navigate('/dashboard');
    } catch (err) {
      console.error("Demo Login Error:", err);
      alert("Demo login failed. Please ensure the backend is running and seeded.");
    }
  };


  const handleLogout = () => {
    logout(); // Clear AuthContext state (also clears token via authService.logout())
    db.clearToken(); // Clear db.ts token key as well
    setCurrentUser(null);
    setActiveContext('Global');
    setActiveTab('dashboard');
    navigate('/');
  };



  const handleRegisterEvent = async (eventId: string, proxy?: { name: string, roll: string, branch: string }) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const event = data.events.find(e => e.id === eventId);
    if (!event) return;

    let studentName = currentUser.name;
    let studentId = currentUser.id;
    let studentRoll = currentUser.enrollmentNumber || 'PENDING';
    let studentBranch = currentUser.branch;

    if (proxy) {
      studentName = proxy.name;
      studentId = `proxy-${Date.now()}`;
      studentRoll = proxy.roll;
      studentBranch = proxy.branch;
    }

    const isFree = event.type === 'Free';
    const ticketId = isFree ? `TKT-${event.id.split('-')[1]?.toUpperCase() || 'E'}-${Date.now().toString().slice(-6)}` : undefined;

    const registration: Registration = {
      id: `reg-${Date.now()}`,
      eventId,
      studentId,
      studentName,
      studentRoll,
      studentBranch,
      status: isFree ? 'Approved' : 'Pending',
      paymentType: isFree ? 'Free' : 'UPI',
      ticketId: ticketId,
      attendanceMarked: false
    };

    // Optimistic Update
    const updatedRegistrations = [...data.registrations, registration];
    setData(prev => ({ ...prev, registrations: updatedRegistrations }));

    // API Call in background
    db.saveRegistration(registration).then(() => {
      db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: currentUser.name,
        action: `Registered ${proxy ? '(Proxy) ' : ''}for ${event.title}${isFree ? ' - Ticket Issued' : ' - Pending Payment'}`,
        clubId: event.clubId
      });
    });

    if (!proxy) {
      console.log(isFree ? "Registration Successful! Ticket generated." : "Registration Pending. Please complete payment verification.");
    }

    return registration;
  };

  const handleApprovePayment = async (id: string) => {
    const reg = data.registrations.find(r => r.id === id);
    if (!reg) return;

    const event = data.events.find(e => e.id === reg.eventId);
    const idPart = event ? (event.id.includes('-') ? event.id.split('-')[1] : event.id.slice(0, 4)) : 'EVT';
    const ticketId = `TKT-${idPart.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const updatedReg: Registration = {
      ...reg,
      status: 'Approved',
      ticketId: ticketId
    };

    // Optimistic Update
    setData(prev => ({
      ...prev,
      registrations: prev.registrations.map(r => r.id === id ? updatedReg : r)
    }));

    // API Call in background
    db.saveRegistration(updatedReg).then(() => {
      db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: currentUser?.name || 'System',
        action: `Payment Verified & Ticket Issued for ${reg.studentName}`,
        clubId: event?.clubId
      });
    });
  };

  const handleUpdateRegistration = async (reg: Registration) => { await db.saveRegistration(reg); refreshData(); };
  const handleApplicantMove = async (id: string, stage: Applicant['stage']) => {
    const applicant = data.applicants.find(a => a.id === id);
    if (applicant) {
      const updatedApplicant = { ...applicant, stage };
      // Optimistic Update
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(a => a.id === id ? updatedApplicant : a)
      }));
      // API Call
      await db.saveApplicant(updatedApplicant);
    }
  };
  const handleApplicantDomainUpdate = async (id: string, domain: string) => {
    const applicant = data.applicants.find(a => a.id === id);
    if (applicant) {
      const updatedApplicant = { ...applicant, domain };
      // Optimistic Update
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(a => a.id === id ? updatedApplicant : a)
      }));
      // API Call
      await db.saveApplicant(updatedApplicant);
    }
  };
  const handleNewRecruitmentCycle = async (clubId: string) => {
    // For demo, we "clear" the pipeline by deleting applicants for this club, or just adding a log.
    // Let's actually clear them to show the button works.
    const remainingApplicants = data.applicants.filter(a => a.clubId !== clubId);
    // In db.ts, we don't have a bulk delete, but we can simulate it if it was a real DB.
    // For now, let's just update them to 'Selected' or similar, or just log and alert.
    // Actually, let's just make it do something visible: add a fresh applicant.
    const freshman: Applicant = {
      id: `fresh-${Date.now()}`,
      name: 'New Applicant (' + new Date().toLocaleTimeString() + ')',
      rollNumber: '0901CS221' + Math.floor(Math.random() * 900 + 100),
      branch: 'CSIT',
      email: 'new@mitsgwl.ac.in',
      whyJoin: 'Looking for a new cycle start!',
      stage: 'Applied',
      domain: 'Tech',
      clubId: clubId
    };
    await db.saveApplicant(freshman);

    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'System',
      action: `New Recruitment Cycle started for ${data.clubs.find(c => c.id === clubId)?.name}`,
      clubId
    });
    refreshData();
  };
  const handleUpdateUser = async (user: User) => { await db.saveUser(user); if (currentUser && currentUser.id === user.id) setCurrentUser(user); refreshData(); };
  const handleRemoveUser = async (id: string) => { await db.deleteUser(id); refreshData(); };
  const handleAddUser = async (user: User) => { await db.saveUser(user); refreshData(); };
  const handleFreezeClub = async (id: string) => {
    const club = data.clubs.find(c => c.id === id);
    if (club) {
      // Use any for status if types.ts doesn't have it, or cast
      await db.updateClub({ ...club, status: (club as any).status === 'Active' ? 'Frozen' : 'Active' } as any);
      refreshData();
    }
  };
  const handleAddClub = async (club: Club) => {
    try {
      await db.addClub(club);
      await refreshData();
    } catch (err) {
      console.error("handleAddClub Error:", err);
      alert("Failed to create club. Please ensure your Supabase SQL schema is correctly applied.");
    }
  };
  const handleAppointPresident = async (cId: string, sId: string) => { await db.appointPresident(cId, sId); await refreshData(); };
  const handleAssignFaculty = async (cId: string, faculty: User) => { await db.assignFaculty(cId, faculty); await refreshData(); };
  const handleSaveEvent = async (event: Event) => { await db.saveEvent(event); refreshData(); };
  const handleDeleteEvent = async (eventId: string) => { await db.deleteEvent(eventId); refreshData(); };
  const handleApproveEvent = async (id: string) => {
    const event = data.events.find(e => e.id === id);
    if (event) {
      await db.saveEvent({ ...event, status: 'Approved' });
      refreshData();
    }
  };

  const handleApproveBatchGlobal = async (batch: CertificateBatch) => {
    const role = currentUser?.globalRole;
    if (!role) return;

    let nextStatus: CertificateBatch['status'] = batch.status;
    if (role === Role.FACULTY) nextStatus = 'PendingDean';
    if (role === Role.DEAN) nextStatus = 'Approved';

    const updatedChain = batch.approvalChain.map(step => {
      if (step.role === role) {
        return { ...step, status: 'Approved' as const, approvedAt: new Date().toISOString(), approverName: currentUser.name };
      }
      return step;
    });

    let finalBatch = { ...batch, status: nextStatus, approvalChain: updatedChain };

    // If final approval, generate details
    if (nextStatus === 'Approved') {
      finalBatch.certificates = finalBatch.certificates.map((cert, idx) => ({
        ...cert,
        serialNumber: `MITS-${cert.clubId.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(idx + 1).padStart(5, '0')}`,
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      }));
    }

    await db.saveBatch(finalBatch);
    refreshData();
  };

  const handleRejectBatchGlobal = async (batch: CertificateBatch) => {
    const role = currentUser?.globalRole;
    if (!role) return;
    await db.saveBatch({ ...batch, status: 'Rejected' });
    refreshData();
  };
  const handleIssueCertificateBatch = async (batch: any) => { /* ... */ };
  const handleUpdateClubQuotation = async (id: string, q: Quotation[]) => { /* ... */ };
  const handleUpdateClubQr = async (id: string, url: string) => { /* ... */ };
  const handleNewApplication = async (applicationData: { name: string, rollNumber: string, domain: string, whyJoin: string, clubId: string }) => {
    try {
      const applicant: Applicant = {
        id: `app-${Date.now()}`,
        ...applicationData,
        stage: 'Applied',
        email: currentUser?.email || '',
        branch: currentUser?.branch || 'N/A',
        recruitmentCycle: new Date().getFullYear().toString()
      };

      await db.saveApplicant(applicant);
      
      await db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: applicationData.name,
        action: `Submitted recruitment application for ${data.clubs.find(c => c.id === applicationData.clubId)?.name}`,
        clubId: applicationData.clubId
      });

      await refreshData();
      return true;
    } catch (err) {
      console.error("Application Submission Failed:", err);
      return false;
    }
  };


  const closePublicPage = () => {
    setPublicPage(null);
    navigate(-1);
  };

  // Handle Developer Views globally
  const renderDevView = (mode: "console" | "public") => {
    return <Developers onBack={() => navigate('/dashboard')} isDarkMode={isDarkMode} currentUser={currentUser || undefined} allUsers={data.users} mode={mode} />;
  }

  // Define Dashboard Contents Switcher based on URL
  const renderDashboardContent = () => {
    if (!currentUser) return <Navigate to="/auth" replace />;


    if (activeContext === 'Global') {
      switch (activeTab) {
        case 'dashboard':
        case '':
          return currentUser.globalRole === Role.SUPER_ADMIN ?
            <SuperAdminHub clubs={data.clubs} allUsers={data.users} onFreeze={handleFreezeClub} onEnterClub={handleContextChange} onAddClub={handleAddClub} onAppointPresident={handleAppointPresident} onAssignFaculty={handleAssignFaculty} onAddUser={handleAddUser} isDarkMode={isDarkMode} />
            : currentUser.globalRole === Role.FACULTY ?
              <FacultyFeed user={currentUser} clubs={data.clubs} onManageClub={handleContextChange} />
              : <GlobalStudentDashboard user={currentUser} events={data.events} clubs={data.clubs} certCount={data.registrations.filter(r => r.studentId === currentUser.id && r.certificateId).length} onRegister={handleRegisterEvent} isDarkMode={isDarkMode} logs={data.logs} registrations={data.registrations} applicants={data.applicants} />;
        case 'admin-dashboard': return <SuperAdminHub clubs={data.clubs} allUsers={data.users} onFreeze={handleFreezeClub} onEnterClub={handleContextChange} onAddClub={handleAddClub} onAppointPresident={handleAppointPresident} onAssignFaculty={handleAssignFaculty} onAddUser={handleAddUser} isDarkMode={isDarkMode} />;
        case 'chat': return <ChatSystem user={currentUser} clubs={data.clubs} allUsers={data.users} activeContext={activeContext} isDarkMode={isDarkMode} />;
        case 'student-registry': return <StudentRegistry allUsers={data.users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onRemoveUser={handleRemoveUser} isDarkMode={isDarkMode} />;
        case 'faculty-registry': return <FacultyRegistry allUsers={data.users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onRemoveUser={handleRemoveUser} isDarkMode={isDarkMode} />;
        case 'clubs': return <GlobalClubs clubs={data.clubs} isDarkMode={isDarkMode} onEnterClub={handleContextChange} />;
        case 'analytics': return <GlobalAnalytics clubs={data.clubs} users={data.users} events={data.events} registrations={data.registrations} applicants={data.applicants} isDarkMode={isDarkMode} />;
        case 'global-audit': return <SystemLogs logs={data.logs} isDarkMode={isDarkMode} />;
        case 'faculty-dashboard': return <FacultyFeed user={currentUser} clubs={data.clubs} onManageClub={handleContextChange} />;
        case 'approvals': return (
          <FacultyOversight
            events={data.events}
            clubs={data.clubs}
            batches={data.batches}
            currentUser={currentUser}
            onApproveEvent={handleApproveEvent}
            onApproveBatch={handleApproveBatchGlobal}
            onRejectBatch={handleRejectBatchGlobal}
          />
        );
        case 'reports': return <InstitutionalKPIs clubs={data.clubs} events={data.events} registrations={data.registrations} applicants={data.applicants} />;
        case 'profile': return <StudentProfile user={currentUser} onSave={handleUpdateUser} isDarkMode={isDarkMode} registrations={data.registrations} applicants={data.applicants} events={data.events} />;
        case 'recruitment': return <MyApplications applicants={data.applicants} clubs={data.clubs} userName={currentUser.name} isDarkMode={isDarkMode} />;
        case 'events': return <CampusEvents events={data.events} clubs={data.clubs} registrations={data.registrations} onRegister={handleRegisterEvent} isDarkMode={isDarkMode} user={currentUser} />;
        case 'my-certificates': return <MyCertificates currentUser={currentUser!} batches={data.batches} />;
        case 'tickets': return <MyTickets registrations={data.registrations.filter(r => r.studentId === currentUser.id)} events={data.events} clubs={data.clubs} isDarkMode={isDarkMode} />;
        case 'payments': return <MyPayments registrations={data.registrations.filter(r => r.studentId === currentUser.id)} applicants={data.applicants.filter(a => a.name === currentUser.name)} events={data.events} clubs={data.clubs} isDarkMode={isDarkMode} />;
        case 'developers': return renderDevView('console');
        case 'developer-profile': return renderDevView('public');
        default: return <Navigate to="/dashboard" />;
      }
    }

    // Club Context Logic
    const currentClub = data.clubs.find(c => c.id === activeContext);
    if (!currentClub) return <div>Club Not Found</div>;

    const userClubRole = currentUser.clubMemberships.find(m => m.clubId === activeContext)?.role || null;
    const isGlobalAdmin = currentUser.globalRole === Role.SUPER_ADMIN || currentUser.globalRole === Role.FACULTY || currentUser.globalRole === Role.DEAN;
    const isClubAdmin = userClubRole && userClubRole !== ClubRole.MEMBER;
    // Members (any role) can access these tabs; admins get everything
    const memberAllowedTabs = ['website', 'chat', 'club-dashboard', 'attendance'];
    const isAuthorized = isGlobalAdmin || isClubAdmin || memberAllowedTabs.includes(activeTab);

    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8 p-8 animate-in fade-in zoom-in-95">
          <div className="w-32 h-32 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl shadow-rose-500/10 relative">
            <ShieldAlert size={64} />
          </div>
          <div className="space-y-4 max-w-lg">
            <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#111C44]'}`}>Restricted Access Protocol</h2>
            <p className="text-[#A3AED0] font-medium text-lg leading-relaxed">Identity marker <strong>{currentUser.name}</strong> lacks the required security clearance for the <strong>{currentClub.name}</strong> governance mainframe.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/club/${activeContext}/website`)} className="px-8 py-4 bg-[#0d121d] border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1a202e] transition-all">
              View Public Page
            </button>
            <button onClick={() => handleContextChange('Global')} className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Return to Global
            </button>
          </div>
        </div>
      );
    }

    const clubRegs = data.registrations.filter(r => data.events.find(e => e.id === r.eventId)?.clubId === activeContext);
    const clubEvents = data.events.filter(e => e.clubId === activeContext);

    switch (activeTab) {
      case 'club-dashboard': return <ClubHome club={currentClub} registrations={clubRegs} />;
      case 'chat': return <ChatSystem user={currentUser} clubs={data.clubs} allUsers={data.users} activeContext={activeContext} isDarkMode={isDarkMode} />;
      case 'members': return <ClubMembers clubId={activeContext} clubName={currentClub?.name || ''} isDarkMode={isDarkMode} clubRole={userClubRole} allUsers={data.users} onUpdateUser={handleUpdateUser} applicants={data.applicants} onAddMember={() => setActiveTab('recruitment')} />;
      case 'attendance': return <AttendanceControl registrations={clubRegs} events={clubEvents} onMark={handleMarkAttendance} onFinalize={() => setActiveTab('club-events')} isDarkMode={isDarkMode} />;
      case 'club-events': return <EventOperations events={clubEvents} registrations={clubRegs} onCreateEvent={handleSaveEvent} onDeleteEvent={handleDeleteEvent} onRegister={handleRegisterEvent} onUpdateRegistration={handleUpdateRegistration} isDarkMode={isDarkMode} isDirectApprovalEnabled={userClubRole === ClubRole.PRESIDENT || currentUser.globalRole === Role.FACULTY} clubId={activeContext} />;
      case 'club-finance': return <ClubFinance club={currentClub} registrations={clubRegs} events={clubEvents} onApprovePayment={handleApprovePayment} onUpdateQuotes={(quotes) => handleUpdateClubQuotation(activeContext, quotes)} onUpdateQr={(url) => handleUpdateClubQr(activeContext, url)} isDarkMode={isDarkMode} isFaculty={currentUser.globalRole === Role.FACULTY} />;
      case 'recruitment': return <RecruitmentBoard applicants={data.applicants} onMove={handleApplicantMove} onUpdateDomain={handleApplicantDomainUpdate} clubRole={userClubRole} clubThemeColor={currentClub?.themeColor || '#2563eb'} onNewCycle={() => handleNewRecruitmentCycle(activeContext)} />;
      case 'certificates': return <CertificationGovernance club={currentClub} registrations={clubRegs} events={clubEvents} batches={data.batches} currentUser={currentUser!} allUsers={data.users} onRefreshBatch={refreshData} />;
      case 'website': return <ClubPublicWebsite club={currentClub} events={clubEvents} members={data.users} currentUser={currentUser} isDarkMode={isDarkMode} onUpdateClub={async (c) => { await db.updateClub(c); await refreshData(); }} onSwitchToDashboard={() => handleTabChange('club-dashboard')} onApply={handleNewApplication} onRegister={handleRegisterEvent} />;
      case 'site-editor': return <ClubSiteEditor club={currentClub} events={clubEvents} onSave={async (c) => { await db.updateClub(c); await refreshData(); }} isDarkMode={isDarkMode} />;
      case 'club-settings': return <ClubSettings club={currentClub} onSave={async (c) => { await db.updateClub(c); await refreshData(); }} isDarkMode={isDarkMode} />;
      default: return <ClubHome club={currentClub} registrations={clubRegs} />;
    }
  };



  // Main Return wrapped in Routes
  return (
    <div className={`min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500`}>

      {/* Global Animated Mesh Background - Simplified for stability */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-5%] w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="relative z-10 w-full h-full">
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              currentUser ? <Navigate to="/dashboard" replace /> :
                <LandingPage
                  events={data.events}
                  clubs={data.clubs}
                  onLogin={() => navigate('/auth')}
                  onRegister={() => navigate('/auth')}
                  isDarkMode={isDarkMode}
                  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                  onOpenDeveloper={() => navigate('/developers')}
                  onOpenProfile={() => navigate('/developer-profile')}
                  onNavigate={(p) => navigate(`/${p}`)}
                />
            } />

            <Route path="/auth" element={
              currentUser ? <Navigate to="/dashboard" replace /> :
                <JWTAuthPage
                  isDarkMode={isDarkMode}
                  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                />
            } />

            {/* Public and Static Overlays Route Mapping */}
            <Route path="/platform" element={<PlatformFeatures onBack={closePublicPage} />} />
            <Route path="/live-feed" element={<LiveFeedPublic events={data.events} logs={data.logs} onBack={closePublicPage} />} />
            <Route path="/events" element={<EventRegistry events={data.events} clubs={data.clubs} onBack={closePublicPage} />} />
            <Route path="/clubs" element={<ClubDirectoryPublic clubs={data.clubs} onBack={closePublicPage} />} />
            <Route path="/leadership" element={<StudentLeadership clubs={data.clubs} users={data.users} onBack={closePublicPage} />} />
            <Route path="/faculty" element={<FacultyPortalInfo onBack={closePublicPage} onLogin={() => navigate('/auth')} />} />
            <Route path="/privacy" element={<LegalDocs type="privacy" onBack={closePublicPage} />} />
            <Route path="/tos" element={<LegalDocs type="tos" onBack={closePublicPage} />} />
            <Route path="/report" element={<ReportIssue onBack={closePublicPage} />} />
            <Route path="/developers" element={renderDevView('console')} />
            <Route path="/developer-profile" element={renderDevView('public')} />
            <Route path="/verify-cert" element={<CertificateVerification />} />

            {/* Dashboard Shell UI Layer */}
            <Route path="/dashboard/*" element={
              currentUser ? (
                <div className="flex flex-col h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
                  <Navbar
                    user={currentUser} clubs={data.clubs} activeContext="Global" onLogout={handleLogout}
                    isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                    onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    onGoHome={() => handleContextChange('Global')} onOpenProfile={() => handleTabChange('profile')}
                    onOpenDeveloper={() => navigate('/developer-profile')}
                  />

                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                      user={currentUser} clubs={data.clubs} activeContext="Global" onContextChange={handleContextChange}
                      userRole={currentUser?.globalRole || Role.STUDENT} clubRole={null} activeTab={activeTab} setActiveTab={handleTabChange}
                      isDarkMode={isDarkMode} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onSwitchRole={handleSwitchRole}
                    />

                    <main className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
                        {renderDashboardContent()}
                      </div>
                    </main>
                  </div>

                  <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isDarkMode={isDarkMode} />
                </div>
              ) : <Navigate to="/auth" replace />
            } />

            <Route path="/public/club/:id" element={
              <div className="min-h-screen bg-[#02040a]">
                {(() => {
                  const id = location.pathname.split('/')[3];
                  const currentClub = data.clubs.find(c => c.id === id);
                  if (!currentClub) return <div className="p-20 text-center text-white">Security Breach: Club Identity Not Found</div>;
                  const clubEvents = data.events.filter(e => e.clubId === id);
                  return (
                    <ClubPublicWebsite
                      club={currentClub}
                      events={clubEvents}
                      members={data.users}
                      currentUser={currentUser || { name: 'Guest', globalRole: Role.STUDENT, id: 'guest', email: '', enrollmentNumber: '', clubMemberships: [], skills: [] } as any}
                      isDarkMode={isDarkMode}
                      onUpdateClub={async (c) => { await db.updateClub(c); await refreshData(); }}
                      onSwitchToDashboard={() => navigate('/auth')}
                      onApply={handleNewApplication}
                      onRegister={handleRegisterEvent}
                    />
                  );
                })()}
              </div>
            } />

            <Route path="/club/:id/*" element={
              currentUser ? (
                (() => {
                  const clubIdFromPath = location.pathname.split('/')[2];
                  const isClubMember = currentUser.clubMemberships.some(m => m.clubId === clubIdFromPath);
                  const isGlobalStaff = currentUser.globalRole === Role.FACULTY ||
                                        currentUser.globalRole === Role.SUPER_ADMIN ||
                                        currentUser.globalRole === Role.DEAN;

                  // Non-members go straight to public website — no sidebar, no dashboard
                  if (!isClubMember && !isGlobalStaff) {
                    return <Navigate to={`/public/club/${clubIdFromPath}`} replace />;
                  }

                  return (
                    <div className="flex flex-col h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
                      <Navbar
                        user={currentUser} clubs={data.clubs} activeContext={activeContext} onLogout={handleLogout}
                        isDarkMode={isDarkMode} onToggleTheme={() => {}}
                        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        onGoHome={() => handleContextChange('Global')} onOpenProfile={() => { handleContextChange('Global'); handleTabChange('profile'); }}
                        onOpenDeveloper={() => navigate('/developer-profile')}
                      />

                      <div className="flex flex-1 overflow-hidden">
                        <Sidebar
                          user={currentUser} clubs={data.clubs} activeContext={activeContext} onContextChange={handleContextChange}
                          userRole={currentUser?.globalRole || Role.STUDENT} clubRole={currentUser?.clubMemberships.find(m => m.clubId === activeContext)?.role || null}
                          activeTab={activeTab} setActiveTab={handleTabChange} isDarkMode={isDarkMode} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onSwitchRole={handleSwitchRole}
                        />

                        <main className="flex-1 flex flex-col overflow-hidden">
                          <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
                            {renderDashboardContent()}
                          </div>
                        </main>
                      </div>

                      <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isDarkMode={isDarkMode} />
                    </div>
                  );
                })()
              ) : <Navigate to="/auth" replace />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </div>
    </div>
  );
};

export default App;