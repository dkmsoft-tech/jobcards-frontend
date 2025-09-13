// app/page.js
'use client'; // This directive tells Next.js this is a client-side component

import { useState } from 'react';

export default function LoginPage() {
  // State variables to hold the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // This function is called when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('https://jobcards.dkm.gov.za/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // SUCCESS: In a real app, you'd save the token and redirect
        alert('Login Successful! Token: ' + data.token);
        // For example: localStorage.setItem('token', data.token);
        // window.location.href = '/dashboard';
      } else {
        // Handle server-side errors (e.g., wrong password)
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      // Handle network errors (e.g., API server is down)
      setError('A network error occurred. Please try again later.');
    }
  };

  // Basic styling for the component
  const styles = {
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