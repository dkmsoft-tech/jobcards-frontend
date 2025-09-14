// app/jobs/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/Toolbar';
import { useAuth } from '../../AuthContext';
import { useRouter } from 'next/navigation';

// Define types for our data models
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
    const router = useRouter();

    // State for the form inputs
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundProperty, setFoundProperty] = useState<Property | null>(null);
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [description, setDescription] = useState('');
    
    // State for UI feedback
    const [searchMessage, setSearchMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    // Effect to fetch job categories when the page loads
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

    // Function to handle the phone number search
    const handleSearch = async () => {
        // ... (this function remains the same as before)
    };

    // --- NEW: Function to handle form submission ---
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitMessage('Creating job...');

        // Find the full category object from the selected name
        const selectedCategory = categories.find(c => c.name === selectedCategoryName);

        if (!selectedCategory) {
            setSubmitMessage('Error: Please select a valid category.');
            return;
        }
        if (!foundProperty) {
            setSubmitMessage('Error: Please find a property before creating a job.');
            return;
        }

        const jobData = {
            propertyId: foundProperty.id,
            jobCategoryId: selectedCategory.id,
            description: description,
            // Title is now optional on the backend, the category can be used instead
        };

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                alert('Job created successfully!');
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                setSubmitMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setSubmitMessage('A network error occurred.');
        }
    };

    // Styling object
    const styles: { [key: string]: React.CSSProperties } = {
        // ... (styles remain the same)
    };

    return (
        <div style={styles.pageContainer}>
            <Toolbar />
            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <h1>Capture New Job</h1>
                    {/* Use the new handleSubmit function for the form */}
                    <form onSubmit={handleSubmit}>
                        {/* Phone Number Lookup section remains the same */}
                        <div style={styles.formGroup}>
                           {/* ... phone input and search button ... */}
                        </div>

                        {foundProperty && (
                           {/* ... property details display ... */}
                        )}
                        <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />

                        {/* --- Job Details Section --- */}
                        <div style={styles.formGroup}>
                            <label htmlFor="category">Category</label>
                            <input
                                list="category-options"
                                id="category"
                                style={styles.input}
                                placeholder="Type to search categories..."
                                value={selectedCategoryName}
                                onChange={(e) => setSelectedCategoryName(e.target.value)}
                                required
                            />
                            <datalist id="category-options">
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name} />
                                ))}
                            </datalist>
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="description">Full Description</label>
                            <textarea 
                                id="description" 
                                style={styles.textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        
                        {submitMessage && <p>{submitMessage}</p>}
                        <button type="submit" style={styles.createButton}>Create Job</button>
                    </form>
                </div>
            </main>
        </div>
    );
}