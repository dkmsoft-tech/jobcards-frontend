// app/auth/callback/page.tsx
'use client';

import React, { useEffect, Suspense } from 'react'; // 1. Import Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../AuthContext';

// 2. Create a new component to contain the client-side logic
function CallbackClientComponent() {
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
    
    // This component doesn't render anything itself, it just handles the logic
    return null;
}

export default function AuthCallbackPage() {
    const styles = {
        loadingContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }
    };
    
    // 3. Wrap the client component in a Suspense boundary
    return (
        <Suspense fallback={<div style={styles.loadingContainer}><p>Authenticating, please wait...</p></div>}>
            <CallbackClientComponent />
        </Suspense>
    );
}