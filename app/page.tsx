// app/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import the Next.js Image component
import React from 'react'; // Import React for types

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      // NOTE: This fetch call targets your production domain.
      // For local development, you might switch between this and http://localhost:3001
      const response = await fetch('https://jobcards.dkm.gov.za/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed.');
      }
    } catch (err) {
      console.error('An error occurred during login:', err);
      setError('A network error occurred.');
    }
  };

  // Basic styling for the component with TypeScript types
  const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    form: { display: 'flex', flexDirection: 'column', padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px', alignItems: 'center' },
    input: { marginBottom: '15px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center' }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Image
          src="/logo-dkm.png"
          alt="DKM Logo"
          width={100}
          height={100}
          style={{ marginBottom: '20px' }}
        />
        <h2>Jobcard Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}