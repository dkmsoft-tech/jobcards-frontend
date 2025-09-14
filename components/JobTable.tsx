// components/JobTable.tsx
'use client';

import React from 'react';

// Define the shape of the Job object this component expects
// It includes nested objects for related data
interface Job {
  id: number;
  referenceNumber: string; // <-- NEW
  status: 'Pending' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: { streetAddress: string; } | null;
  JobCategory: { name: string; } | null;
}
interface JobTableProps { jobs: Job[]; }


export default function JobTable({ jobs }: JobTableProps) {
  const styles: { [key: string]: React.CSSProperties } = {
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' },
    th: {
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '2px solid #e0e0e0',
      backgroundColor: '#f8f9fa'
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #e0e0e0'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      color: 'white',
      fontSize: '0.8rem',
      fontWeight: 'bold'
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Pending': return '#ffc107'; // Yellow
      case 'On-Site': return '#007bff'; // Blue
      case 'Completed': return '#28a745'; // Green
      case 'On Hold': return '#6c757d'; // Grey
      default: return '#6c757d';
    }
  };

return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Reference #</th> {/* Changed Header */}
          <th style={styles.th}>Category</th>
          <th style={styles.th}>Address</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Date Logged</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job.id}>
            {/* --- DISPLAY THE NEW REFERENCE NUMBER --- */}
            <td style={styles.td}>{job.referenceNumber || job.id}</td>
            <td style={styles.td}>{job.JobCategory?.name || 'N/A'}</td>
            <td style={styles.td}>{job.Property?.streetAddress || 'N/A'}</td>
            <td style={styles.td}>
              <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(job.status) }}>
                {job.status}
              </span>
            </td>
            <td style={styles.td}>{new Date(job.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}