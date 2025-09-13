// app/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => { // Add type for the event
    event.preventDefault();
    setError('');

    try {
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
      // Use the 'err' variable by logging it to the console
      console.error('An error occurred during login:', err);
      setError('A network error occurred.');
    }
  };

  // Styling (same as before)
  const styles: { [key: string]: React.CSSProperties } = { // Add type for styles
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    form: { display: 'flex', flexDirection: 'column', padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px' },
    input: { marginBottom: '15px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '15px' }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
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