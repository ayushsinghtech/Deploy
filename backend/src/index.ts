import express from 'express';
import cors from 'cors';

const app = express();

// --- CORS should be set up on the app, not the router ---
const allowedOrigins = [
  'http://localhost:3000', // frontend dev
  // add other origins if needed
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ...existing code to set up routes and middleware...

// Do NOT call app.listen here

module.exports = app;
export default app;