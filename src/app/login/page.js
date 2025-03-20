"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { GoogleLogin } from '@react-oauth/google';

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const getValidationIcon = (type) => {
    const icons = {
      error: '🚫',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✨'
    };
    return icons[type] || icons.info;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    if (!credentials.username && !credentials.password) {
      setMessage({
        type: 'error',
        title: 'Authentication Required',
        text: 'Please provide your login credentials',
        icon: getValidationIcon('error')
      });
      return;
    }
  
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081'}/api/auth/login`;
      const payload = credentials;
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        data = {};
      }
  
      if (response.ok) {
        setMessage({
          type: 'success',
          title: 'Login Successful',
          text: 'Login Successful, redirecting...',
          icon: getValidationIcon('success')
        });
  
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
  
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        let errorMessage = data.message || "Login failed";
        setMessage({
          type: 'error',
          title: 'Login Failed',
          text: errorMessage,
          icon: getValidationIcon('error')
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: 'error',
        title: 'Login Failed',
        text: error.message || "An error occurred. Please try again.",
        icon: getValidationIcon('error')
      });
    }
  };
  

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: credentials.username, password: credentials.password }),
        headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        router.push('/dashboard');
    } else {
        alert(data.message);
    }
  };
  



  const handleGoogleLogin = async (response) => {
    console.log("Google Login Success:", response.credential);

    if (!response.credential) {
      setMessage({
        type: 'error',
        title: 'Google Login Failed',
        text: 'No credentials received from Google',
        icon: getValidationIcon('error')
      });
      return;
    }

    try {
      const googleLoginEndpoint = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081/api/auth';
      const res = await fetch(`${googleLoginEndpoint}/google-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          credential: response.credential
        })
      });

      const rawResponse = await res.text();
      console.log('Backend Response:', rawResponse);

      if (!res.ok) {
        throw new Error(rawResponse || 'Authentication failed');
      }

      const data = JSON.parse(rawResponse);

      if (!data.token) {
        throw new Error('Invalid authentication response');
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || 'user');
      localStorage.setItem("username", data.name || '');

      setMessage({
        type: 'success',
        title: 'Welcome!',
        text: 'Google login successful! Redirecting...',
        icon: getValidationIcon('success')
      });

      setTimeout(() => router.push("/home"), 1000);
    } catch (err) {
      console.error("Google login error:", err);
      setMessage({
        type: 'error',
        title: 'Google Login Failed',
        text: err.message || 'Could not sign in with Google',
        icon: getValidationIcon('error')
      });
    }
  };

  const GoogleLoginButton = () => {
    return (
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        onSuccess={handleGoogleLogin}
        onError={(error) => {
          console.error("Google Login Failed:", error);
          setMessage({
            type: 'error',
            title: 'Google Login Failed',
            text: 'Could not sign in with Google',
            icon: getValidationIcon('error')
          });
        }}
        useOneTap={false}
        cookiePolicy={'single_host_origin'}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Log in with google</span>
          </button>
        )}
      />
    );
  };

  return (
    <div className={`min-h-screen h-screen fixed inset-0 overflow-hidden flex ${roboto.className}`}>
      <style jsx global>{`
        html, body { height: 100%; overflow: hidden; margin: 0; padding: 0; }
      `}</style>
      <div className="w-full h-full flex">
        <div className="w-[70%] h-full relative p-12 flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative flex-grow z-10">
            <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 mb-12">
              <h2 className="text-5xl font-extrabold text-center mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text animate-pulse">
                  ArtistryX
                </span>
              </h2>
              <p className="text-xl text-center text-gray-200 italic">
                Where Talent Meets Management Excellence
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-4">
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">🚀</span> Efficient Management
                </h3>
                <p className="text-gray-300 ml-9">Manage your artists efficiently and effectively.</p>
              </div>
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">📊</span> Centralized Database
                </h3>
                <p className="text-gray-300 ml-9">Keep track of all your artists' details in one place.</p>
              </div>
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">⚡</span> Easy Operations
                </h3>
                <p className="text-gray-300 ml-9">Easily add, update, and remove artists as needed.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto text-center">
            <p className="text-gray-300">
              Developed by{" "}
              <a href="https://github.com/vivekjdm" target="_blank" rel="noopener noreferrer"
                 className="font-bold text-white hover:text-blue-300 transition-colors">
                Vivek J Dhamanemath
              </a>
            </p>
          </div>
        </div>

        <div className="w-[30%] h-full flex items-center justify-center p-8 bg-white overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="ArtistryX Logo"
                  className="h-12 w-auto"
                />
              </div>
              <p className="mt-2 text-gray-600">Welcome back! Please enter your details</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full px-1 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent placeholder-gray-400 text-gray-800"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-1 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent placeholder-gray-400 text-gray-800"
                />
              </div>
              {message && (
                <p className={`mt-2 text-center text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'} font-medium`}>
                  {message.title}: {message.text}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transform transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>

              <div className="w-full flex justify-center">
                <GoogleLoginButton />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-gray-600">
                Forgot your password?{" "}
                <Link href="/reset" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                  Reset
                </Link>
              </p>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Don't have an account?</span>
                </div>
              </div>
              <Link
                href="/register"
                className="block w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
