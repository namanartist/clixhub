# 🎓 MITS Club Management System (CCMS)

A comprehensive, full-stack club management platform designed for educational institutions. Built with **React**, **TypeScript**, **Node.js/Express**, **MongoDB**, and **Flutter** for mobile support.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The **MITS Club Management System** is a comprehensive platform for managing college clubs, events, memberships, finances, and communications. It provides role-based access for students, faculty, club administrators, and super admins with features for event management, attendance tracking, financial management, certification, and more.

### Target Users

- **Students**: Browse clubs, apply for memberships, attend events, view certificates
- **Club Presidents & Officers**: Manage members, organize events, handle finances
- **Faculty**: Oversee clubs, monitor activities, manage certifications
- **Super Admins**: System-wide administration and analytics

---

## ✨ Key Features

### 👤 User Management & Authentication

- **Role-Based Access Control**: Student, Faculty, Club Admin, Super Admin roles
- **JWT Authentication**: Secure token-based authentication
- **Clerk Integration**: OAuth and social login support
- **Dynamic Registration**: Role-specific signup forms (Students, Faculty)
- **User Profiles**: Detailed student & faculty profiles with department and designation info

### 🏛️ Club Management

- **Club Directory**: Public and private club listings with search functionality
- **Club Members Management**: Add, remove, and manage club member roles (President, VP, Member, etc.)
- **Club Settings**: Configure club information, policies, and preferences
- **Club Website Builder**: Custom public websites for each club with drag-and-drop editor
- **Club Finance Dashboard**: Track budgets, expenses, fund requests, and financial reports
- **Club Home**: Customizable club landing page with news and updates

### 📅 Event Management

- **Event Creation & Registry**: Full event lifecycle management from planning to closure
- **Event Operations**: Comprehensive event management dashboard
- **Ticket Management**: Automated and manual ticket generation and distribution
- **QR Code Generation**: Unique QR codes for attendance tracking
- **Attendance Control**: Real-time attendance tracking with QR code scanning
- **Campus Events**: Institution-wide event discovery and participation

### 📊 Analytics & Reporting

- **Global Analytics Dashboard**: System-wide performance metrics and trends
- **Institutional KPIs**: Key performance indicators per department and club
- **Student Dashboard**: Personal event applications, registrations, and ticket tracking
- **Faculty Oversight**: Monitor club activities, member engagement, and compliance
- **System Logs**: Comprehensive audit trail and activity logging
- **Custom Reports**: Generate custom reports for analysis

### 🎖️ Certifications & Rewards

- **Automated Certificate Generation**: Generate certificates for event participation
- **Certificate Verification Portal**: Public certificate validation system
- **Certification Governance**: Faculty oversight and approval of certificate issuance
- **Badge System**: Recognition and achievement tracking for members
- **Certificate Templates**: Customizable certificate designs

### 💬 Communication & Social

- **Real-time Chat System**: Direct messaging between members
- **Live Feed**: Activity feed for clubs and campus events
- **Socket.io Integration**: Real-time notifications and updates
- **Faculty Feed**: Dedicated communication channel for faculty
- **Push Notifications**: Instant notifications for events and updates

### 💰 Finance Management

- **Payment Tracking**: Comprehensive payment and transaction management
- **Ticket System**: Automated ticket generation and distribution
- **Finance Dashboard**: Revenue, expenses, and financial analytics
- **Fund Requests**: Club funding proposals and institutional approval workflow
- **Invoice Management**: Generate and track invoices

### 📱 Mobile & Web Support

- **Flutter Mobile App**: Cross-platform native app for iOS and Android
- **Web Responsive Design**: Fully responsive design for desktop and tablet
- **PWA Features**: Progressive Web App capabilities
- **Offline Support**: Offline functionality where applicable

### 🔐 Advanced Features

- **Recruitment Board**: Open positions and recruitment announcements
- **Certification Governance**: Professional certification and compliance management
- **Student & Faculty Registry**: Centralized directory with advanced search
- **Faculty Registry**: Faculty member tracking and oversight
- **Onboarding Workflow**: Streamlined user onboarding process

---

## 🛠️ Tech Stack

### Frontend

- **React 19.2.4** with TypeScript
- **React Router DOM 7.13.1** for navigation and routing
- **Vite 6.2.0** for fast build and hot module replacement
- **Tailwind CSS** for styling (or custom CSS)
- **Lucide React 0.563.0** for icon library
- **Socket.io Client 4.8.3** for real-time communication
- **QR Code React 4.2.0** for QR code generation
- **HTML5 QR Code 2.3.8** for QR code scanning
- **Recharts 3.7.0** for data visualization

### Backend

- **Node.js** with Express.js 5.2.1
- **MongoDB 6.12.0** for NoSQL database
- **Mongoose 9.3.0** ODM for MongoDB
- **Prisma** for ORM (database schema defined in schema.prisma)
- **Socket.io 4.8.3** for real-time features
- **JWT (jsonwebtoken 9.0.3)** for authentication
- **bcryptjs 3.0.3** for password hashing
- **Firebase 12.10.0** for additional services
- **Clerk** for authentication and user management
- **CORS 2.8.6** for cross-origin requests
- **dotenv 16.6.1** for environment variables

### Mobile

- **Flutter 3.0+** for cross-platform development
- **Dart** programming language
- **Material Design** UI framework
- **Provider** for state management
- **Dio** for HTTP requests
- **GetIt** for dependency injection

### Development Tools

- **TypeScript 5.8.2** for type safety
- **tsx 4.21.0** for TypeScript execution
- **@vitejs/plugin-react 5.0.0** for React support in Vite
- **npm** for package management

---

## 📁 Project Structure

```
mits-club-management-system-ccms/
│
├── components/                          # React components
│   ├── pages/                          # Page components (35+ pages)
│   │   ├── ClubHome.tsx               # Club dashboard
│   │   ├── EventOperations.tsx        # Event management
│   │   ├── ClubFinance.tsx            # Financial dashboard
│   │   ├── ClubMembers.tsx            # Member management
│   │   ├── GlobalAnalytics.tsx        # System analytics
│   │   ├── AttendanceControl.tsx      # Attendance tracking
│   │   ├── CertificateVerification.tsx # Certificate validation
│   │   ├── ChatSystem.tsx             # Messaging
│   │   ├── StudentProfile.tsx         # User profiles
│   │   ├── EventRegistry.tsx          # Event listing
│   │   ├── InstitutionalKPIs.tsx      # Performance metrics
│   │   ├── StudentRegistry.tsx        # Student directory
│   │   ├── ClubPublicWebsite.tsx      # Public club pages
│   │   ├── MyApplications.tsx         # Application tracking
│   │   ├── MyPayments.tsx             # Payment history
│   │   ├── MyTickets.tsx              # Ticket management
│   │   ├── SuperAdminHub.tsx          # Admin dashboard
│   │   └── ... (other page components)
│   │
│   ├── modals/                         # Modal components
│   │   ├── AddClubMemberModal.tsx     # Add new members
│   │   └── GenerateManualTicketModal.tsx # Manual ticket creation
│   │
│   ├── Navbar.tsx                      # Navigation bar
│   ├── Sidebar.tsx                     # Sidebar navigation
│   ├── Footer.tsx                      # Footer component
│   ├── ThemeToggle.tsx                 # Dark/light mode toggle
│   ├── MobileNav.tsx                   # Mobile navigation
│   ├── EventCard.tsx                   # Event display component
│   ├── CertificatePreview.tsx          # Certificate preview
│   ├── RecruitmentBoard.tsx            # Recruitment listings
│   └── ... (other UI components)
│
├── lib/                                 # Utility and service libraries
│   ├── AuthContext.tsx                # Authentication context provider
│   ├── authService.ts                 # Authentication logic
│   ├── firebase.ts                    # Firebase configuration
│   ├── PushNotificationService.ts    # Push notifications
│
├── clix_hub_flutter/                  # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart                 # Application entry point
│   │   ├── models/                   # Data models
│   │   ├── services/                 # API and business logic
│   │   ├── theme/                    # UI themes
│   │   └── router/                   # Navigation routing
│   │
│   ├── android/                      # Android configuration
│   │   ├── app/                      # Android app module
│   │   └── gradle/                   # Gradle build system
│   │
│   ├── ios/                          # iOS configuration
│   │   ├── Runner/                   # iOS app project
│   │   └── Runner.xcworkspace/       # Xcode workspace
│   │
│   ├── web/                          # Web configuration
│   └── pubspec.yaml                  # Flutter dependencies
│
├── prisma/                            # Database ORM
│   └── schema.prisma                 # Database schema definition
│
├── server/                            # Backend Express server
│   ├── index.js                      # Main server file and API routes
│   └── middleware/                   # Express middleware
│
├── public/                            # Static assets
│   └── (images, fonts, etc.)
│
├── src/                               # TypeScript source
│   ├── types.ts                      # TypeScript type definitions
│   ├── constants.tsx                 # Application constants
│   ├── models.ts                     # Data models
│   ├── db.ts                         # Database utilities
│   ├── ai.ts                         # AI integration
│   ├── App.tsx                       # Main App component
│   ├── index.tsx                     # React entry point
│   └── index.css                     # Global styles
│
├── schema.sql                         # Database schema
├── seed-db.ts                         # Database seeding script
├── seed-demo-data.js                  # Demo data generator
├── test-mongo-direct.js               # MongoDB testing
│
├── vite.config.ts                     # Vite bundler configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies and scripts
├── index.html                         # HTML entry point
├── metadata.json                      # Application metadata
│
└── Documentation Files
    ├── README.md                      # This file
    ├── FEATURE_GUIDE.md               # Feature documentation
    ├── db.json                        # Development database config
    ├── schema.sql                     # SQL schema reference
    └── supabase_schema.sql            # Supabase specific schema
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm 8+
- **MongoDB** 4.4+ (local or cloud instance)
- **Git** for version control
- **Flutter SDK** 3.0+ (for mobile app development)
- Code editor (VS Code recommended)

### Quick Start (5 minutes)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mits-club-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables** (see [Environment Variables](#environment-variables))

   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **In a new terminal, start backend server**

   ```bash
   npm run server
   ```

6. Open <http://localhost:5173> in your browser

---

## 📦 Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd mits-club-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database

#### For MongoDB

```bash
# Using MongoDB Atlas (Cloud)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create a cluster and get connection string
# 3. Add connection string to .env.local

# OR using Local MongoDB
brew install mongodb-community  # macOS
# or follow MongoDB installation guide for your OS
brew services start mongodb-community  # Start service
```

#### Initialize Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed  # Optional: seed with demo data
```

### Step 4: Configure Environment

Create `.env.local` file in project root (see [Environment Variables](#environment-variables))

### Step 5: For Flutter Mobile App

```bash
cd clix_hub_flutter
flutter pub get
flutter pub upgrade
```

---

## ▶️ Running the Application

### Development Mode

#### Frontend

```bash
npm run dev
```

Vite dev server runs on `http://localhost:5173`

#### Backend

**In another terminal:**

```bash
npm run server
```

Express server runs on `http://localhost:3000`

#### Both (Concurrently)

Install concurrently first:

```bash
npm install -D concurrently
```

Then update package.json scripts:

```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

Run with:

```bash
npm run dev:all
```

### Flutter Mobile App

#### iOS

```bash
cd clix_hub_flutter
flutter run -d ios
```

#### Android

```bash
cd clix_hub_flutter
flutter run -d android
```

#### Web

```bash
cd clix_hub_flutter
flutter run -d web
```

### Production Build

#### Frontend

```bash
npm run build
npm run preview
```

#### Backend

```bash
NODE_ENV=production npm run server
```

---

## 🗄️ Database Setup

### Database Schema

The system uses MongoDB with Prisma ORM. Key collections include:

- **Users**: Student, Faculty, Admin accounts
- **Clubs**: Club information and metadata
- **ClubMembers**: Club membership records with roles
- **Events**: Event information and details
- **Attendance**: Event attendance records
- **Certificates**: Generated certificates
- **Payments**: Transaction records
- **Tickets**: Event tickets

### Seeding Database

```bash
# Run seed script
node seed-demo-data.js

# Or using TypeScript
npx tsx seed-db.ts
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ warning: deletes all data)
npx prisma migrate reset
```

### View Database

#### Using Prisma Studio

```bash
npx prisma studio
```

Opens <http://localhost:5555> with GUI for database management

#### Using MongoDB Compass

Download MongoDB Compass and connect to your MongoDB instance URL

---

## 📡 API Documentation

### Authentication Endpoints

#### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student",
  "enrollmentNumber": "RV123456",
  "department": "CSE"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Club Management

#### Get All Clubs

```http
GET /api/clubs
```

#### Create Club

```http
POST /api/clubs
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Photography Club",
  "description": "Learn photography",
  "president": "user_id"
}
```

#### Add Member

```http
POST /api/clubs/{clubId}/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "member_user_id",
  "role": "member"
}
```

### Event Management

#### Get Events

```http
GET /api/events
GET /api/events?clubId={clubId}
```

#### Create Event

```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Annual Fest 2024",
  "description": "College's annual festival",
  "date": "2024-04-20T10:00:00Z",
  "location": "Main Auditorium",
  "clubId": "club_id",
  "capacity": 500
}
```

#### Generate Ticket

```http
POST /api/events/{eventId}/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "ticketType": "general"
}
```

### Attendance

#### Mark Attendance

```http
POST /api/attendance/mark
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "event_id",
  "userId": "user_id",
  "timestamp": "2024-04-20T10:30:00Z"
}
```

#### Get Attendance Report

```http
GET /api/attendance/report?eventId={eventId}
Authorization: Bearer {token}
```

### Certificates

#### Get User Certificates

```http
GET /api/certificates/user/{userId}
```

#### Verify Certificate

```http
GET /api/certificates/verify/{certificateId}
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
VITE_MONGODB_URI=mongodb://localhost:27017/ccms
MONGODB_URI=mongodb://localhost:27017/ccms

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=3000
NODE_ENV=development

# Google Generative AI
VITE_GOOGLE_GENAI_API_KEY=your_google_genai_key

# Supabase (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:

- Ensure MongoDB is running: `brew services start mongodb-community`
- Or use MongoDB Atlas cloud connection string

#### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**:

```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

#### Module Not Found

```
Cannot find module 'express'
```

**Solution**:

```bash
npm install
npm cache clean --force
rm -rf node_modules
npm install
```

#### Prisma Migration Issues

```bash
# Reset Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
npx prisma migrate deploy
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf ./dist
npm run build
```

---

## 📝 Scripts

```json
{
  "dev": "vite",                    // Start Vite dev server
  "build": "vite build",            // Build for production
  "preview": "vite preview",        // Preview production build
  "server": "node server/index.js"  // Start Express server
}
```

### Custom Scripts

Add to package.json:

```json
{
  "dev:all": "concurrently \"npm run dev\" \"npm run server\"",
  "migrate": "npx prisma migrate dev",
  "seed": "node seed-demo-data.js",
  "studio": "npx prisma studio",
  "lint": "eslint . --ext .ts,.tsx"
}
```

---

## 🤝 Contributing

### Guidelines

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Reporting Issues

- Use GitHub Issues
- Include detailed description
- Attach error logs and screenshots
- Specify your environment (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

Developed by the MITS Club Development Team

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Flutter Docs](https://flutter.dev/docs)
- [Vite Guide](https://vitejs.dev)

---

## 📞 Support

For support, please:

1. Check existing issues on GitHub
2. Read the FEATURE_GUIDE.md for detailed feature information
3. Contact the development team
4. Create a new issue with detailed information

---

**Last Updated**: April 2024
**Version**: 1.0.0
# clixhub
# clixhub
# clixhub
