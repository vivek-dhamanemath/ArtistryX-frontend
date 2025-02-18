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
        <GoogleOAuthProvider clientId="979081682205-24a4jjvat3enner3bvnvf4rmua8cs0rs.apps.googleusercontent.com">
          <div className="min-h-screen">
            {children}
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
