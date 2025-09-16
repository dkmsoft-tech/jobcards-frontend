// app/auth/callback/page.tsx
'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../AuthContext';

function CallbackProcessor() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            // Use router.replace for a cleaner redirect that doesn't
            // keep the callback page in the browser's history.
            router.replace('/dashboard');
        } else {
            console.error("No token found in callback URL");
            router.replace('/'); // Redirect to login page on error
        }
    }, [searchParams, router, login]);
    
    // While processing, this component renders nothing.
    return null;
}

export default function AuthCallbackPage() {
    const styles = {
        loadingContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'sans-serif',
            color: '#333'
        }
    };
    
    // Wrap the processor in a Suspense boundary
    return (
        <Suspense fallback={<div style={styles.loadingContainer}><p>Authenticating, please wait...</p></div>}>
            <CallbackProcessor />
        </Suspense>
    );
}