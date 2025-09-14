// app/jobs/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../AuthContext';
import Toolbar from '../../../../components/Toolbar';
import { Job } from '../../../../types'; // We need a more detailed Job type
import { useRouter } from 'next/navigation';

// A more detailed Property interface for this page
interface PropertyDetails {
    accountHolder: string;
    accountNumber: string;
    erfNumber: string;
    streetAddress: string;
    suburb: string;
    ward: string;
    cellNumber: string;
    cellNumber2: string;
    isIndigent: boolean;
    inArrears: boolean;
}

// A more detailed Job interface that includes the full Property
interface DetailedJob extends Job {
    Property: PropertyDetails | null;
    description: string;
    complainantPhoneNumber: string;
    creator: { name: string; } | null;
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
    const { token } = useAuth();
    const router = useRouter();
    const [job, setJob] = useState<DetailedJob | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (!token) {
            router.push('/');
            return;
        }

        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`/api/jobs/${params.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data);
            } catch (err) {
                setError('Could not load job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [token, params.id, router]);

    const styles: { [key: string]: React.CSSProperties } = {
        pageContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
        mainContent: { flex: 1, padding: '20px', overflowY: 'auto' },
        card: { backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
        sectionTitle: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', gridColumn: '1 / -1' },
        detailItem: { marginBottom: '10px' },
        label: { fontWeight: 'bold', display: 'block' },
    };

    if (loading) return <p>Loading job details...</p>;
    if (error) return <p>{error}</p>;
    if (!job) return <p>Job not found.</p>;

    return (
        <div style={styles.pageContainer}>
            <Toolbar />
            <main style={styles.mainContent}>
                <div style={styles.card}>
                    <h1>Job Details: {job.referenceNumber}</h1>
                    <div style={styles.grid}>
                        <h2 style={styles.sectionTitle}>Job Information</h2>
                        <div style={styles.detailItem}><span style={styles.label}>Category:</span> {job.JobCategory?.name}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Status:</span> {job.status}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Date Logged:</span> {new Date(job.createdAt).toLocaleString()}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Logged By:</span> {job.creator?.name}</div>
                        <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><span style={styles.label}>Description:</span> {job.description}</div>
                        
                        <h2 style={styles.sectionTitle}>Property Information</h2>
                        <div style={styles.detailItem}><span style={styles.label}>Account Holder:</span> {job.Property?.accountHolder}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Account Number:</span> {job.Property?.accountNumber}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Address:</span> {job.Property?.streetAddress}</div>
                        <div style={styles.detailItem}><span style={styles.label}>ERF Number:</span> {job.Property?.erfNumber}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Ward:</span> {job.Property?.ward}</div>
                        
                        <h2 style={styles.sectionTitle}>Contact Information</h2>
                        <div style={styles.detailItem}><span style={styles.label}>Property Cellphone:</span> {job.Property?.cellNumber}</div>
                        <div style={styles.detailItem}><span style={styles.label}>Complainant Cellphone:</span> {job.complainantPhoneNumber || 'N/A'}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}