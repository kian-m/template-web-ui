'use client';

import { Toaster as Sonner } from 'sonner';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from '@/lib/toast';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Handle escape key to dismiss all toasts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toast.dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="top-center"
      closeButton
      toastOptions={{
        closeButton: true,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-900/95 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700 group-[.toaster]:min-w-[400px] group-[.toaster]:p-4 group-[.toaster]:text-base group-[.toaster]:rounded-lg',
          closeButton: '!bg-transparent !border-0 !shadow-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 !p-0 !h-auto !w-auto',
          description: 'group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400',
          actionButton:
            'group-[.toast]:bg-blue-600 group-[.toast]:text-white hover:group-[.toast]:bg-blue-700',
          cancelButton:
            'group-[.toast]:bg-gray-200 group-[.toast]:text-gray-600 hover:group-[.toast]:bg-gray-300 dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-gray-300 dark:hover:group-[.toast]:bg-gray-600',
          success:
            'group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 group-[.toaster]:!border-green-200 dark:group-[.toaster]:!bg-green-950/30 dark:group-[.toaster]:!text-green-100 dark:group-[.toaster]:!border-green-800/40',
          error:
            'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-200 dark:group-[.toaster]:!bg-red-950/30 dark:group-[.toaster]:!text-red-100 dark:group-[.toaster]:!border-red-800/40',
          warning:
            'group-[.toaster]:!bg-yellow-50 group-[.toaster]:!text-yellow-900 group-[.toaster]:!border-yellow-200 dark:group-[.toaster]:!bg-yellow-950/30 dark:group-[.toaster]:!text-yellow-100 dark:group-[.toaster]:!border-yellow-800/40',
          info: 'group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900 group-[.toaster]:!border-blue-200 dark:group-[.toaster]:!bg-blue-950/30 dark:group-[.toaster]:!text-blue-100 dark:group-[.toaster]:!border-blue-800/40',
        },
      }}
      icons={{
        success: <CheckCircle className="h-5 w-5" />,
        error: <AlertTriangle className="h-5 w-5" />,
        warning: <AlertCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
