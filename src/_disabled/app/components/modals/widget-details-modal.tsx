'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WidgetDetailsModalProps {
  isOpen: boolean;
  widgetId: string;
  query: string;
  onSave: (q: string) => void;
  onClose: () => void;
}

export default function WidgetDetailsModal({
  isOpen,
  widgetId,
  query,
  onSave,
  onClose,
}: WidgetDetailsModalProps) {
  const [magicInput, setMagicInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const isViewOnly = widgetId === 'view';
  
  const handleMagicEdit = async () => {
    if (!magicInput.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSave(magicInput);
      setMagicInput('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isViewOnly ? 'Widget Query' : 'Magic Edit Widget'}
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Current Query:
            </label>
            <textarea
              value={query}
              readOnly
              className="h-32 w-full rounded-md border bg-gray-50 p-2 text-sm text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
            />
          </div>
          
          {!isViewOnly && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  What would you like to change?
                </label>
                <textarea
                  value={magicInput}
                  onChange={(e) => setMagicInput(e.target.value)}
                  placeholder="e.g., 'Show revenue for last 30 days instead' or 'Change to a bar chart showing top products'"
                  className="h-24 w-full rounded-md border border-gray-300 bg-white p-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  AI will modify this widget based on your description. You can change the query, title, or even the widget type.
                </p>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-2">
            {!isViewOnly && (
              <Button
                onClick={handleMagicEdit}
                disabled={!magicInput.trim() || isSubmitting}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmitting ? 'Processing...' : 'Magic Edit'}
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              {isViewOnly ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
