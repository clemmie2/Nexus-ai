import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
  DISCORD_TOKEN: z.string().min(1), DISCORD_CLIENT_ID: z.string().min(1), DISCORD_GUILD_ID: z.string().optional(),
  DATABASE_PATH: z.string().default('./data/nexus.sqlite'), OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'), LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});
export const env = schema.parse(process.env);
