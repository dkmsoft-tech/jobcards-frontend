// types/index.ts

export interface Job {
  id: number;
  referenceNumber: string | null; // Can be null for older jobs
  description: string;
  status: 'Pending' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: {
    streetAddress: string;
  } | null;
  JobCategory: {
    name: string;
  } | null;
}