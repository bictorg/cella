import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  server: {
    TUS_UPLOAD_API_SECRET: z.string().default('very_secret'),
    AWS_S3_UPLOAD_ACCESS_KEY_ID: z.string().default(''),
    AWS_S3_UPLOAD_SECRET_ACCESS_KEY: z.string().default(''),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
