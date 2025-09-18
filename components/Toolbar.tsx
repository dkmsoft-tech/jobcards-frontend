// components/Toolbar.tsx
'use client';

import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Toolbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // The logout function in AuthContext will handle the redirect.
  };

  // Check if the current user has a role that is allowed to create jobs
  const canCreateJobs = user && ['System Admin', 'Department Admin', 'Call Centre Agent'].includes(user.role);

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
    },
    nonClickable: {
        cursor: 'default',
        padding: '5px 10px',
        color: '#6c757d'
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
        {/* This link is now only visible to users with permission */}
        {canCreateJobs && (
            <Link href="/jobs/new" style={styles.menuItem}><b>File</b></Link>
        )}
        <div style={styles.nonClickable}><b>View</b></div>
        <div style={styles.menuItem} onClick={handleLogout}><b>Logout</b></div>
      </div>
    </div>
  );
}