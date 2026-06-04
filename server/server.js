import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database FIRST, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n  🚗 RoadSync API Server`);
    console.log(`  ━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  → Local:   http://localhost:${PORT}`);
    console.log(`  → Health:  http://localhost:${PORT}/api/health`);
    console.log(`  → Mode:    ${process.env.NODE_ENV || 'development'}\n`);
  });
});
