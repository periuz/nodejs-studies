import 'dotenv/config';
import { z } from 'zod';
// Validate environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
})
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable', _env.error.format);

  throw new Error('Invalid environment variables.'); // Brake the application, making the app not able to continue without environment variables
}

export const env = _env.data;
