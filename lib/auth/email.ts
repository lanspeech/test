import { randomBytes } from 'crypto';

import prisma from '@/lib/prisma';

export const VERIFICATION_TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

export type EmailVerificationResult = {
  success: boolean;
  message: string;
};

export async function createVerificationToken(email: string) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return { token, expires };
}

export async function verifyEmailToken(token: string): Promise<EmailVerificationResult> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return {
      success: false,
      message: 'Invalid or expired verification token.',
    };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });

    return {
      success: false,
      message: 'This verification link has expired. Please request a new one.',
    };
  }

  const user = await prisma.user.findUnique({ where: { email: record.identifier } });

  if (!user) {
    await prisma.verificationToken.delete({ where: { token } });

    return {
      success: false,
      message: 'No account is associated with this verification link.',
    };
  }

  if (user.emailVerified) {
    await prisma.verificationToken.delete({ where: { token } });

    return {
      success: true,
      message: 'Your email is already verified. You can sign in.',
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return {
    success: true,
    message: 'Email verified successfully. You can sign in now.',
  };
}
