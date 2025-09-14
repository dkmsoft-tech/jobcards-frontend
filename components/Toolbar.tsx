// components/Toolbar.tsx
'use client';

import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation

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
      gap: '20px',
      boxSizing: 'border-box'
    },
    logo: {
      marginRight: '20px'
    },
    menuItems: {
      display: 'flex',
      gap: '20px',
      flexGrow: 1
    },
    menuItem: {
      cursor: 'pointer',
      padding: '5px 10px',
      textDecoration: 'none',
      color: 'inherit'
    }
  };

  return (
    <div style={styles.toolbar}>
      <div style={styles.logo}>
        <Image
          src="/dkm-logo.png"
          alt="DKM Logo"
          width={40}
          height={40}
        />
      </div>
      <div style={styles.menuItems}>
        <Link href="/jobs/new" style={styles.menuItem}><b>File</b></Link>
        <div style={styles.menuItem}><b>View</b></div>
        <div style={styles.menuItem} onClick={handleLogout}><b>Logout</b></div>
      </div>
    </div>
  );
}