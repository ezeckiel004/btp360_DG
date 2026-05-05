export interface Project {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: 'ahead' | 'on_track' | 'behind';
  budgetStatus: 'ok' | 'warning' | 'alert';
}

export type ActivityType = 'payment' | 'task_start' | 'task_end' | 'report' | 'stock' | 'contract';

export interface GlobalActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PaymentRequest {
  id: string;
  tacheron: string;
  chantier: string;
  montant: number;
  date: string;
  status: 'pending' | 'approved';
}

export interface AuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  oldValue?: string;
  newValue?: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: 'PDF';
}

export enum Page {
  Dashboard = 'dashboard',
  Approvals = 'approvals',
  Reports = 'reports',
  Profile = 'profile',
}

export interface StockInfo {
  material: string;
  site: string;
  quantity: string;
  status: 'critical' | 'normal';
}
