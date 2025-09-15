// app/jobs/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/Toolbar';
import { useAuth } from '../../AuthContext';
import { useRouter } from 'next/navigation';

// Interfaces for our data models
interface Property {
  id: number;
  accountNumber: string;
  accountHolder: string;
  erfNumber: string;
  streetAddress: string;
  suburb: string;
  ward: string;
  cellNumber: string;
  cellNumber2: string;
  isIndigent: boolean;
  meterNumberElectricity: string | null;
  meterNumberWater: string | null;
  inArrears: boolean | null;
}
interface JobCategory { id: number; name: string; }

export default function NewJobPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [lookupQuery, setLookupQuery] = useState('');
    const [complainantName, setComplainantName] = useState(''); // New state for name
    const [complainantPhoneNumber, setComplainantPhoneNumber] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [searchResults, setSearchResults] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [searchMessage, setSearchMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

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
        if (!lookupQuery || !token) return;
        setSearchMessage('Searching...');
        setSearchResults([]);
        setSelectedProperty(null);
        try {
            const response = await fetch(`/api/properties/lookup?query=${lookupQuery}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data: Property[] = await response.json();
                setSearchResults(data);
                setSearchMessage(data.length > 0 ? `${data.length} result(s) found.` : 'No results found.');
            } else {
                const errorData = await response.json();
                setSearchMessage(errorData.message || 'Search failed.');
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search network error:", error);
            setSearchMessage('A network error occurred during search.');
        }
    };

    const handleSelectProperty = (property: Property) => {
        setSelectedProperty(property);
        // Pre-fill fields with the property owner's details
        setComplainantName(property.accountHolder);
        setComplainantPhoneNumber(property.cellNumber);
        setStep(2);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitMessage('Creating job...');
        const selectedCategory = categories.find(c => c.name === selectedCategoryName);
        if (!selectedCategory || !selectedProperty) {
            setSubmitMessage('Error: A property and category must be selected.');
            return;
        }
        const jobData = {
            propertyId: selectedProperty.id,
            jobCategoryId: selectedCategory.id,
            description: description,
            complainantName: complainantName, // Send the name to the backend
            complainantPhoneNumber: complainantPhoneNumber,
        };
        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(jobData)
            });
            if (response.ok) {
                alert('Job created successfully!');
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                setSubmitMessage(`Error creating job: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error creating job:", error);
            setSubmitMessage('A network error occurred while creating the job.');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
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
        resultsContainer: { marginTop: '10px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' },
        resultItem: { padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        selectButton: { padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer' },
        propertyInfo: { marginTop: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9' },
        propertyDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
        statusTag: { fontWeight: 'bold', color: 'white', padding: '2px 8px', borderRadius: '4px' },
        backButton: { backgroundColor: '#6c757d', marginRight: '10px' }
    };

    return (
        <div style={styles.pageContainer}>
            <Toolbar />
            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    {step === 1 && (
                        <div>
                            <h1>Step 1: Find Property</h1>
                            <div style={styles.formGroup}>
                                <label htmlFor="lookup">Lookup by Phone, ERF, Address, or Account No.</label>
                                <div style={styles.searchContainer}>
                                    <input
                                        type="text"
                                        id="lookup"
                                        style={{...styles.input, flex: 1}}
                                        value={lookupQuery}
                                        onChange={(e) => setLookupQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button type="button" onClick={handleSearch} style={styles.button}>Lookup</button>
                                </div>
                            </div>
                            {searchMessage && <p>{searchMessage}</p>}
                            {searchResults.length > 0 && (
                                <div style={styles.resultsContainer}>
                                    {searchResults.map(prop => (
                                        <div key={prop.id} style={styles.resultItem}>
                                            <div>
                                                <strong>{prop.streetAddress}</strong><br/>
                                                <small>ERF: {prop.erfNumber} | Account: {prop.accountNumber}</small>
                                            </div>
                                            <button type="button" onClick={() => handleSelectProperty(prop)} style={styles.selectButton}>Select</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {step === 2 && selectedProperty && (
                        <div>
                            <h1>Step 2: Log Details</h1>
                            <div style={styles.propertyInfo}>
                                <h4>Selected Property</h4>
                                <div style={styles.propertyDetails}>
                                    <p><strong>Account Holder:</strong> {selectedProperty.accountHolder}</p>
                                    <p><strong>Address:</strong> {selectedProperty.streetAddress}, {selectedProperty.suburb}</p>
                                    <p><strong>ERF Number:</strong> {selectedProperty.erfNumber}</p>
                                    <p><strong>Ward:</strong> {selectedProperty.ward}</p>
                                </div>
                            </div>
                            <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="complainantName">Complainant&apos;s Name</label>
                                    <input
                                      type="text"
                                      id="complainantName"
                                      style={styles.input}
                                      value={complainantName}
                                      onChange={(e) => setComplainantName(e.target.value)}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="complainantPhone">Complainant&apos;s Phone Number</label>
                                    <input type="tel" id="complainantPhone" style={styles.input} value={complainantPhoneNumber} onChange={(e) => setComplainantPhoneNumber(e.target.value)} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="category">Category</label>
                                    <input list="category-options" id="category" style={styles.input} placeholder="Type to search categories..." value={selectedCategoryName} onChange={(e) => setSelectedCategoryName(e.target.value)} required />
                                    <datalist id="category-options">
                                        {categories.map(cat => ( <option key={cat.id} value={cat.name} /> ))}
                                    </datalist>
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="description">Full Description</label>
                                    <textarea id="description" style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </div>
                                {submitMessage && <p>{submitMessage}</p>}
                                <div>
                                    <button type="button" onClick={() => setStep(1)} style={{...styles.button, ...styles.backButton}}>Back</button>
                                    <button type="submit" style={styles.createButton}>Create Job</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}