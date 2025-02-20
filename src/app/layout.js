"use client";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <div className="min-h-screen">
            {children}
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
