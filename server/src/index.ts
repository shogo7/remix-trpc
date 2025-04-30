// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { appRouter } from './trpc/index.js';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { authMiddleware } from './middleware/auth.js';
import { csrfMiddleware } from './middleware/csrf.js';
import cookieParser from 'cookie-parser';
import { createContext } from './trpc/context.js';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';


mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('🍃 Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT ?? 3010;

app.use(cookieParser());
app.use(authMiddleware);
app.use(csrfMiddleware);


app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

app.listen(PORT, () => {
  console.log(`🚀 tRPC API running at http://localhost:${PORT}/trpc`);
});
