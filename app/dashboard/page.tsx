// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Toolbar from '../../components/Toolbar';
import StatCard from '../../components/StatCard';
import JobTable from '../../components/JobTable'; // 1. Import the new JobTable component

// 2. Define a more detailed Job interface to match the API response
interface Job {
  id: number;
  description: string;
  status: 'Pending' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: {
    streetAddress: string;
  } | null;
  JobCategory: {
    name: string;
  } | null;
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);

  // The useEffect hook for fetching jobs remains the same
  useEffect(() => {
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
          throw new Error('Failed to fetch jobs');
        }
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [token, router, logout]);

  // The logic for calculating stats remains the same
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(job => job.status === 'Pending').length;
  const onSiteJobs = jobs.filter(job => job.status === 'On-Site').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  // The styles object also remains the same
  const styles: { [key: string]: React.CSSProperties } = {
    dashboardContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
    mainContent: { flex: 1, padding: '20px', boxSizing: 'border-box', overflowY: 'auto' },
    statsContainer: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' },
    jobListContainer: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    jobListHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    createJobButton: { padding: '10px 20px', fontSize: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' },
  };

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
          {/* 3. Replace the simple list with our new JobTable component */}
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