import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import parkingRoutes from './routes/parking.js';
import emissionRoutes from './routes/emissions.js';
import crimeRoutes from './routes/crimes.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

// ---- Global Middleware & CORS ----
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://road-sync.vercel.app',
];

if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''));
  envOrigins.forEach((url) => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');

    // Allowed if in origin list or wildcard
    if (allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Allowed if local development origin (any localhost / 127.0.0.1 port)
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allowed if Vercel deployment domain (*.vercel.app)
    if (/^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/emissions', emissionRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/chat', chatRoutes);

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RoadSync API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ---- Global Error Handler (must be last) ----
app.use(errorHandler);

export default app;
