// components/Toolbar.tsx
'use client';

import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';

export default function Toolbar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const styles: { [key: string]: React.CSSProperties } = {
    toolbar: {
      width: '100%',
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    menuItem: {
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '4px',
    },
    menuItemHover: {
        backgroundColor: '#f0f0f0'
    }
  };

  return (
    <div style={styles.toolbar}>
      <div style={styles.menuItem}><b>File</b></div>
      <div style={styles.menuItem}><b>View</b></div>
      <div style={styles.menuItem} onClick={handleLogout}><b>Account</b></div>
    </div>
  );
}