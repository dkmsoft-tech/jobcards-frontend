// components/JobTable.tsx
'use client';

import React from 'react';
import { Job } from '../types';
import { useRouter } from 'next/navigation';

interface JobTableProps {
  jobs: Job[];
}

export default function JobTable({ jobs }: JobTableProps) {
  const router = useRouter();

  const handleRowClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' },
    tr: { cursor: 'pointer' },
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
      case 'Assigned': return '#17a2b8'; // Teal/Info Blue
      case 'Departed to Site': return '#007bff'; // Blue
      case 'On-Site': return '#6610f2'; // Indigo
      case 'Completed': return '#28a745'; // Green
      case 'On Hold': return '#6c757d'; // Grey
      default: return '#6c757d';
    }
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Reference #</th>
          <th style={styles.th}>Category</th>
          <th style={styles.th}>Address</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Date Logged</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job.id} onClick={() => handleRowClick(job.id)} style={styles.tr}>
            <td style={styles.td}>{job.referenceNumber || `ID: ${job.id}`}</td>
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