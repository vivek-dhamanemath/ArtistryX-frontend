"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');

  // Set the amount based on the plan price
  useEffect(() => {
    if (price) {
      // Convert dollars to cents for Stripe
      setAmount(parseInt(price) * 100);
    }
  }, [price]);

  useEffect(() => {
    // Get user info from localStorage
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user.id || '');
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Show loading indicator (could add a state variable for this)
      console.log('Processing payment...', { email, plan, price, userId });

      let sessionUrl = "";

      try {
        // First try the Spring Boot backend
        console.log('Attempting to connect to Spring backend...');
        const backendResponse = await fetch(`http://localhost:8081/payments/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email, amount, currency: 'USD', productName: plan })
        });

        if (backendResponse.ok) {
          sessionUrl = await backendResponse.text();
          console.log('Spring backend response:', sessionUrl);
        } else {
          console.warn('Spring backend returned an error. Status:', backendResponse.status);
        }
      } catch (backendError) {
        console.error('Error connecting to Spring backend:', backendError);
      }

      // If the Spring Boot backend failed, fall back to our local API
      if (!sessionUrl || !sessionUrl.includes('stripe.com')) {
        console.log('Spring backend failed. Falling back to local API...');

        const localApiResponse = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            amount,
            planName: plan,
            priceUsd: price,
            userId
          }),
        });

        const data = await localApiResponse.json();
        sessionUrl = data.url;
        console.log('Local API response:', data);
      }

      if (sessionUrl && sessionUrl.includes('stripe.com')) {
        // Redirect to the Stripe checkout page
        window.location.href = sessionUrl;
      } else {
        console.error('Invalid session URL:', sessionUrl);
        alert('Unable to connect to the payment service. Please try again later.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert(`Payment processing failed: ${error.message}`);
    }
  };

  return (
    <div className="h-screen fixed inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* User Header Component and Back Button */}
      <div className="flex justify-between items-center px-6 py-4 w-full relative z-20">
        <Link href="/subscription" className="text-white flex items-center gap-2 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Plans
        </Link>
        <div className="flex items-center">
          <UserHeader />
        </div>
      </div>

      {/* Payment Content */}
      <div className="relative z-10 flex flex-col items-center pt-1 p-8 max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">
            Complete Your Purchase
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Order Summary</h2>
            <div className="flex justify-between text-gray-300 mb-2">
              <span>Plan:</span>
              <span className="font-medium capitalize">{plan || 'Unknown'} Plan</span>
            </div>
            <div className="flex justify-between text-gray-300 border-t border-gray-700 pt-2">
              <span>Total:</span>
              <span className="font-bold text-white">${price || '0'}/month</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <input
              type="hidden"
              value={amount}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 hover:from-blue-500 hover:via-pink-500 hover:to-purple-400 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Pay Now
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300 mb-2 font-medium">💳 Test Card Details:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>Card number: <span className="text-white">4242 4242 4242 4242</span></li>
              <li>Exp: <span className="text-white">Any future date</span></li>
              <li>CVC: <span className="text-white">Any 3 digits</span></li>
              <li>Name/Address: <span className="text-white">Any values</span></li>
            </ul>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            This is a test mode. No actual charges will be made.
          </p>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Your payment will be processed securely via Stripe. We do not store your payment information.
          </p>
        </div>
      </div>
    </div>
  );
}
