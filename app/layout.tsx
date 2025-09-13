// app/layout.tsx
import React from 'react'; // Import React
import { AuthProvider } from './AuthContext';

export const metadata = {
  title: 'Jobcards DKM',
  description: 'Jobcard Management System',
};

// Add the type definition for the 'children' prop
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}