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

// ---- Global Middleware ----
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
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
