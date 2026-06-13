'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/toast';
import { decodeDashboardShare } from '@/app/lib/dashboard-share';
import { useAppStore } from '@/app/store/root-store';
import { dashboardApi } from '@/app/services/dashboard-api';
import { widgetApi } from '@/app/services/widget-api';
import { useRouter } from 'next/navigation';

interface AddSharedDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSharedDashboardModal({ isOpen, onClose }: AddSharedDashboardModalProps) {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addDashboard, addWidget, setActiveDashboard } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const decoded = decodeDashboardShare(code.trim());
    if (!decoded) {
      toast.error('Invalid dashboard code', { event: 'invalid_dashboard_code' });
      return;
    }
    setIsSubmitting(true);
    try {
      const createRes = await dashboardApi.createDashboard(decoded.name);
      const dashboardId = createRes.data?.dashboardId as string | undefined;
      if (!dashboardId) throw new Error('No dashboard id returned');
      addDashboard(dashboardId, decoded.name);
      setActiveDashboard(dashboardId);
      router.push(`/dashboard/${dashboardId}`);

      for (const w of decoded.widgets) {
        try {
          const createRes = await widgetApi.create(dashboardId, {
            type: w.type,
            title: w.title,
            size: 'small',
            query: w.query,
          });
          const widgetId = createRes.data?.widgetId as string | undefined;
          if (!widgetId) continue;
          const refreshRes = await widgetApi.refresh(widgetId);
          const data = refreshRes.data?.data || {};
          addWidget(dashboardId, {
            id: widgetId,
            type: w.type,
            title: w.title,
            size: 'small',
            query: w.query,
            data,
          });
        } catch (err) {
          console.error('Failed to add widget from shared dashboard', err);
        }
      }
      toast.success('Dashboard added from share');
      setCode('');
      onClose();
    } catch (err) {
      console.error('Failed to add shared dashboard', err);
      toast.error('Failed to add shared dashboard', {
        event: 'shared_dashboard_add_fail',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-lg font-bold">Add Dashboard from Share</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <Label htmlFor="code">Paste share code</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the dashboard code here"
              className="mt-1"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? 'Adding...' : 'Add Dashboard'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
