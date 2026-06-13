'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/toast';
import { decodeWidgetShare } from '@/app/lib/widget-share';
import { useAppStore } from '@/app/store/root-store';
import { widgetApi } from '@/app/services/widget-api';
import type { Widget } from '@/app/store/dashboard-store';

interface AddSharedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSharedWidgetModal({ isOpen, onClose }: AddSharedWidgetModalProps) {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeDashboardId, addWidget } = useAppStore();
  const setRemainingCredits = useAppStore((s) => s.setRemainingCredits);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const decoded = decodeWidgetShare(code.trim());
    if (!decoded) {
      toast.error('Invalid widget code', { event: 'invalid_widget_code' });
      return;
    }
    setIsSubmitting(true);
    try {
      const createRes = await widgetApi.create(activeDashboardId, {
        type: decoded.type,
        title: decoded.title,
        size: 'small',
        query: decoded.query,
      });
      const widgetId = createRes.data?.widgetId as string | undefined;
      if (typeof createRes.data?.remainingCredits === 'number') {
        setRemainingCredits(createRes.data.remainingCredits);
      }
      if (!widgetId) throw new Error('No widget id returned');
      const refreshRes = await widgetApi.refresh(widgetId);
      const data = refreshRes.data?.data || {};
      const success = addWidget(activeDashboardId, {
        id: widgetId,
        type: decoded.type as Widget['type'],
        title: decoded.title,
        size: 'small',
        query: decoded.query,
        data,
      });
      if (!success) {
        toast.error('Maximum widgets reached for this dashboard', {
          event: 'max_widgets_dashboard',
        });
      } else {
        toast.success('Widget added from share');
        setCode('');
        onClose();
      }
    } catch (err) {
      console.error('Failed to add shared widget', err);
      toast.error('Failed to add shared widget', { event: 'shared_widget_add_fail' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-lg font-bold">Add Widget from Share</h2>
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
              placeholder="Paste the widget code here"
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
              {isSubmitting ? 'Adding...' : 'Add Widget'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
