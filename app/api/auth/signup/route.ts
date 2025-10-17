import { hash } from 'bcryptjs';
import { NextResponse, type NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { applyRateLimit, secondsUntil } from '@/lib/rate-limit';
import { createVerificationToken } from '@/lib/auth/email';
import { signupSchema } from '@/lib/validations/auth';

const SIGNUP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SIGNUP_ATTEMPT_LIMIT = 5;

function extractClientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return request.ip ?? undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => undefined);

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? 'Invalid sign-up details provided.' },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const clientIdentifier = extractClientIdentifier(request) ?? email;
    const rateLimit = applyRateLimit({
      key: `signup:${clientIdentifier}:${email}`,
      limit: SIGNUP_ATTEMPT_LIMIT,
      windowMs: SIGNUP_WINDOW_MS,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many sign-up attempts. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': secondsUntil(rateLimit.reset).toString(),
          },
        }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const { token, expires } = await createVerificationToken(existingUser.email);

        return NextResponse.json(
          {
            message:
              'An account with this email is pending verification. A fresh verification link has been generated.',
            verificationToken: token,
            expiresAt: expires.toISOString(),
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
      },
    });

    const { token, expires } = await createVerificationToken(user.email);

    return NextResponse.json(
      {
        message: 'Account created successfully. Please verify your email to continue.',
        verificationToken: token,
        expiresAt: expires.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during sign-up:', error);

    return NextResponse.json(
      { error: 'Something went wrong while creating your account. Please try again.' },
      { status: 500 }
    );
  }
}
