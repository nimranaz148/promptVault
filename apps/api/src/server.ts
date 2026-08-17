import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`PromptVault API listening on port ${env.port} [${env.nodeEnv}]`);
});
