// src/app/dashboard/layout.tsx
import type { ReactNode } from 'react';
import DashboardLayout from '@/app/components/dashboard/layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
