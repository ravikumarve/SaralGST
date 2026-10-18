import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // HMAC_SECRET is mandatory — fail closed rather than sign with garbage
    if (!process.env.HMAC_SECRET) {
      console.error('HMAC_SECRET not configured - cannot issue session tokens');
      return NextResponse.json(
        { error: 'Server token signing not configured' },
        { status: 500 }
      );
    }

    // Generate HMAC token for backend session auth
    // Format MUST match backend services/tokens.py verify_token():
    //   "{hmac_hex}:{payment_id}:{tier}:{expires_at_iso}"
    const tier = plan === 'individual' ? 'paid' : 'ca_firm';
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month expiry
    const expiresIso = expiresAt.toISOString();

    const payload = `${razorpay_payment_id}:${tier}:${expiresIso}`;
    const tokenHmac = crypto
      .createHmac('sha256', process.env.HMAC_SECRET)
      .update(payload)
      .digest('hex');

    // Return token and details
    return NextResponse.json({
      success: true,
      token: `${tokenHmac}:${payload}`,
      tier,
      expires_at: expiresIso,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
