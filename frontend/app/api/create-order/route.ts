import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
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
