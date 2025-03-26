
import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

export interface ActivityItem {
  id: number;
  type: "upload" | "download" | "edit" | "share" | "website";
  title: string;
  description: string;
  date: string;
  icon?: ReactNode;
  timestamp?: Timestamp; 
  filePath?: string; // Path to the file in Firebase Storage
}
