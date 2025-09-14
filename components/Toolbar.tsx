// components/Toolbar.tsx
'use client';

import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 1. Import the Image component

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
      justifyContent: 'space-between' // 2. Add this to push items apart
    },
    menuItems: {
      display: 'flex',
      gap: '20px'
    },
    menuItem: {
      cursor: 'pointer',
      padding: '5px 10px',
    }
  };

  return (
    <div style={styles.toolbar}>
      <div style={styles.menuItems}>
        <div style={styles.menuItem}><b>File</b></div>
        <div style={styles.menuItem}><b>View</b></div>
        <div style={styles.menuItem} onClick={handleLogout}><b>Account</b></div>
      </div>
      
      {/* 3. Add the logo on the right side */}
      <Image
        src="/logo-dkm.png"
        alt="DKM Logo"
        width={40}
        height={40}
      />
    </div>
  );
}