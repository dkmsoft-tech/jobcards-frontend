// types/index.ts

// Basic user information
export interface User {
  id: number;
  name: string;
  role: 'Technician' | 'Call Centre Agent' | 'Department Admin' | 'System Admin' | 'Director' | 'Councillor';
}

// Full property details
export interface PropertyDetails {
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

// Basic Job for the dashboard list
export interface Job {
  id: number;
  referenceNumber: string | null;
  status: 'Pending' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: {
    streetAddress: string;
  } | null;
  JobCategory: {
    name: string;
  } | null;
}

// A more detailed Job interface for the details page
export interface DetailedJob extends Job {
  description: string;
  complainantPhoneNumber: string;
  creator: { name: string; } | null;
  technician: { name: string; } | null;
  Property: PropertyDetails | null;
}