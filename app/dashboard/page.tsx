// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Toolbar from '../../components/Toolbar';
import StatCard from '../../components/StatCard';
import JobTable from '../../components/JobTable';
import { Job } from '../../types';

export default function Dashboard() {
  const { token, logout, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.push('/');
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 403 || response.status === 401) logout();
          throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
        }
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err) {
        // --- THIS IS THE FIX ---
        // We check if 'err' is an instance of Error before using its message property.
        if (err instanceof Error) {
          console.error("Error fetching jobs:", err);
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchJobs();
  }, [token, router, logout, loading]);

  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(job => job.status === 'Pending').length;
  const onSiteJobs = jobs.filter(job => job.status === 'On-Site').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const styles: { [key: string]: React.CSSProperties } = {
    dashboardContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
    mainContent: { flex: 1, padding: '20px', boxSizing: 'border-box', overflowY: 'auto' },
    statsContainer: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' },
    jobListContainer: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    jobListHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    createJobButton: { padding: '10px 20px', fontSize: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' },
    errorText: { color: 'red', fontWeight: 'bold' }
  };
  
  if (loading) {
      return <p>Loading...</p>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <Toolbar />
      <main style={styles.mainContent}>
        <h1>Dashboard</h1>
        <div style={styles.statsContainer}>
          <StatCard title="Total" value={totalJobs} />
          <StatCard title="Pending" value={pendingJobs} />
          <StatCard title="On Site" value={onSiteJobs} />
          <StatCard title="Completed" value={completedJobs} />
        </div>
        <div style={styles.jobListContainer}>
          <div style={styles.jobListHeader}>
            <h2>Recent Jobs</h2>
            <Link href="/jobs/new" style={styles.createJobButton}>Create New Job</Link>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          {jobs.length > 0 ? (
            <JobTable jobs={jobs} />
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </main>
    </div>
  );
}