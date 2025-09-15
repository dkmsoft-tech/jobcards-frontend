// app/auth/callback/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../AuthContext';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // We found a token in the URL. Save it and redirect.
            login(token);
            router.push('/dashboard');
        } else {
            // No token found, something went wrong. Redirect to login.
            router.push('/');
        }
    }, [searchParams, router, login]);
    
    // This page will just show a loading message while it processes
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <p>Authenticating, please wait...</p>
        </div>
    );
}