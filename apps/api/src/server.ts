import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

if (process.env.VERCEL !== '1') {
  app.listen(env.port, () => {
    console.log(`PromptVault API listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

export default app;
