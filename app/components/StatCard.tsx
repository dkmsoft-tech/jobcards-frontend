// components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
}

export default function StatCard({ title, value }: StatCardProps) {
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      flex: 1,
      minWidth: '150px',
      textAlign: 'center'
    },
    value: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#333'
    },
    title: {
      fontSize: '1rem',
      color: '#666'
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.value}>{value}</div>
      <div style={styles.title}>{title}</div>
    </div>
  );
}