# 🎯 Mock Data & Demo Users Guide

## Overview

Comprehensive mock data has been seeded into `db.json` with realistic demo users, clubs, events, certificates, tickets, payments, and activities for testing.

**Data Summary:**

- ✅ 25 users (students, faculty, dean, admin)
- ✅ 7 clubs (4 main + 3 additional)
- ✅ 14 events (free & paid)
- ✅ 25 event registrations
- ✅ 20 applicants (recruitment pipeline)
- ✅ 8 payment transactions
- ✅ 22 issued tickets
- ✅ 7 certificate batches (approved & pending)
- ✅ 20+ activities (workshops, competitions, meetups)

---

## 🎓 Demo Users - Quick Login

### Primary Demo Users

```
╔════════════════════════════════════════════════════════════╗
║ Role         Email                      Enrollment        ║
╠════════════════════════════════════════════════════════════╣
║ Student      aryan@mitsgwl.ac.in        0901CS211001      ║
║ Student      demo-student@example.com   DEMO-STU-001      ║
║ Faculty      priya.verma@mitsgwl.ac.in  FAC-2024-01       ║
║ Faculty      demo-faculty@example.com   DEMO-FAC-001      ║
║ Dean         dean.sw@mitsgwl.ac.in      DEAN-SW-01        ║
║ Super Admin  admin@mitsgwl.ac.in        ADMIN-ROOT        ║
║ Super Admin  demo-admin@example.com     DEMO-ADMIN-001    ║
╚════════════════════════════════════════════════════════════╝
```

### All Available Users (25 Total)

#### Demo Quick-Login Users

1. **Aryan Sharma** (demo-student-001)
   - Role: Student | Branch: CSIT | Enrollment: 0901CS211001
   - Club: President of CSIT Club, Member of Robotics Club
   - Skills: React, Node.js, MongoDB, Python
   - Certificates: 4 issued (CodeQuest, HackMITS, Cybersecurity, ML Workshop)
   - Events Registered: 6
   - Status: Active & high engagement

2. **Dr. Priya Verma** (demo-faculty-001)
   - Role: Faculty | Department: Information Technology
   - Designation: Associate Professor | Enrollment: FAC-2024-01
   - Faculty Coordinator for: Cultural Club

3. **Dr. Manish Dixit** (demo-dean-001)
   - Role: Dean of Student Welfare | Department: Student Welfare
   - Certificate Approver for multiple batches
   - Enrollment: DEAN-SW-01

4. **Admin (Demo)** (demo-admin-001)
   - Role: Super Admin | Department: Institutional Operations
   - System Administrator with full access

#### Additional Demo Examples

5. **Demo Student** (demo-student-example)
   - Quick-test student account for UI testing
   - Registered for bootcamp event

2. **Demo Faculty** (demo-faculty-example)
   - Quick-test faculty account
   - Can approve certificates and events

#### Full Student Roster (15 Students)

- **Sneha Jain** (CSIT, Vice President)
- **Rahul Mishra** (EC, President of Robotics)
- **Anjali Gupta** (CE, Secretary of Cultural)
- **Vikram Tiwari** (ME, President of Sports)
- **Pooja Choudhary** (CSIT, Tech Head, 3 certificates)
- **Amit Dubey** (EE, Tech Head of Robotics)
- **Kavya Sharma** (CSIT, President of Cultural)
- **Rohit Saxena** (CE, No club memberships)
- **Priya Singh** (EC, Management Head)
- **Nikhil Rajput** (CSIT, Member)
- **Meera Patel** (IT, Member of 2 clubs)
- **Akash Verma** (ME, Member)
- **Divya Soni** (EC, Member, 1 paid event)
- **Shreya Pandey** (CSIT, Content Head)

#### Full Faculty Roster (3 Faculty)

- **Prof. Suresh Kumar** (CSIT Coordinator)
- **Dr. Anita Patel** (Robotics Coordinator)
- **Prof. Rajesh Bharti** (Sports Coordinator)

---

## 🏢 Clubs & Organizations

### Club Structure

| Club | Category | President | Members | Events | Certificates | Recruitment |
|------|----------|-----------|---------|--------|--------------|-------------|
| **CSIT Club** | Technical | Aryan Sharma | 8 | 6 events | 4 batches | ✓ Open |
| **Robotics** | Technical | Rahul Mishra | 6 | 3 events | 2 batches | ✓ Open |
| **Cultural** | Cultural | Kavya Sharma | 5 | 3 events | 1 batch | ✗ Closed |
| **Sports** | Sports | Vikram Tiwari | 3 | 2 events | 0 batches | ✓ Open |

### Club Leadership

**CSIT Club** (Technical Excellence Council)

- President: Aryan Sharma
- Vice President: Sneha Jain
- Tech Head: Pooja Choudhary
- Content Head: Shreya Pandey
- Faculty Coordinator: Prof. Suresh Kumar (FAC-2023-01)

**Robotics Club** (Build. Automate. Innovate)

- President: Rahul Mishra
- Tech Head: Amit Dubey
- Management Head: Priya Singh
- Faculty Coordinator: Dr. Anita Patel (FAC-2023-02)

**Cultural Club** (Art. Expression. Unity)

- President: Kavya Sharma
- Secretary: Anjali Gupta
- Faculty Coordinator: Dr. Priya Verma (FAC-2024-01)

**Sports Committee** (Sweat. Compete. Win)

- President: Vikram Tiwari
- Faculty Coordinator: Prof. Rajesh Bharti (FAC-2022-03)

---

## 🎫 Events & Registrations

### Event List (14 Total)

#### CSIT Club Events (6)

1. **CodeQuest 2024** (event-001)
   - Type: Free | Status: Approved | Date: 2024-04-15
   - Registrations: 2 (Aryan, Demo)
   - Issued: 1 certificate batch

2. **HackMITS 2024** (evt-001)
   - Type: Free | Status: Approved | Date: 2024-04-20
   - Registrations: 3 (Aryan, Nikhil, Meera)
   - Issued: 1 certificate batch

3. **Web Dev Bootcamp** (evt-002)
   - Type: Paid ₹200 | Status: Approved | Date: 2024-05-10
   - Registrations: 3 (Aryan, Pooja, Shreeya)
   - Payments: 2 successful UPI/Gateway

4. **AI/ML Workshop** (evt-006)
   - Type: Paid ₹150 | Status: Approved | Date: 2024-06-01
   - Registrations: 3 | Certificates: ✓ Issued
   - Attendees: Aryan, Pooja, Nikhil

5. **Cybersecurity Workshop** (evt-007)
   - Type: Free | Status: Approved | Date: 2024-06-15
   - Registrations: 2 | Certificates: ✓ Issued

6. **Open Source Contribution Day** (evt-011)
   - Type: Free | Status: Approved | Date: 2024-05-25
   - Registrations: 2

#### Robotics Club Events (3)

1. **RoboWars 2024** (evt-003)
   - Type: Free | Status: Approved | Date: 2024-03-25
   - Registrations: 3 Certificates: Pending Dean Approval

2. **IoT Bootcamp – Smart Campus** (evt-008)
   - Type: Paid ₹300 | Status: Approved | Date: 2024-07-05
   - Registrations: 2 | Payments: 2 UPI
   - Certificates: ✓ Pending Faculty Approval

#### Cultural Club Events (3)

1. **Rangmanch – Annual Festival** (evt-004)
   - Type: Free | Status: Approved | Date: 2024-04-05
   - Registrations: 3 | Certificates: ✓ Issued

2. **Poetry Slam – Open Mic** (evt-009)
   - Type: Free | Status: Approved | Date: 2024-05-20
   - Registrations: 1 (Kavya)

3. **Photography Walk** (evt-012)
   - Type: Paid ₹100 | Status: Approved | Date: 2024-06-20
   - Registrations: 1 | Payment: ✓ UPI Success

#### Sports Events (2)

1. **Cricket Tournament** (evt-005)
   - Type: Free | Status: Approved | Date: 2024-03-30

2. **Yoga & Fitness Camp** (evt-010)
   - Type: Free | Status: Pending | Date: 2024-06-10

---

## 💰 Payments & Transactions

### Payment Data (8 Transactions)

| ID | Student | Event | Amount | Status | Method | Transaction ID |
|----|---------|-------|--------|--------|--------|-----------------|
| pay-001 | Aryan | Web Dev Bootcamp | ₹200 | ✅ Success | UPI | TXN20240310001 |
| pay-002 | Pooja | Web Dev Bootcamp | ₹200 | ✅ Success | Razorpay | RZP2024310001234 |
| pay-003 | Amit | IoT Bootcamp | ₹300 | ✅ Success | UPI | TXN20240611001 |
| pay-004 | Anjali | Photography | ₹100 | ✅ Success | UPI | TXN20240620001 |
| pay-005 | Pooja | AI/ML Workshop | ₹150 | ✅ Success | Razorpay | RZP2024601001567 |
| pay-006 | Divya | IoT Bootcamp | ₹300 | ✅ Success | UPI | TXN20240705001 |
| pay-007 | Aryan | HackMITS | ₹0 | N/A | Free | - |
| pay-008 | Demo Faculty | Web Dev | ₹200 | ✅ Success | UPI | TXN20240310999 |

**Total Revenue:** ₹1,350 collected from events

---

## 🎓 Certificates & Batches

### Certificate Batches (7 Total)

#### Approved Batches (4)

**Batch 1: CodeQuest 2024**

- Club: CSIT | Event: event-001
- Status: ✅ Approved
- Certificates: 1
- Issued to: Aryan Sharma
- Approval Chain: Dr. Priya Verma → Dr. Manish Dixit

**Batch 2: HackMITS 2024**

- Club: CSIT | Event: evt-001
- Status: ✅ Approved
- Certificates: 2
- Issued to: Aryan Sharma, Nikhil Rajput
- Serial Numbers: MITS-CSI-2024-00002 to 00003

**Batch 4: AI/ML Workshop**

- Club: CSIT | Event: evt-006
- Status: ✅ Approved
- Certificates: 3
- Issued to: Aryan, Pooja, Nikhil
- Serial Numbers: MITS-CSI-2024-00004 to 00006

**Batch 5: Cybersecurity Workshop**

- Club: CSIT | Event: evt-007
- Status: ✅ Approved
- Certificates: 2
- Issued to: Aryan, Sneha
- Serial Numbers: MITS-CSI-2024-00007 to 00008

**Batch 7: Rangmanch Festival**

- Club: Cultural | Event: evt-004
- Status: ✅ Approved
- Certificates: 2
- Issued to: Kavya Sharma, Anjali Gupta
- Serial Numbers: MITS-CUL-2024-0001 to 0002

#### Pending Batches (3)

**Batch 3: RoboWars 2024** ⏳ Pending Dean Approval

- Club: Robotics | Status: Pending Dean Signature
- Certificates: 2 (Rahul Mishra, Akash Verma)
- Faculty Approved ✅ | Dean Pending ⏳

**Batch 6: IoT Bootcamp** ⏳ Pending Faculty Approval

- Club: Robotics | Status: Pending Faculty Review
- Certificates: 2 (Amit Dubey, Divya Soni)
- Faculty Pending ⏳ | Dean Pending ⏳

---

## 🎫 Tickets (22 Issued)

Demo users have tickets for:

- **Aryan Sharma**: 6 tickets (CodeQuest, HackMITS, Web Dev, ML, Cyber, Open Source)
- **Demo Student**: 2 tickets (Web Dev, Poetry Slam)
- **Others**: 14 tickets distributed

Ticket ID Format: `TKT-EVT{ID}-{STUDENT_NAME}`
Example: `TKT-EVT001-ARYAN`, `TKT-EVT002-DEMO-STU`, `TKT-EVT006-POOJA`

---

## 👥 Recruitment Applications (20 Total)

### Application Stages Distribution

**Selected (3)** ✅

- Priya Singh (EC) - Embedded Systems for Robotics
- Deepak Verma (ME) - Mechanical Design
- Sanya Joshi (CS) - Dance
- Aditya Sharma (ME) - Football

**Offer Stage (2)** 📋

- Ritika Verma (IT) - DevOps & Cloud
- Deepak Verma (ME) - Mechanical Design

**Interview Stage (3)** 🗣️

- Manish Yadav (CS) - Machine Learning
- Karan Thakur (EE) - Drone Technology
- Jatin Patel (EC) - FPGA Development

**Screening (4)** 📝

- Swati Pathak (CE) - Content & Media
- Ritu Agrawal (IT) - UI/UX Design
- Neha Singh (CS) - Web Design
- Kunal Verma (CE) - Photography

**Applied (8)** 📤

- Ankit Sharma (CS) - Cloud & DevOps
- Arjun Reddy (ME) - Manufacturing
- Pragya Nair (CS) - Competitive Programming
- Shreya Mittal (CS) - Music & Audio
- - 4 more

---

## 🏆 Activities & Outcomes (20+ Total)

### CSIT Club Activities (4)

1. **Git & GitHub Workshop** - 45 participants → 30 made first PR
2. **CP Competition** - 60 participants → 3 winners awarded
3. **React Advanced Concepts** - 40 participants → 8 projects initiated
4. **LeetCode Contest** - 95 participants → 3 perfect scores

### Robotics Club Activities (3)

1. **Arduino Basics** - 25 participants → All built LED circuit
2. **PCB Design** - 12 participants → 3 PCBs manufactured
3. **Drone Racing Championship** - 50 participants → MITS won 1st place

### Cultural Club Activities (3)

1. **Open Mic Vol 3** - 162 participants → 12 performances
2. **Music Production** - 22 participants → 2 originals produced
3. **Stand-up Comedy** - 258 participants → 8 performers

### Sports Activities (3)

1. **Football League** - 120 participants → 4 teams qualified
2. **Fitness Challenge** - 80 participants → 50 completed
3. **Badminton League** - 80 participants → 3 teams to semifinals

---

## 📊 User Distribution

### By Role

- Students: 15
- Faculty: 3
- Dean: 1
- Super Admin: 2
- Demo Users: 4

### By Branch

- Computer Science & IT: 9
- Information Technology: 2
- Electronics & Communication: 3
- Mechanical Engineering: 4
- Civil Engineering: 2
- Electrical Engineering: 1

### By Skills (Top 10)

1. React - 3 students
2. Python - 4 students
3. Node.js - 2 students
4. Robotics - 4 students
5. Data Science - 2 students
6. UI/UX - 2 students
7. Event Management - 2 students
8. Photography - 2 students
9. Music & Dance - 3 students
10. Sports & Athletics - 3 students

---

## 🔐 Testing Scenarios

### Student Journey

1. **Demo Student** registers for **Web Dev Bootcamp**
   - ✅ Event Registration
   - ✅ Payment (UPI) - ₹200
   - 🎫 Ticket Issued
   - 📝 Pending Attendance

2. **Aryan Sharma** (Club President)
   - ✅ Manages CSIT Club
   - ✅ Organized 6 events
   - ✅ Earned 4 certificates
   - 📊 80+ total event attendees

### Faculty Approval Flow

1. **Prof. Suresh Kumar** creates event
2. **Event Pending** → Faculty Approves
3. Students register (Free/Paid)
4. **Certificates Generated** → Faculty Reviews
5. **Dean Approval** → Certificates Issued

### Admin Dashboard

- View all users, clubs, events, registrations
- Approve certificates & events
- Generate audit logs
- Manage recruitment cycles

---

## 📝 Sample Test Cases

### Test Event Registration

```
Setup: Demo Student logs in
Action: Register for "Web Dev Bootcamp" (₹200)
Expected:
  ✓ Registration created (Pending)
  ✓ Payment gateway opens
  ✓ UPI QR code displayed
  ✓ After payment: Ticket issued
  ✓ Confirmation email sent
```

### Test Certificate Generation

```
Setup: Faculty adds attendees to event
Action: Generate certificate batch
Expected:
  ✓ Batch created (Draft state)
  ✓ Faculty review screen
  ✓ Faculty approves
  ✓ Dean notification sent
  ✓ Dean approves & signs
  ✓ PDFs generated with hashes
```

### Test Recruitment Pipeline

```
Setup: Club opens recruitment
Action: Student applies → Progresses through stages
Expected:
  ✓ Applied → Under Review
  ✓ Screening → Interview scheduled
  ✓ Interview → Offer extended
  ✓ Offer → Selected/Rejected
  ✓ Notifications at each stage
```

---

## 🚀 Using Mock Data

### How to Access

1. Login with demo user: `aryan@mitsgwl.ac.in`
2. Browse clubs, events, certificates
3. View registrations and tickets
4. Check certificate batches
5. Browse recruitment applicants

### Reset/Refresh

```bash
node seed-demo-data.js
```

This regenerates `db.json` with fresh mock data (preserves user-created entries)

### Export Data

All data is in `db.json` - can be exported to:

- CSV (users, registrations, payments)
- PDF (certificates, tickets)
- Excel (reports, analytics)

---

**Generated:** April 2026 | **Next Update:** As needed

*For questions about mock data, check the seed-demo-data.js file or review db.json directly.*
