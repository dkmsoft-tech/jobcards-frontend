// app/layout.tsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import { Inter } from 'next/font/google'; // 1. Import the font
import './globals.css'

// 2. Initialize the font with the 'latin' subset
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jobcards DKM',
  description: 'Jobcard Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 3. Apply the font's className to the body */}
      <body className={inter.className}> 
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}