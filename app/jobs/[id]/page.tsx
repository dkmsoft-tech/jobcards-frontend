// app/jobs/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import Toolbar from '../../../components/Toolbar';
import { DetailedJob, User as Technician } from '../../../types';
import { useRouter } from 'next/navigation';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
    const { token, user } = useAuth();
    const router = useRouter();
    
    const [job, setJob] = useState<DetailedJob | null>(null);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [message, setMessage] = useState('');
    
    const fetchJobDetails = async () => {
        if (!token) return;
        try {
            const response = await fetch(`/api/jobs/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch job details');
            }
            const data = await response.json();
            setJob(data);
            if (data.technician) {
                setSelectedTechnician(data.technician.id);
            }
        } catch (err) {
            console.error("Error fetching details:", err);
            setError('Could not load job details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push('/');
            return;
        }

        const fetchTechs = async () => {
            if (!user || !['System Admin', 'Department Admin'].includes(user.role)) return;
            try {
                const response = await fetch('/api/users/technicians', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTechnicians(data);
                }
            } catch (err) {
                console.error("Error fetching technicians", err);
            }
        };

        fetchJobDetails();
        fetchTechs();
    }, [token, params.id, router, user]);

    const handleAssign = async () => {
        if (!selectedTechnician) {
            setMessage('Please select a technician.');
            return;
        }
        setMessage('Assigning...');
        try {
            const response = await fetch(`/api/jobs/${params.id}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ technicianId: selectedTechnician })
            });
            if (response.ok) {
                const updatedJob = await response.json();
                setJob(updatedJob);
                setMessage('Job assigned successfully!');
            } else {
                setMessage('Failed to assign job.');
            }
        } catch (error) {
            console.error("Assignment error:", error);
            setMessage('A network error occurred during assignment.');
        }
    };
    
    const handleStatusUpdate = async (newStatus: DetailedJob['status']) => {
        setMessage(`Updating status to "${newStatus}"...`);
        try {
            const response = await fetch(`/api/jobs/${params.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                const updatedJob = await response.json();
                setJob(updatedJob);
                setMessage('Status updated successfully!');
            } else {
                setMessage('Failed to update status.');
            }
        } catch (error) {
            console.error("Status update error:", error);
            setMessage('A network error occurred.');
        }
    };

    const styles: { [key: string]: React.CSSProperties } = {
        pageContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
        mainContent: { flex: 1, padding: '20px', overflowY: 'auto' },
        card: { backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
        sectionTitle: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', gridColumn: '1 / -1' },
        detailItem: { marginBottom: '10px' },
        label: { fontWeight: 'bold', display: 'block' },
        assignmentBox: { gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' },
        select: { padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
        button: { padding: '8px 16px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        technicianActions: { gridColumn: '1 / -1', display: 'flex', gap: '10px', flexWrap: 'wrap' },
        actionButton: { padding: '10px 20px', fontSize: '1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }
    };

    const isAdmin = user && ['System Admin', 'Department Admin'].includes(user.role);
    const isAssignedTechnician = user && job && job.technician?.id === user.id;

    if (loading) return <div style={styles.pageContainer}><Toolbar /><main style={styles.mainContent}><p>Loading job details...</p></main></div>;
    if (error) return <div style={styles.pageContainer}><Toolbar /><main style={styles.mainContent}><p>{error}</p></main></div>;
    if (!job) return <div style={styles.pageContainer}><Toolbar /><main style={styles.mainContent}><p>Job not found.</p></main></div>;
    
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
                        
                        <h2 style={styles.sectionTitle}>Assignment</h2>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Currently Assigned To:</span> 
                            {job.technician ? job.technician.name : 'Unassigned'}
                        </div>

                        {isAdmin && (
                            <div style={styles.assignmentBox}>
                                <label htmlFor="technician" style={{...styles.label, marginBottom: 0}}>Assign to:</label>
                                <select 
                                    id="technician" 
                                    style={styles.select} 
                                    value={selectedTechnician} 
                                    onChange={(e) => setSelectedTechnician(e.target.value)}
                                >
                                    <option value="">-- Select Technician --</option>
                                    {technicians.map(tech => (
                                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                                    ))}
                                </select>
                                <button onClick={handleAssign} style={styles.button}>Assign</button>
                            </div>
                        )}

                        {(isAdmin || isAssignedTechnician) && job.status !== 'Completed' && (
                            <>
                                <h2 style={styles.sectionTitle}>Technician Actions</h2>
                                <div style={styles.technicianActions}>
                                    <button onClick={() => handleStatusUpdate('Departed to Site')} style={{...styles.actionButton, backgroundColor: '#17a2b8'}}>Depart for Site</button>
                                    <button onClick={() => handleStatusUpdate('On-Site')} style={{...styles.actionButton, backgroundColor: '#007bff'}}>Arrive On Site</button>
                                    <button onClick={() => handleStatusUpdate('On Hold')} style={{...styles.actionButton, backgroundColor: '#6c757d'}}>Place On Hold</button>
                                    <button onClick={() => handleStatusUpdate('Completed')} style={{...styles.actionButton, backgroundColor: '#28a745'}}>Complete Job</button>
                                </div>
                            </>
                        )}
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </main>
        </div>
    );
}