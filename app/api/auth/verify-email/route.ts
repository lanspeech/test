import { NextResponse, type NextRequest } from 'next/server';

import { verifyEmailToken } from '@/lib/auth/email';
import { applyRateLimit, secondsUntil } from '@/lib/rate-limit';
import { verifyEmailSchema } from '@/lib/validations/auth';

const VERIFY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const VERIFY_ATTEMPT_LIMIT = 10;

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
    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? 'A verification token is required.' },
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    const clientIdentifier = extractClientIdentifier(request) ?? 'unknown';
    const rateLimit = applyRateLimit({
      key: `verify:${clientIdentifier}`,
      limit: VERIFY_ATTEMPT_LIMIT,
      windowMs: VERIFY_WINDOW_MS,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many verification attempts. Please try again soon.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': secondsUntil(rateLimit.reset).toString(),
          },
        }
      );
    }

    const result = await verifyEmailToken(token);

    return NextResponse.json(
      {
        message: result.message,
        success: result.success,
      },
      { status: result.success ? 200 : 400 }
    );
  } catch (error) {
    console.error('Error verifying email:', error);

    return NextResponse.json(
      { error: 'Unable to verify email at this time. Please try again later.' },
      { status: 500 }
    );
  }
}
