'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/app/store/root-store';
import { fetchDashboards, dashboardApi } from '@/app/services/dashboard-api';

export default function DashboardIndexPage() {
  const router = useRouter();
  const syncDashboards = useAppStore((state) => state.syncDashboards);

  useEffect(() => {
    const initialize = async () => {
      // Check if dashboards are already in the store from layout or auth context
      let data = useAppStore.getState().dashboards;
      
      // Only fetch if not already loaded
      if (data.length === 0) {
        data = await fetchDashboards();
        
        // If still no dashboards, create one
        if (data.length === 0) {
          try {
            const res = await dashboardApi.createDashboard('Main Dashboard');
            if (res.data?.dashboardId) {
              data = await fetchDashboards();
            }
          } catch (err) {
            console.error('Failed to create dashboard', err);
          }
        }
        
        if (data.length > 0) {
          syncDashboards(data);
        }
      }
      
      // Navigate to first dashboard
      if (data.length > 0) {
        router.replace(`/dashboard/${data[0].id}`);
      }
    };
    initialize();
  }, [router, syncDashboards]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    </div>
  );
}
