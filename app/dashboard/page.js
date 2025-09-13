// app/dashboard/page.js
'use client';

import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to login page after logout
  };

  // If there's no token, you can optionally redirect or show a message
  if (!token) {
    // In a real app, we'd use a proper protected route component
    return <p>You are not logged in. Redirecting...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}