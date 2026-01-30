import { email, z } from 'zod';
import { describe } from 'zod/v4/core';

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name too short')
        .max(40, 'Name too long')
        .regex(/^[a-zA-Z\s]+$/, 'Only letters allowed'),

    email: z.string().trim().toLowerCase().email('Invalid email address'),

    password: z
        .string()
        .min(8, 'Min 8 characters')
        .max(100)
        .regex(/[A-Z]/, '1 uppercase required')
        .regex(/[a-z]/, '1 lowercase required')
        .regex(/[0-9]/, '1 number required')
        .regex(/[^A-Za-z0-9]/, '1 special character required'),
});

export const loginSchema = z.object({
    email: z.email().trim(),
    password: z.string(),
});

export const movieAbout = z.object({
  name: z.string(),
  describe: z.string(),
  serverDescription: z.string(),
  price: z.number(),
})
