"use client";
import { useState } from "react";
import { registerUser, checkUsernameAvailability, checkEmailAvailability } from "@/services/authService";
import Link from "next/link";
import { Roboto } from "next/font/google";
import debounce from 'lodash/debounce';
import { useRouter } from "next/navigation";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: true,
    message: ""
  });
  const [emailStatus, setEmailStatus] = useState({
    checking: false,
    available: true,
    message: "",
  });

  const getValidationIcon = (type) => {
    const icons = {
      error: '🚫',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✨'
    };
    return icons[type] || icons.info;
  };

  // Updated debounced username check function
  const debouncedCheckUsername = debounce(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "⚠️ Username must be at least 3 characters"
      });
      return;
    }
  
    setUsernameStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const result = await checkUsernameAvailability(username);
      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.message
      });
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "⚠️ Error checking username"
      });
    }
  }, 500);
  
  // Updated email check function
  const debouncedCheckEmail = debounce(async (email) => {
    if (!email || !validateEmail(email)) {
      setEmailStatus({
        checking: false,
        available: false,
        message: "⚠️ Please enter a valid Gmail address"
      });
      return;
    }

    setEmailStatus({ checking: true, available: false, message: "Checking..." });

    try {
      const result = await checkEmailAvailability(email);
      setEmailStatus({
        checking: false,
        available: result.available,
        message: result.message,
      });
    } catch (error) {
      setEmailStatus({
        checking: false,
        available: false,
        message: "⚠️ Error checking email",
      });
    }
  }, 500);

  const validateUsername = (username) => {
    const minLength = 3;
    const maxLength = 30;
    const usernameRegex = /^[a-zA-Z0-9._]+$/;

    if (username.length < minLength) {
      return { isValid: false, message: `Username must be at least ${minLength} characters long` };
    }
    if (username.length > maxLength) {
      return { isValid: false, message: `Username cannot exceed ${maxLength} characters` };
    }
    if (!usernameRegex.test(username)) {
      return { isValid: false, message: "Username can only contain letters, numbers, dots and underscores" };
    }

    return { isValid: true, message: "" };
  };

  const validatePassword = (password) => {
    const minLength = 8;
    
    if (password.length < minLength) {
      return { isValid: false, message: `Password must be at least ${minLength} characters long` };
    }
    if (password.length > 64) {
      return { isValid: false, message: "Password cannot exceed 64 characters" };
    }
    
    return { isValid: true, message: "" };
  };

  // Updated handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      if (value.trim()) {
        debouncedCheckEmail(value.trim());
      } else {
        setEmailStatus({
          checking: false,
          available: false,
          message: "",
        });
      }
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
    
    if (name === 'username') {
      const validation = validateUsername(value);
      if (!validation.isValid) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: "Username must be 3-30 characters long and can only contain letters, numbers, dots (.) and underscores (_)"
        });
      } else if (value.trim()) {
        debouncedCheckUsername(value.trim());
      } else {
        setUsernameStatus({
          checking: false,
          available: false,
          message: ""
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate username
    const usernameValidation = validateUsername(user.username);
    if (!usernameValidation.isValid) {
      setMessage({
        type: 'error',
        text: usernameValidation.message
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(user.password);
    if (!passwordValidation.isValid) {
      setMessage({
        type: 'error',
        text: passwordValidation.message
      });
      return;
    }

    if (!user.username.trim() || !email.trim() || !user.password.trim()) {
      setMessage("All fields are required");
      return;
    }

    try {
      await registerUser({ ...user, email });
      // Show success message
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to login page...'
      });

      // Clear form
      setUser({ username: "", password: "" });
      setEmail("");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message.replace(/[""{}]/g, '').replace('message:', '').trim()
      });
    }
  };

  const validateEmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const getMessageStyles = (type) => {
    const baseStyles = "mt-6 p-4 rounded-lg border backdrop-blur-sm animate-fadeIn";
    const variants = {
      error: "bg-red-50/90 text-red-800 border-red-200",
      warning: "bg-amber-50/90 text-amber-800 border-amber-200",
      info: "bg-blue-50/90 text-blue-800 border-blue-200",
      success: "bg-emerald-50/90 text-emerald-800 border-emerald-200"
    };
    return `${baseStyles} ${variants[type] || variants.error}`;
  };

  const formatErrorMessage = (message) => {
    // Remove emojis and clean up the message
    return message.replace(/[❌✅⚠️]/g, '').trim();
  };

  const getIconForMessage = (message) => {
    if (message.includes("❌")) return "error";
    if (message.includes("⚠️")) return "warning";
    if (message.includes("✅")) return "success";
    return "info";
  };

  const cleanMessage = (msg) => {
    // If msg is an object with a message property
    if (typeof msg === 'object' && msg.message) {
      msg = msg.message;
    }
    // Remove emojis, quotes, curly braces, and trim whitespace
    return msg.replace(/[❌✅⚠️]/g, '')
              .replace(/["{}]/g, '')
              .replace(/message:/i, '')
              .trim();
  };

  // Add this new helper function
  const getErrorMessage = (errorResponse) => {
    if (typeof errorResponse === 'string') {
      return errorResponse.replace(/[{}"]/g, '').replace('message:', '').trim();
    }
    if (errorResponse.message) {
      return errorResponse.message.replace(/[❌✅⚠️]/g, '').trim();
    }
    return 'An error occurred';
  };

  return (
    <div className={`min-h-screen h-screen fixed inset-0 overflow-hidden flex ${roboto.className}`}>
      <style jsx global>{`
        html, body { height: 100%; overflow: hidden; margin: 0; padding: 0; }
      `}</style>
      <div className="w-full h-full flex">
        {/* Left Welcome Section (70%) */}
        <div className="w-[70%] h-full relative p-12 flex flex-col bg-gradient-to-br from-emerald-800 via-teal-900 to-cyan-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative flex-grow z-10">
            <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 mb-12">
              <h2 className="text-5xl font-extrabold text-center mb-4">
                Join{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text animate-pulse">
                  ArtistryX
                </span>
                {" "}Today
              </h2>
              <p className="text-xl text-center text-teal-100 italic">
                Join the Future of Artist Management
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-4">
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-teal-50 flex items-center gap-3">
                  <span className="text-2xl">✨</span> Smart Management
                </h3>
                <p className="text-teal-200 ml-9">Advanced tools for modern artist management</p>
              </div>
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-teal-50 flex items-center gap-3">
                  <span className="text-2xl">🔒</span> Secure Account
                </h3>
                <p className="text-teal-200 ml-9">Your data is safe with us</p>
              </div>
              <div className="glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
                <h3 className="text-lg font-bold text-teal-50 flex items-center gap-3">
                  <span className="text-2xl">🚀</span> Instant Access
                </h3>
                <p className="text-teal-200 ml-9">Start managing artists right away</p>
              </div>
            </div>
          </div>

          {/* Developer credit */}
          <div className="relative z-10 mt-auto text-center">
            <p className="text-teal-200">
              Developed by{" "}
              <a href="https://github.com/vivekjdm" target="_blank" rel="noopener noreferrer" 
                 className="font-bold text-white hover:text-teal-300 transition-colors">
                Vivek J Dhamanemath
              </a>
            </p>
          </div>
        </div>

        {/* Register Form Section */}
        <div className="w-[30%] h-full flex items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              {/* Add Logo - matching login page */}
              <div className="flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="ArtistryX Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <p className="mt-2 text-gray-600">Create your account to get started</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={user.username}
                  onChange={handleChange}
                  className={`w-full px-1 py-2 border-b-2 transition-colors bg-transparent placeholder-gray-400 text-gray-800 focus:outline-none
                    ${usernameStatus.checking ? 'border-yellow-300' : 
                      usernameStatus.available ? 'border-gray-300 focus:border-teal-500' : 
                      'border-red-400 focus:border-red-500'}`}
                />
                {/* Show username validation message only when there's an error */}
                {user.username && !usernameStatus.available && (
                  <div className={`mt-1 text-sm ${usernameStatus.checking ? 'text-yellow-600' : 'text-red-500'}`}>
                    {usernameStatus.checking ? 
                      "Checking availability..." : 
                      usernameStatus.message
                    }
                  </div>
                )}
              </div>
              <div className="relative">
                <input 
                  type="email"
                  name="email"
                  placeholder="Gmail address"
                  value={email}
                  onChange={handleChange}
                  className={`w-full px-1 py-2 border-b-2 transition-colors bg-transparent placeholder-gray-400 text-gray-800 focus:outline-none
                    ${emailStatus.checking ? 'border-yellow-300' : 
                      emailStatus.available ? 'border-gray-300 focus:border-teal-500' : 
                      'border-red-400 focus:border-red-500'}`}
                />
                {email && !emailStatus.available && (
                  <div className={`absolute -bottom-6 left-0 text-sm transition-all ${
                    emailStatus.checking ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    {emailStatus.checking ? (
                      <span>Checking email...</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {emailStatus.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <input 
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full px-1 py-2 border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none transition-colors bg-transparent placeholder-gray-400 text-gray-800"
                />
                {/* Show password validation message only when there's an error */}
                {user.password && user.password.length < 8 && (
                  <div className="mt-1 text-sm text-red-500">
                    Password must be at least 8 characters long
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transform transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign Up
            </button>

            {message && (
              <div className={`mt-6 p-4 rounded-lg border backdrop-blur-sm animate-fadeIn ${
                message.type === 'success' 
                  ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50/90 text-red-800 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Already have an account?</span>
                </div>
              </div>
              <Link 
                href="/login" 
                className="block w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 font-medium"
              >
                Sign In Instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
