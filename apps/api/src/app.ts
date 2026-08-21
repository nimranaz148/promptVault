import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes';

export function createApp(): Application {
  const app = express();
  
  // Trust proxy is required for express-rate-limit when hosted on Vercel/Render
  app.set('trust proxy', 1);

  // Security baseline (PRD Section 9 / 11 — NFRs)
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, true); // Allow all origins dynamically
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(generalLimiter);

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler); // must be registered last

  return app;
}
