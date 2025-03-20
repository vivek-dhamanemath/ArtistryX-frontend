"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [confirmationStatus, setConfirmationStatus] = useState('pending');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        console.log('No session ID found, skipping confirmation');
        setConfirmationStatus('skipped');
        return;
      }
      
      try {
        console.log('Attempting to confirm payment with session ID:', sessionId);
        
        // Try Spring Boot backend confirmation first
        try {
          const response = await fetch(`http://localhost:8081/payments/confirm-payment?sessionId=${sessionId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add a reasonable timeout
            signal: AbortSignal.timeout(5000)
          });

          if (response.ok) {
            console.log('Payment confirmed successfully with backend');
            setConfirmationStatus('confirmed');
          } else {
            console.warn('Backend returned error status:', response.status);
            setConfirmationStatus('backend-error');
            
            // Still consider it a success for the user
            console.log('Proceeding with success flow despite backend error');
          }
        } catch (backendError) {
          console.error('Error connecting to backend:', backendError);
          setConfirmationStatus('connection-error');
          
          // Still proceed with success for user experience
          console.log('Proceeding with success flow despite connection error');
        }
        
        // Store transaction locally as backup
        try {
          localStorage.setItem('lastSuccessfulPayment', JSON.stringify({
            sessionId,
            timestamp: new Date().toISOString(),
            success: true
          }));
        } catch (storageError) {
          console.error('Error storing transaction locally:', storageError);
        }
      } catch (error) {
        console.error('General payment confirmation error:', error);
        setConfirmationStatus('failed');
      }
    };

    confirmPayment();

    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/home');
    }, 5000);

    setLoading(false);

    return () => clearTimeout(timeout);
  }, [router, sessionId]);

  return (
    <div className="h-screen fixed inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 max-w-md w-full text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Payment Successful!</h1>
        <div className="bg-green-500/20 p-2 rounded-lg mb-4">
          <p className="text-green-300 text-sm">TEST MODE: No actual payment was processed</p>
        </div>
        <p className="text-gray-300 mb-6">Thank you for subscribing to ArtistryX premium plan!</p>
        <p className="text-gray-400 mb-8">You will be redirected to the home page in a few seconds...</p>
        <Link
          href="/home"
          className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-white px-6 py-3 rounded-full"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
