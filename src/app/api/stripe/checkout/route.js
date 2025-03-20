import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
  try {
    console.log('Local API route called as fallback');
    // Use a test API key if the real one is not available
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51OmunbQ7VrDESE8xzuvd6JrsmyaoOLHVhbKqqXI5m2vWXZA8EB4kbQ3PhCuwOuWQ29R62zqnixpS1frfo4wuKcBP00N2TbNxYP';
    const stripe = new Stripe(stripeKey);
    
    // Parse the request body
    const body = await request.json();
    const { email, amount, planName, priceUsd, userId } = body;
    
    console.log('Creating Stripe checkout session locally:', { email, amount, planName, priceUsd, userId });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ArtistryX ${planName} Plan (TEST MODE)`,
              description: `${planName} subscription plan - $${priceUsd}/month (Test payment - no actual charge)`,
            },
            unit_amount: parseInt(amount),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription`,
      customer_email: email,
      metadata: {
        userId: userId || 'anonymous',
        planName: planName,
        planPrice: priceUsd
      },
    });

    console.log('Checkout session created locally:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Something went wrong with the payment processing' } },
      { status: 500 }
    );
  }
}
