# Club Management System - New Features Implementation Guide

## Features Implemented

### 1. **Enhanced User Signup System**

#### Student Registration

- **Fields Required:**
  - Full Name
  - Institute Email (special field for students)
  - Enrollment Number
  - Department
  - Password

#### Faculty Registration

- **Fields Required:**
  - Full Name
  - Faculty Email
  - Department
  - Designation (e.g., Assistant Professor, Associate Professor)
  - Password

**Location:** `components/pages/JWTAuthPage.tsx`

- New role selection (Student/Faculty) at signup
- Dynamic form fields based on selected role
- All information is tied to user account permanently

**Backend:** `server/index.js`

- Updated `/api/auth/signup` endpoint to accept new fields
- Fields stored in MongoDB with user record
- Fields: `department`, `designation` added to User schema

---

### 2. **Club Member Management**

#### Club President Can Add Members

**Component:** `components/modals/AddClubMemberModal.tsx`

**Features:**

- Search students from database by name, email, or enrollment number
- Select role for the member (President, Vice President, Member, etc.)
- One-click addition to club
- Real-time feedback (success/error messages)

**API Endpoints:**

```
GET  /api/clubs/:clubId/available-members
POST /api/clubs/:clubId/members
DELETE /api/clubs/:clubId/members/:userId
```

**How to Use:**

1. Club President navigates to Club Members page
2. Clicks "Add Member" button
3. Modal opens showing available students
4. Search and select desired student
5. Choose role from dropdown
6. Click "Add Member" to confirm

**Database Methods:** `db.ts`

```typescript
getAvailableMembers(clubId)
addClubMember(clubId, userId, role)
removeClubMember(clubId, userId)
```

---

### 3. **Manual Ticket Generation**

#### Event Administrators Can Generate Tickets

**Component:** `components/modals/GenerateManualTicketModal.tsx`

**Features:**

- Search students from database
- View student details (enrollment, department)
- Generate manual ticket for selected student
- Automatic registration in system
- Success confirmation

**API Endpoints:**

```
GET  /api/events/:eventId/ticket-candidates
POST /api/events/:eventId/generate-ticket
```

**How to Use:**

1. Navigate to Event Operations
2. Click "Generate Ticket" button
3. Modal opens with available students (not yet registered)
4. Search and select student
5. Click "Generate" button
6. Ticket is immediately issued and student is registered

**Database Methods:** `db.ts`

```typescript
getTicketCandidates(eventId)
generateManualTicket(eventId, studentId, studentName, studentRoll)
```

---

### 4. **Real-Time Chat System with Push Notifications**

#### Real-Time Message Updates

**Component:** `components/pages/ChatSystem.tsx`

**Features:**

- Message polling every 2 seconds for real-time updates
- Club-based group chats
- Direct messages between users
- Message delivery status tracking
- Message read receipts

**How It Works:**

1. Backend: `/api/messages` endpoints handle message storage and retrieval
2. Frontend: Polls messages every 2 seconds for updates
3. Messages automatically appear in chat interface
4. Supports: Text, Images, Videos, Location, Polls

#### Push Notifications

**Service:** `lib/PushNotificationService.ts`

**Features:**

- Browser native push notifications
- Notification permission requests on first use
- Shows sender name and message preview
- Distinguishes between:
  - Direct message notifications
  - Announcement notifications
  - Event notifications
- Supports notification actions (Open, Dismiss)

**API Endpoints:**

```
POST   /api/messages              (Send message)
GET    /api/messages              (Fetch messages)
PATCH  /api/messages/:id/read     (Mark as read)
```

**Notification Types:**

```typescript
// Message notification
pushNotificationService.notifyMessage(senderName, messagePreview)

// Announcement notification
pushNotificationService.notifyAnnouncement(title, body)

// System event notification
pushNotificationService.notifyEvent(eventName, details)

// Request permission
pushNotificationService.requestPermission()

// Check if enabled
pushNotificationService.isNotificationEnabled()
```

**Implementation in ChatSystem:**

- Initializes notification permission on component mount
- Shows notification when new message arrives
- Notification is shown only if sender is not the current user
- Navigation to relevant channel on notification click

---

## Database Schema Updates

### User Model (types.ts)

```typescript
interface User {
    // ... existing fields ...
    department?: string;      // New: for students and faculty
    designation?: string;     // New: for faculty (e.g., "Assistant Professor")
}
```

### Message Model (types.ts)

```typescript
interface Message {
    id: string;
    senderId: string;
    senderName: string;
    recipientId?: string;      // For DM
    clubId?: string;           // For group chat
    content: string;
    timestamp: string;
    read: boolean;
    type: 'text' | 'image' | 'video' | 'location' | 'poll';
    status: 'sent' | 'delivered' | 'read';
    // ... other fields ...
}
```

---

## API Reference

### Authentication

```
POST /api/auth/signup
Body: {
    name: string,
    email: string,
    password: string,
    globalRole: 'Student' | 'Faculty',
    enrollmentNumber?: string,     // For students
    department?: string,
    designation?: string           // For faculty
}
```

### Club Member Management

```
GET  /api/clubs/:clubId/available-members
POST /api/clubs/:clubId/members
Body: { userId: string, role: ClubRole }

DELETE /api/clubs/:clubId/members/:userId
```

### Ticket Generation

```
GET /api/events/:eventId/ticket-candidates

POST /api/events/:eventId/generate-ticket
Body: {
    studentId: string,
    studentName: string,
    studentRoll: string
}
```

### Messaging

```
POST /api/messages
Body: {
    senderId: string,
    senderName: string,
    recipientId?: string,
    clubId?: string,
    content: string,
    timestamp: string
}

GET /api/messages?clubId=...&userId=...&otherUserId=...

PATCH /api/messages/:messageId/read
```

---

## Usage Examples

### Add Member to Club

```typescript
import { db } from '../../db';

// Get available students
const students = await db.getAvailableMembers(clubId);

// Add a member
await db.addClubMember(clubId, userId, 'Member');

// Remove a member
await db.removeClubMember(clubId, userId);
```

### Generate Manual Ticket

```typescript
// Get unregistered students
const candidates = await db.getTicketCandidates(eventId);

// Generate ticket
await db.generateManualTicket(eventId, studentId, studentName, enrollmentNumber);
```

### Send Chat Message

```typescript
const message: Message = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    content: 'Hello!',
    timestamp: new Date().toISOString(),
    clubId: activeClubId, // or recipientId for DM
    type: 'text',
    status: 'sent'
};

await db.sendMessage(message);
```

### Show Push Notification

```typescript
import { pushNotificationService } from '../../lib/PushNotificationService';

// Request permission
await pushNotificationService.requestPermission();

// Show message notification
await pushNotificationService.notifyMessage(
    'John Doe',
    'Hey, how are you doing?'
);

// Show announcement
await pushNotificationService.notifyAnnouncement(
    'New Event',
    'CodeQuest 2024 registration is now open!'
);

// Check if enabled
if (pushNotificationService.isNotificationEnabled()) {
    // Show notifications
}
```

---

## File Structure

```
├── components/
│   ├── modals/
│   │   ├── AddClubMemberModal.tsx        (NEW)
│   │   └── GenerateManualTicketModal.tsx (NEW)
│   └── pages/
│       ├── JWTAuthPage.tsx               (UPDATED)
│       ├── ChatSystem.tsx                (UPDATED)
│       └── ...
├── lib/
│   ├── PushNotificationService.ts        (NEW)
│   └── ...
├── server/
│   └── index.js                          (UPDATED)
├── db.ts                                 (UPDATED)
├── types.ts                              (UPDATED)
└── ...
```

---

## Testing Checklist

- [ ] Student signup with all fields (enrollment, department)
- [ ] Faculty signup with all fields (designation)
- [ ] Add member to club (president action)
- [ ] Remove member from club
- [ ] Generate manual ticket for unregistered student
- [ ] Send messages in club chat
- [ ] Send direct messages
- [ ] Receive push notifications for new messages
- [ ] Request push notification permission
- [ ] View message history

---

## Notes

1. **Real-Time Updates**: Messages are polled every 2 seconds. For true WebSocket real-time, integrate Socket.io with the backend.

2. **Push Notifications**: Require HTTPS in production. Works best with Service Workers for background notifications.

3. **Data Persistence**: All user, member, ticket, and message data is stored in MongoDB (or JSON fallback).

4. **Access Control**:
   - Only club presidents can add/remove members
   - Faculty and admins can generate tickets
   - Students can only chat with clubmates and faculty

5. **Future Enhancements**:
   - WebSocket integration for true real-time chat
   - Message encryption
   - Read receipts with timestamps
   - Voice/video calling
   - Chat features (reactions, threads, etc.)
   - Media uploads (instead of base64)
