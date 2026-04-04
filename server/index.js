import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Load env from project root (and tolerate common misplacements)
const rootDir = process.cwd();
const envCandidates = [
  path.join(rootDir, '.env'),
  path.join(rootDir, '.env.local'),
  path.join(rootDir, 'node_modules', '.env'),
];
for (const p of envCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'ccms';
const JWT_SECRET = process.env.JWT_SECRET || '';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Please configure it in a .env file.');
}
if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Please configure it in a .env file.');
}

app.use(cors()); // Permissive for local demo
app.use(express.json());

let db;
let mongoClient;

const DATA_FILE = path.join(rootDir, 'db.json');
let localDb = null;

async function getLocalDb() {
  if (localDb) return localDb;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      localDb = JSON.parse(content);
    } else {
      localDb = { users: [], clubs: [], events: [], registrations: [], applicants: [], logs: [], activities: [], batches: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(localDb, null, 2));
    }
    return localDb;
  } catch (e) {
    console.error('Local DB Error:', e);
    return { users: [], clubs: [], events: [], registrations: [], applicants: [], logs: [], activities: [], batches: [] };
  }
}

async function saveLocalDb() {
  if (!localDb) return;
  fs.writeFileSync(DATA_FILE, JSON.stringify(localDb, null, 2));
}

const localCollection = (name) => ({
  find: (query = {}) => ({
    sort: () => ({
      limit: () => ({
        toArray: async () => {
          const dbData = await getLocalDb();
          let res = dbData[name] || [];
          // Simple query filter
          Object.keys(query).forEach(key => {
            res = res.filter(item => item[key] === query[key]);
          });
          return JSON.parse(JSON.stringify(res)); // Deep clone
        }
      })
    }),
    toArray: async () => {
      const dbData = await getLocalDb();
      let res = dbData[name] || [];
      Object.keys(query).forEach(key => {
        res = res.filter(item => item[key] === query[key]);
      });
      return JSON.parse(JSON.stringify(res));
    }
  }),
  findOne: async (query) => {
    const dbData = await getLocalDb();
    const res = (dbData[name] || []).find(item => {
      return Object.keys(query).every(key => String(item[key]) === String(query[key]));
    });
    return res ? JSON.parse(JSON.stringify(res)) : null;
  },
  insertOne: async (doc) => {
    const dbData = await getLocalDb();
    if (!dbData[name]) dbData[name] = [];
    dbData[name].push(doc);
    await saveLocalDb();
    return { insertedId: doc._id || doc.id };
  },
  updateOne: async (query, update) => {
    const dbData = await getLocalDb();
    const index = (dbData[name] || []).findIndex(item => {
      return Object.keys(query).every(key => String(item[key]) === String(query[key]));
    });
    if (index !== -1) {
      if (update.$set) dbData[name][index] = { ...dbData[name][index], ...update.$set };
      else dbData[name][index] = { ...dbData[name][index], ...update };
      await saveLocalDb();
    }
    return { modifiedCount: index !== -1 ? 1 : 0 };
  },
  replaceOne: async (filter, replacement, options) => {
    const dbData = await getLocalDb();
    const index = (dbData[name] || []).findIndex(item => {
      return Object.keys(filter).every(key => String(item[key]) === String(filter[key]));
    });
    if (index !== -1) {
      dbData[name][index] = replacement;
    } else if (options?.upsert) {
      dbData[name].push(replacement);
    }
    await saveLocalDb();
    return { modifiedCount: 1 };
  },
  deleteOne: async (query) => {
    const dbData = await getLocalDb();
    const initialLen = dbData[name].length;
    dbData[name] = dbData[name].filter(item => {
      return !Object.keys(query).every(key => String(item[key]) === String(query[key]));
    });
    await saveLocalDb();
    return { deletedCount: initialLen - dbData[name].length };
  },
  bulkWrite: async (ops) => {
    for (const op of ops) {
      if (op.replaceOne) {
        const { filter, replacement, upsert } = op.replaceOne;
        const dbData = await getLocalDb();
        const index = (dbData[name] || []).findIndex(item => {
          return Object.keys(filter).every(key => String(item[key]) === String(filter[key]));
        });
        if (index !== -1) dbData[name][index] = replacement;
        else if (upsert) dbData[name].push(replacement);
      }
    }
    await saveLocalDb();
  },
  countDocuments: async (query = {}) => {
    const dbData = await getLocalDb();
    let res = dbData[name] || [];
    Object.keys(query).forEach(key => {
      res = res.filter(item => item[key] === query[key]);
    });
    return res.length;
  }
});

async function connectToMongo() {
  if (db) return db;

  // If MONGODB_URI is intentionally or accidentally empty/unset, use local fallback
  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    console.warn('[DB] MONGODB_URI not found. Using local JSON storage.');
    db = { collection: localCollection };
    return db;
  }

  try {
    if (!mongoClient) {
      console.log('[DB] Initializing MongoClient...');

      // Try Atlas first, then fallback to local
      const uris = [
        MONGODB_URI,
        'mongodb://localhost:27017/ccms'
      ];

      for (const uri of uris) {
        if (!uri) continue;

        try {
          console.log(`[DB] Trying to connect to: ${uri.includes('localhost') ? 'localhost' : 'Atlas'}`);
          mongoClient = new MongoClient(uri, {
            tls: !uri.includes('localhost'), // Disable TLS for localhost
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 1,
          });

          const connectPromise = mongoClient.connect();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timed out')), 6000)
          );

          await Promise.race([connectPromise, timeoutPromise]);

          db = mongoClient.db(DB_NAME);
          console.log(`[DB] Connected to ${uri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'} Successfully`);
          return db;
        } catch (e) {
          console.warn(`[DB] Failed to connect to ${uri.includes('localhost') ? 'localhost' : 'Atlas'}: ${e.message}`);
          mongoClient = null;
        }
      }

      throw new Error('All MongoDB connection attempts failed');
    }

    return db;
  } catch (e) {
    console.warn(`[DB] Could not connect to MongoDB: ${e.message}. Falling back to local JSON storage.`);
    db = { collection: localCollection };
    return db;
  }
}

function generateToken(user) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set.');
  const userId = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    {
      id: userId,
      email: user.email,
      globalRole: user.globalRole || 'STUDENT',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function toQuery(id) {
  try {
    if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      return { _id: new ObjectId(id) };
    }
  } catch (e) { }
  return { id: id };
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const isLocal = !!dbConn.collection && !dbConn.command;

    if (!isLocal) {
      await dbConn.command({ ping: 1 });
    }

    res.json({
      status: 'ok',
      database: isLocal ? 'local-json' : 'connected',
      mode: isLocal ? 'offline-demo' : 'mongo'
    });
  } catch (e) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: e.message });
  }
});

// --- Seeding ---
app.post('/api/db/seed', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { users, clubs, events, registrations, applicants, logs, batches, activities } = req.body;

    if (users) await dbConn.collection('users').bulkWrite(users.map(u => ({ replaceOne: { filter: { id: u.id }, replacement: u, upsert: true } })));
    if (clubs) await dbConn.collection('clubs').bulkWrite(clubs.map(c => ({ replaceOne: { filter: { id: c.id }, replacement: c, upsert: true } })));
    if (events) await dbConn.collection('events').bulkWrite(events.map(e => ({ replaceOne: { filter: { id: e.id }, replacement: e, upsert: true } })));
    if (registrations) await dbConn.collection('registrations').bulkWrite(registrations.map(r => ({ replaceOne: { filter: { id: r.id }, replacement: r, upsert: true } })));
    if (applicants) await dbConn.collection('applicants').bulkWrite(applicants.map(a => ({ replaceOne: { filter: { id: a.id }, replacement: a, upsert: true } })));
    if (logs) await dbConn.collection('logs').bulkWrite(logs.map(l => ({ replaceOne: { filter: { id: l.id }, replacement: l, upsert: true } })));
    if (batches) await dbConn.collection('batches').bulkWrite(batches.map(b => ({ replaceOne: { filter: { id: b.id }, replacement: b, upsert: true } })));
    if (activities) await dbConn.collection('activities').bulkWrite(activities.map(a => ({ replaceOne: { filter: { id: a.id }, replacement: a, upsert: true } })));

    res.json({ status: 'success', message: 'Database seeded successfully' });
  } catch (e) {
    console.error('Seeding Error:', e);
    res.status(500).json({ error: 'Seeding failed', details: e.message });
  }
});

// --- Auth ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');
    const { name, email, password, globalRole, enrollmentNumber, department, designation } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await users.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const userId = `user-${Date.now()}`;
    const userDoc = {
      id: userId,
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      globalRole: globalRole || 'Student',
      enrollmentNumber: enrollmentNumber || '',
      department: department || '',
      designation: designation || '',
      clubMemberships: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(userDoc);
    const savedUser = { ...userDoc, _id: result.insertedId };
    const token = generateToken(savedUser);

    res.json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        globalRole: savedUser.globalRole,
        enrollmentNumber: savedUser.enrollmentNumber,
        department: savedUser.department,
        designation: savedUser.designation,
        clubMemberships: savedUser.clubMemberships,
      },
    });
  } catch (e) {
    console.error(e);
    const msg = String(e?.message || e);
    if (msg.includes('MONGODB_URI is not set') || msg.includes('SSL') || msg.includes('tls')) {
      return res.status(503).json({ error: 'Database connection failed' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/demo-login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    let user = null;

    // First, try to find user in MongoDB
    try {
      const dbConn = await connectToMongo();
      const users = dbConn.collection('users');
      user = await users.findOne({ email: String(email).toLowerCase() });
    } catch (mongoErr) {
      console.log('MongoDB connection failed, falling back to db.json:', mongoErr.message);
    }

    // If not found in MongoDB, fallback to db.json
    if (!user) {
      try {
        const dbJsonPath = path.join(process.cwd(), 'db.json');
        if (fs.existsSync(dbJsonPath)) {
          const dbJsonContent = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
          user = dbJsonContent.users.find((u) => u.email && u.email.toLowerCase() === String(email).toLowerCase());
        }
      } catch (jsonErr) {
        console.log('Failed to read db.json:', jsonErr.message);
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found. Please seed the database or check email.' });
    }

    // In demo mode, we skip password check
    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        globalRole: user.globalRole,
        enrollmentNumber: user.enrollmentNumber,
        department: user.department,
        designation: user.designation,
        phoneNumber: user.phoneNumber,
        branch: user.branch,
        skills: user.skills || [],
        linkedin: user.linkedin,
        github: user.github,
        signatureUrl: user.signatureUrl,
        clubMemberships: user.clubMemberships || [],
      },
    });
  } catch (e) {
    console.error('Demo login error:', e);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

app.post('/api/auth/supabase-login', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');
    const { email, name, id } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    let user = await users.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      // Create a new user if they don't exist
      const userId = id || `user-sb-${Date.now()}`;
      const userDoc = {
        id: userId,
        name: name || email.split('@')[0],
        email: String(email).toLowerCase(),
        globalRole: 'STUDENT',
        enrollmentNumber: '',
        clubMemberships: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await users.insertOne(userDoc);
      user = { ...userDoc, _id: result.insertedId };
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id || user._id.toString(),
        name: user.name,
        email: user.email,
        globalRole: user.globalRole,
        enrollmentNumber: user.enrollmentNumber,
        clubMemberships: user.clubMemberships || [],
      },
    });
  } catch (e) {
    console.error('Supabase Sync Error:', e);
    res.status(500).json({ error: 'Supabase login sync failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await users.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash || '');
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id || user._id.toString(),
        name: user.name,
        email: user.email,
        globalRole: user.globalRole,
        enrollmentNumber: user.enrollmentNumber,
        clubMemberships: user.clubMemberships || [],
      },
    });
  } catch (e) {
    console.error(e);
    const msg = String(e?.message || e);
    if (msg.includes('MONGODB_URI is not set') || msg.includes('SSL') || msg.includes('tls')) {
      return res.status(503).json({ error: 'Database connection failed' });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');
    const user = await users.findOne(toQuery(req.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      globalRole: user.globalRole,
      enrollmentNumber: user.enrollmentNumber,
      clubMemberships: user.clubMemberships || [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// --- Clubs ---
app.get('/api/clubs', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const clubs = await dbConn.collection('clubs').find({}).toArray();
    res.json(clubs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

app.post('/api/clubs', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const club = req.body;
    await dbConn.collection('clubs').insertOne(club);
    res.json(club);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add club' });
  }
});

app.patch('/api/clubs/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { id } = req.params;
    await dbConn.collection('clubs').updateOne({ id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update club' });
  }
});

// --- Events ---
app.get('/api/events', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const events = await dbConn.collection('events').find({}).toArray();
    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const event = req.body;
    await dbConn.collection('events').insertOne(event);
    res.json(event);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('events').deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.patch('/api/events/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('events').updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// --- Users ---
app.get('/api/users', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = await dbConn.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const user = await dbConn.collection('users').findOne({ id: req.params.id }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const user = req.body;
    // In Firebase mode, req.params.id is the UID
    await dbConn.collection('users').updateOne({ id: req.params.id }, { $set: user }, { upsert: true });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('users').deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Registrations ---
app.get('/api/registrations', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const regs = await dbConn.collection('registrations').find({}).toArray();
    res.json(regs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const reg = req.body;
    await dbConn.collection('registrations').insertOne(reg);
    res.json(reg);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save registration' });
  }
});

app.patch('/api/registrations/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('registrations').updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

// --- Applicants ---
app.get('/api/applicants', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const applicants = await dbConn.collection('applicants').find({}).toArray();
    res.json(applicants);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

app.post('/api/applicants', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const applicant = req.body;
    await dbConn.collection('applicants').insertOne(applicant);
    res.json(applicant);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save applicant' });
  }
});

app.patch('/api/applicants/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('applicants').updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update applicant' });
  }
});

app.delete('/api/applicants/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('applicants').deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete applicant' });
  }
});

// --- Batches ---
app.get('/api/batches', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const batches = await dbConn.collection('batches').find({}).toArray();
    res.json(batches);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

app.post('/api/batches', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const batch = req.body;
    await dbConn.collection('batches').insertOne(batch);
    res.json(batch);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save batch' });
  }
});

app.patch('/api/batches/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('batches').updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update batch' });
  }
});

app.delete('/api/batches/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('batches').deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete batch' });
  }
});

// --- Audit Logs ---
app.get('/api/logs', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const logs = await dbConn.collection('logs').find({}).sort({ timestamp: -1 }).limit(200).toArray();
    res.json(logs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('logs').insertOne(req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// --- Activities ---
app.get('/api/activities', async (_req, res) => {
  try {
    const dbConn = await connectToMongo();
    const activities = await dbConn.collection('activities').find({}).toArray();
    res.json(activities);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const activity = req.body;
    await dbConn.collection('activities').insertOne(activity);
    res.json(activity);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save activity' });
  }
});

app.patch('/api/activities/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { id } = req.params;
    await dbConn.collection('activities').updateOne({ id }, { $set: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    await dbConn.collection('activities').deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// ─── CLUB MEMBER MANAGEMENT ─────────────────────────────────────────────────────

// Get students that can be added to a club
app.get('/api/clubs/:clubId/available-members', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');

    // Get all students (filter by Student role)
    const students = await users.find({ globalRole: 'Student' }).toArray();

    res.json(students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      enrollmentNumber: s.enrollmentNumber || '',
      department: s.department || '',
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch available members' });
  }
});

// Add member to club
app.post('/api/clubs/:clubId/members', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { clubId } = req.params;
    const { userId, role } = req.body;

    const users = dbConn.collection('users');
    const user = await users.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add club membership to user
    const updatedMemberships = user.clubMemberships || [];
    const alreadyMember = updatedMemberships.find(m => m.clubId === clubId);

    if (alreadyMember) {
      return res.status(409).json({ error: 'User is already a member of this club' });
    }

    updatedMemberships.push({ clubId, role: role || 'Member' });

    await users.updateOne(
      { id: userId },
      { $set: { clubMemberships: updatedMemberships, updatedAt: new Date() } }
    );

    res.json({ ok: true, message: 'Member added successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from club
app.delete('/api/clubs/:clubId/members/:userId', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { clubId, userId } = req.params;

    const users = dbConn.collection('users');
    const user = await users.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedMemberships = (user.clubMemberships || []).filter(m => m.clubId !== clubId);

    await users.updateOne(
      { id: userId },
      { $set: { clubMemberships: updatedMemberships, updatedAt: new Date() } }
    );

    res.json({ ok: true, message: 'Member removed successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// ─── MANUAL TICKET GENERATION ───────────────────────────────────────────────────

// Get students for ticket generation
app.get('/api/events/:eventId/ticket-candidates', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const users = dbConn.collection('users');

    // Get all students that are not yet registered for this event
    const events = dbConn.collection('events');
    const registrations = dbConn.collection('registrations');

    const event = await events.findOne({ id: req.params.eventId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registered = await registrations.find({ eventId: req.params.eventId }).toArray();
    const registeredIds = registered.map(r => r.studentId);

    const students = await users.find({
      globalRole: 'Student',
      id: { $nin: registeredIds }
    }).toArray();

    res.json(students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      enrollmentNumber: s.enrollmentNumber || '',
      department: s.department || '',
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch ticket candidates' });
  }
});

// Generate manual ticket for student
app.post('/api/events/:eventId/generate-ticket', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const { eventId } = req.params;
    const { studentId, studentName, studentRoll } = req.body;

    if (!studentId || !studentName || !studentRoll) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const registrations = dbConn.collection('registrations');
    const ticketId = `ticket-${Date.now()}`;

    const registration = {
      id: ticketId,
      eventId,
      studentId,
      studentName,
      studentRoll,
      status: 'Approved',
      paymentType: 'Manual',
      registrationDate: new Date(),
      attendanceMarked: false,
    };

    await registrations.insertOne(registration);

    res.json({ ok: true, ticket: registration, message: 'Ticket generated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate ticket' });
  }
});

// ─── REAL-TIME CHAT & MESSAGES ──────────────────────────────────────────────────

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const messages = dbConn.collection('messages');
    const { senderId, senderName, recipientId, clubId, content, timestamp } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content required' });
    }

    const message = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      recipientId,
      clubId,
      content,
      timestamp: timestamp || new Date().toISOString(),
      read: false,
      createdAt: new Date(),
    };

    await messages.insertOne(message);

    // TODO: Emit via WebSocket/Socket.io for real-time updates
    // socket.emit('new-message', message);

    res.json(message);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for a chat
app.get('/api/messages', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const messages = dbConn.collection('messages');
    const { clubId, userId, otherUserId } = req.query;

    let query = {};
    if (clubId) {
      query.clubId = clubId;
    } else if (userId && otherUserId) {
      query = {
        $or: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId }
        ]
      };
    }

    const msgList = await messages.find(query).sort({ timestamp: 1 }).toArray();
    res.json(msgList);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
app.patch('/api/messages/:messageId/read', async (req, res) => {
  try {
    const dbConn = await connectToMongo();
    const messages = dbConn.collection('messages');

    await messages.updateOne(
      { id: req.params.messageId },
      { $set: { read: true } }
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

app.listen(PORT, () => {
  console.log(`[CLIX HUB] Server running on http://localhost:${PORT}`);
});
