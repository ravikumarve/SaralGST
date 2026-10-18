import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Simple in-memory order-minting guard: max 10 orders/hour per IP.
// Prevents anonymous abuse of the Razorpay order API without blocking
// the anonymous upgrade funnel (no login required to pay).
const orderAttempts = new Map<string, { count: number; windowStart: number }>();
const ORDER_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = orderAttempts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    orderAttempts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > ORDER_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many order attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await request.json();
    const { plan } = body;

    // Validate plan
    if (!plan || !['individual', 'ca_firm'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Set amount based on plan
    const amount = plan === 'individual' ? 49900 : 199900; // in paise (₹499 = 49900, ₹1999 = 199900)

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `saralgst_${Date.now()}`,
      notes: {
        plan: plan,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
