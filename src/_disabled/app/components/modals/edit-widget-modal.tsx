'use client';

import { useEffect, useState } from 'react';
import { Wand2, X, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/app/store/root-store';
import type { Widget } from '@/app/store/dashboard-store';
import { widgetApi } from '@/app/services/widget-api';
import { toast } from '@/lib/toast';
import { usePostHog } from 'posthog-js/react';

const WIDGET_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

function highlightSQL(query: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escapeHtml(query).replace(/\b([A-Z]{2,})\b/g, '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>');
}

interface EditWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: Widget;
}

export default function EditWidgetModal({ isOpen, onClose, widget }: EditWidgetModalProps) {
  const [mounted, setMounted] = useState(false);
  const [magicInput, setMagicInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [size, setSize] = useState<Widget['size']>(widget.size);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [editedQuery, setEditedQuery] = useState(widget.query);
  const { activeDashboardId, updateWidget, setRemainingCredits } = useAppStore();
  const posthog = usePostHog();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset size and query when widget changes
  useEffect(() => {
    if (widget) {
      setSize(widget.size);
      setEditedQuery(widget.query);
      setIsEditingQuery(false);
    }
  }, [widget]);

  const handleMagicUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !magicInput.trim()) return;
    setIsSubmitting(true);
        // Show immediate feedback to user
    toast.success('Processing your request with AI magic...', {
      duration: 3000
    });
    
    try {
      const res = await widgetApi.edit(activeDashboardId, widget.id, magicInput);
      const data = res.data as any;
      
      if (data && data.widgets && data.widgets.length > 0) {
        const updatedWidget = data.widgets[0];
        
        // Update the widget with the AI-generated changes
        updateWidget(activeDashboardId, widget.id, {
          title: updatedWidget.title,
          query: updatedWidget.query,
          type: updatedWidget.type,
          size,
          data: updatedWidget.data,
        });
        
        // Update size separately if changed
        await widgetApi.updateWidget(widget.id, { size });
        
        if (size !== widget.size) {
          posthog?.capture('widget_size_updated', {
            widget_id: widget.id,
            dashboard_id: activeDashboardId,
            old_size: widget.size,
            new_size: size,
          });
        }
        
        // Update remaining credits if provided
        if (typeof data.remainingCredits === 'number') {
          setRemainingCredits(data.remainingCredits);
        }
        
        toast.success('Widget updated successfully with AI magic! ✨');
        posthog?.capture('widget_edited_ai', {
          widget_id: widget.id,
          dashboard_id: activeDashboardId,
          input: magicInput,
          size,
        });
        
        onClose();
        setMagicInput('');
      } else {
        const description = typeof data.reply === 'string' ? data.reply : undefined;
        toast.error('Failed to update widget', {
          description,
          event: 'widget_edit_failed',
        });
      }
    } catch (err) {
      console.error('Error updating widget:', err);
      toast.error('Failed to update widget. Please try again.', {
        event: 'widget_edit_failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSizeUpdate = async () => {
    if (size === widget.size) return;
    
    try {
      await widgetApi.updateWidget(widget.id, { size });
      updateWidget(activeDashboardId, widget.id, { size });
      
      toast.success('Widget size updated successfully');
      posthog?.capture('widget_size_updated', {
        widget_id: widget.id,
        dashboard_id: activeDashboardId,
        old_size: widget.size,
        new_size: size,
      });
      
      onClose();
    } catch (err) {
      console.error('Error updating widget size:', err);
      toast.error('Failed to update widget size');
    }
  };

  const handleCancel = () => {
    setMagicInput('');
    setSize(widget.size);
    setEditedQuery(widget.query);
    setIsEditingQuery(false);
    onClose();
  };

  const handleQueryUpdate = async () => {
    if (editedQuery === widget.query || !editedQuery.trim()) return;
    
    try {
      await widgetApi.updateWidget(widget.id, { query: editedQuery });
      updateWidget(activeDashboardId, widget.id, { query: editedQuery });
      
      toast.success('Widget query updated successfully');
      posthog?.capture('widget_query_updated', {
        widget_id: widget.id,
        dashboard_id: activeDashboardId,
      });
      
      setIsEditingQuery(false);
    } catch (err) {
      console.error('Error updating widget query:', err);
      toast.error('Failed to update widget query');
    }
  };

  if (!isOpen || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-lg font-bold">Edit Widget</h2>
          <button
            onClick={handleCancel}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Magic AI Update Section */}
          <form onSubmit={handleMagicUpdate} className="space-y-4">
            <div>
              <Label htmlFor="magic-input" className="mb-2 flex items-center gap-2">
                Edit:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="magic-input"
                  value={magicInput}
                  onChange={(e) => setMagicInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Allow Cmd+A / Ctrl+A for select all
                    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                      e.currentTarget.select();
                    }
                  }}
                  placeholder="Describe what you want to change about this widget..."
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400"
                  disabled={isSubmitting || !magicInput.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                AI will intelligently update the query and visualization based on your description
              </p>
            </div>
          </form>

          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            {/* Current Query Display */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="query">Current Query</Label>
                {!isEditingQuery ? (
                  <Button
                    onClick={() => setIsEditingQuery(true)}
                    className="h-7 px-2 py-1 text-xs bg-gray-600 text-white hover:bg-gray-700"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit Query
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleQueryUpdate}
                      disabled={editedQuery === widget.query || !editedQuery.trim()}
                      className="h-7 px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingQuery(false);
                        setEditedQuery(widget.query);
                      }}
                      className="h-7 px-2 py-1 text-xs bg-gray-600 text-white hover:bg-gray-700"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              {isEditingQuery ? (
                <textarea
                  value={editedQuery}
                  onChange={(e) => setEditedQuery(e.target.value)}
                  className="w-full mt-2 min-h-[150px] max-h-60 rounded-md bg-gray-100 dark:bg-gray-900 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter SQL query..."
                />
              ) : (
                <div
                  id="query"
                  className="mt-2 max-h-60 overflow-auto rounded-md bg-gray-100 p-3 font-mono text-sm dark:bg-gray-900"
                  dangerouslySetInnerHTML={{ __html: highlightSQL(editedQuery) }}
                />
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {isEditingQuery 
                  ? "Edit the SQL query directly. Changes will be applied immediately."
                  : "SQL keywords are highlighted. Click 'Edit Query' to modify manually or use AI magic above."}
              </p>
            </div>

            {/* Widget Size */}
            <div className="mt-4">
              <Label htmlFor="size">Widget Size</Label>
              <div className="mt-2 flex gap-2">
                <Select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value as Widget['size'])}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {WIDGET_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={handleSizeUpdate}
                  disabled={size === widget.size || isSubmitting}
                  className="bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400"
                >
                  Update Size
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}