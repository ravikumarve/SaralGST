import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { storageManager } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan,
    } = body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Generate HMAC token for session
    const hmacSecret = process.env.HMAC_SECRET!;
    const tier = plan === 'individual' ? 'paid' : 'ca_firm';
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month expiry

    const token = crypto
      .createHmac('sha256', hmacSecret)
      .update(`${razorpay_payment_id}:${tier}:${expiresAt.toISOString()}`)
      .digest('hex');

    // Return token and details
    return NextResponse.json({
      success: true,
      token,
      tier,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
