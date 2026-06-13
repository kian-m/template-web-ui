// app/lib/types.ts

export interface NumberMetric {
  value: number;
  change: number;
  isPositive: boolean;
}

export interface DataPoint {
  name: string;
  value: number;
}

export interface Performer {
  id: string;
  name: string;
  revenue: number;
  conversions: number;
  status: 'active' | 'pending' | 'inactive';
}

export interface DashboardData {
  totalUsers: NumberMetric;
  conversionRate: NumberMetric;
  revenueTrend: DataPoint[];
  monthlySignups: DataPoint[];
  topPerformers: Performer[];
}
