import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import { User, Club, Event, Registration, Applicant, AuditLog } from './models.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'clix-hub-secret-2026';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccms';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Database'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
interface AuthRequest extends Request {
  user?: any;
  headers: any;
  params: any;
  body: any;
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Identity token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired session' });
  }
};

// --- ROUTES ---

// 1. Authentication & Security
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean();

    if (!user || !(await bcrypt.compare(password, user.password as string))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.globalRole }, JWT_SECRET);
    // Hide password before sending
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { name, email, password, globalRole, enrollmentNumber } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Identity Conflict: Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;

    const newUser = new User({
      id: userId,
      name,
      email,
      password: hashedPassword,
      globalRole: globalRole || 'Student',
      enrollmentNumber: enrollmentNumber || '',
      clubMemberships: [],
      skills: []
    });

    await newUser.save();

    const token = jwt.sign({ id: userId, role: newUser.globalRole }, JWT_SECRET);
    const userObj = newUser.toObject() as any;
    delete userObj.password;

    res.status(201).json({ token, user: userObj });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Identity Ledger (Users)
app.get('/api/users', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json(users);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ id: req.params.id }, { password: 0 });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put('/api/users/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    // Update or insert if not exists
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 3. Institutional Clubs
app.get('/api/clubs', async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clubs', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'Super Admin') {
    res.status(403).json({ error: 'Admin only' });
    return;
  }

  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/clubs/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const club = await Club.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    res.json(club);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 4. Governance Hub (Events)
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/events/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    res.json(event);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/events/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await Event.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 5. Registration & Gate Control
app.get('/api/registrations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const regs = await Registration.find();
    res.json(regs);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/registrations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reg = new Registration(req.body);
    await reg.save();
    res.status(201).json(reg);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/registrations/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reg = await Registration.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    res.json(reg);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 6. Recruitment Pipeline
app.get('/api/applicants', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const applicants = await Applicant.find();
    res.json(applicants);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/applicants', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const appInfo = new Applicant(req.body);
    await appInfo.save();
    res.status(201).json(appInfo);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 7. Audit Logging
app.get('/api/logs', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/logs', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const logInfo = new AuditLog(req.body);
    await logInfo.save();
    res.status(201).json(logInfo);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CLIX HUB API Core live on port ${PORT}`);
});
