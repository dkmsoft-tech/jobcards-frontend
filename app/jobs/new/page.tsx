// app/jobs/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/Toolbar';
import { useAuth } from '../../AuthContext';

// Define types for the data we'll be handling
interface Property {
  id: number;
  accountNumber: string;
  erfNumber: string;
  streetAddress: string;
  ward: string;
  isIndigent: boolean;
  meterNumberElectricity: string | null;
  meterNumberWater: string | null;
  inArrears: boolean | null;
}

interface JobCategory {
  id: number;
  name: string;
  visibility: 'Public' | 'Internal';
}

export default function NewJobPage() {
    const { token } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundProperty, setFoundProperty] = useState<Property | null>(null);
    const [searchMessage, setSearchMessage] = useState('');
    const [categories, setCategories] = useState<JobCategory[]>([]);

    // --- Fetch Job Categories on Page Load ---
    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) return;
            try {
                const response = await fetch('/api/categories', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data: JobCategory[] = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, [token]);

    const handleSearch = async () => {
        if (!phoneNumber || !token) return;
        setSearchMessage('Searching...');
        setFoundProperty(null);
        try {
            const response = await fetch(`/api/properties/lookup?phone=${phoneNumber}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data: Property = await response.json();
                setFoundProperty(data);
                setSearchMessage('');
            } else {
                const errorData = await response.json();
                setSearchMessage(errorData.message || 'Search failed.');
            }
        } catch (error) {
            setSearchMessage('A network error occurred during search.');
        }
    };

    const styles: { [key: string]: React.CSSProperties } = {
        pageContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
        mainContent: { flex: 1, padding: '20px', overflowY: 'auto' },
        formContainer: { backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px' },
        button: { padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        createButton: { padding: '8px 16px', fontSize: '0.9rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        searchContainer: { display: 'flex', gap: '10px', alignItems: 'center' },
        propertyInfo: { marginTop: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9' },
        propertyDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
        indigentStatus: { fontWeight: 'bold', color: 'white', padding: '2px 8px', borderRadius: '4px' },
    };

    return (
        <div style={styles.pageContainer}>
            <Toolbar />
            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <h1>Capture New Job</h1>
                    <form>
                        <div style={styles.formGroup}>
                            <label htmlFor="phone">Customer Phone Number</label>
                            <div style={styles.searchContainer}>
                                <input type="tel" id="phone" style={{...styles.input, flex: 1}} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <button type="button" onClick={handleSearch} style={styles.button}>Search</button>
                            </div>
                        </div>
                        {searchMessage && <p>{searchMessage}</p>}
                        {foundProperty && (
                            <div style={styles.propertyInfo}>
                                <h4>Property Details</h4>
                                <div style={styles.propertyDetails}>
                                    <p><strong>Account:</strong> {foundProperty.accountNumber}</p>
                                    <p><strong>ERF Number:</strong> {foundProperty.erfNumber}</p>
                                    <p><strong>Address:</strong> {foundProperty.streetAddress}</p>
                                    <p><strong>Ward:</strong> {foundProperty.ward}</p>
                                    <p><strong>Indigent: </strong>
                                        <span style={{...styles.indigentStatus, backgroundColor: foundProperty.isIndigent ? 'green' : 'red'}}>
                                            {foundProperty.isIndigent ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                    <p><strong>In Arrears: </strong>
                                        <span style={{...styles.indigentStatus, backgroundColor: foundProperty.inArrears ? 'red' : 'green'}}>
                                            {foundProperty.inArrears ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                    <p><strong>Elec Meter:</strong> {foundProperty.meterNumberElectricity || 'N/A'}</p>
                                    <p><strong>Water Meter:</strong> {foundProperty.meterNumberWater || 'N/A'}</p>
                                </div>
                            </div>
                        )}
                        <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />
                        <div style={styles.formGroup}>
                            <label htmlFor="category">Category</label>
                            <input
                                list="category-options"
                                id="category"
                                style={styles.input}
                                placeholder="Type to search categories..."
                            />
                            <datalist id="category-options">
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name} />
                                ))}
                            </datalist>
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="title">Title / Short Description</label>
                            <input type="text" id="title" style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="description">Full Description</label>
                            <textarea id="description" style={styles.textarea}></textarea>
                        </div>
                        <button type="submit" style={styles.createButton}>Create Job</button>
                    </form>
                </div>
            </main>
        </div>
    );
}