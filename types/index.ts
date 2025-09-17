// types/index.ts

export interface User {
  id: number;
  name: string;
  role: 'Technician' | 'Call Centre Agent' | 'Department Admin' | 'System Admin' | 'Director' | 'Councillor';
}

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

export interface Job {
  id: number;
  referenceNumber: string | null;
  status: 'Pending' | 'Assigned' | 'Departed to Site' | 'On-Site' | 'Completed' | 'On Hold';
  createdAt: string;
  Property: {
    streetAddress: string;
  } | null;
  JobCategory: {
    name: string;
  } | null;
  technician: {
    id: number;
    name: string;
  } | null;
}

export interface DetailedJob extends Job {
  description: string;
  complainantPhoneNumber: string;
  complainantName: string;
  creator: { name: string; } | null;
  Property: PropertyDetails | null;
}