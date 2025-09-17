// types/index.ts

// Defines the shape for a User, including Technicians
export interface User {
  id: number;
  name: string;
  role: 'Technician' | 'Call Centre Agent' | 'Department Admin' | 'System Admin' | 'Director' | 'Councillor';
}

// Defines the shape for Property details
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

// Defines the basic Job shape for the dashboard list
export interface Job {
  id: number;
  referenceNumber: string | null;
  status: 'Pending' | 'Departed to Site' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: {
    streetAddress: string;
  } | null;
  JobCategory: {
    name: string;
  } | null;
  // --- THIS IS THE FIX ---
  // Ensure the technician object includes the 'id'
  technician: {
    id: number;
    name: string;
  } | null;
}

// Extends the basic Job shape for the detailed view
export interface DetailedJob extends Job {
  description: string;
  complainantPhoneNumber: string;
  creator: { name: string; } | null;
  Property: PropertyDetails | null;
}