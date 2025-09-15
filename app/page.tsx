// app/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    card: { display: 'flex', flexDirection: 'column', padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px', alignItems: 'center' },
    googleButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      gap: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Image src="/dkm-logo.png" alt="DKM Logo" width={100} height={100} style={{ marginBottom: '20px' }} />
        <h2>Jobcard Login</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Please sign in to continue.</p>
        <a href="https://jobcards.dkm.gov.za/api/auth/google" style={styles.googleButton}>
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            {/* This was the line with the typo. '</pATH>' is now '</path>' */}
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.526,44,30.852,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Sign in with Google</span>
        </a>
      </div>
    </div>
  );
}