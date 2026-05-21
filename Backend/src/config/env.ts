import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  PORT: z.coerce.number().default(3000),
  GROQ_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
