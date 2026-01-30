import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        PORT: z.string(),
        DB_URL: z.url(),
        CLOUDINARY_KEY_NAME: z.string(),
        CLOUDINARY_API_KEY: z.string(),
        CLOUDINARY_API_SECRET: z.string(),
        TEMPUSERTOKEN: z.string(),
        REFRESHTOKEN: z.string(),
        EMAILKEY: z.string(),
        OPENAI_API_KEY: z.string(),
        MOVIEPOSTERTOKEN: z.string(),
        MOVIEVIDEOTOKEN: z.string(),
    },
    runtimeEnv: process.env,
});
