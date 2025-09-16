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
        console.log('CallbackProcessor: useEffect is running.'); // Checkpoint 1

        const token = searchParams.get('token');
        console.log('CallbackProcessor: Token from URL is:', token); // Checkpoint 2

        if (token) {
            console.log('CallbackProcessor: Token found. Calling login() and redirecting to /dashboard...'); // Checkpoint 3
            login(token);
            router.replace('/dashboard');
        } else {
            console.log('CallbackProcessor: No token found. Redirecting to login page...'); // Checkpoint 4
            router.replace('/');
        }
    }, [searchParams, router, login]);
    
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
    
    return (
        <Suspense fallback={<div style={styles.loadingContainer}><p>Authenticating, please wait...</p></div>}>
            <CallbackProcessor />
        </Suspense>
    );
}