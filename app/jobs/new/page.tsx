// app/jobs/new/page.tsx
'use client';

import React from 'react';
import Toolbar from '../../../components/Toolbar'; // Adjust path for nested folder

export default function NewJobPage() {
    const styles: { [key: string]: React.CSSProperties } = {
        pageContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f7f6' },
        mainContent: { flex: 1, padding: '20px' },
        formContainer: { backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px' },
        button: { padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    };

    return (
        <div style={styles.pageContainer}>
            <Toolbar />
            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <h1>Capture New Job</h1>
                    <form>
                        <div style={styles.formGroup}>
                            <label htmlFor="title">Title / Short Description</label>
                            <input type="text" id="title" style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="category">Category</label>
                            <select id="category" style={styles.input}>
                                <option>-- Select a Category --</option>
                                {/* We will load categories from the API later */}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="property">Property / Location</label>
                            <input type="text" id="property" placeholder="Search by address or account number..." style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="description">Full Description</label>
                            <textarea id="description" style={styles.textarea}></textarea>
                        </div>
                        <button type="submit" style={styles.button}>Create Job</button>
                    </form>
                </div>
            </main>
        </div>
    );
}