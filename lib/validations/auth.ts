import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(72, 'Password must be 72 characters or fewer.');

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .min(5, 'Email is required.')
    .max(255, 'Email must be 255 characters or fewer.')
    .transform((value) => value.toLowerCase()),
  password: passwordSchema,
});

export const signupSchema = loginSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long.')
    .max(80, 'Name must be 80 characters or fewer.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
}).transform((data) => ({
  ...data,
  email: data.email.toLowerCase(),
}));

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required.'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
