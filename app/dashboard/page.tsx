// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Toolbar from '../../components/Toolbar'; // Import Toolbar
import StatCard from '../../components/StatCard'; // Import StatCard

// Define a type for our Job object for type safety
interface Job {
  id: number;
  title: string;
  status: 'Pending' | 'On-Site' | 'Completed' | 'On Hold';
  // Add other job properties as needed
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]); // State to hold the list of jobs

  // This effect runs once when the component mounts to fetch jobs
  useEffect(() => {
    // We can't fetch data if we're not logged in
    if (!token) {
      router.push('/');
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs', {
          headers: {
            // This is a protected route, so we must send our token
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // If the token is invalid (e.g., expired), log out the user
          if (response.status === 403 || response.status === 401) {
            logout();
            router.push('/');
          }
          throw new Error('Failed to fetch jobs');
        }
        
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [token, router, logout]); // Dependencies for the effect

  // Calculate stats from the jobs list
  const pendingJobs = jobs.filter(job => job.status === 'Pending').length;
  const onSiteJobs = jobs.filter(job => job.status === 'On-Site').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const styles: { [key: string]: React.CSSProperties } = {
    dashboardContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
    mainContent: { flex: 1, padding: '20px' },
    statsContainer: { display: 'flex', gap: '20px', marginBottom: '20px' },
    jobListContainer: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  };

  return (
    <div style={styles.dashboardContainer}>
      <Toolbar />
      <main style={styles.mainContent}>
        <h1>Dashboard</h1>
        <div style={styles.statsContainer}>
          <StatCard title="Pending" value={pendingJobs} />
          <StatCard title="On Site" value={onSiteJobs} />
          <StatCard title="Completed" value={completedJobs} />
        </div>
        <div style={styles.jobListContainer}>
          <h2>Recent Jobs</h2>
          {/* We'll build a proper table here later */}
          {jobs.length > 0 ? (
            <ul>
              {jobs.map(job => <li key={job.id}>{job.title} - <i>{job.status}</i></li>)}
            </ul>
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </main>
    </div>
  );
}