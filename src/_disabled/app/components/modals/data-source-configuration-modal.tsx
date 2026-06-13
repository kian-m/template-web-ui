'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Settings, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/app/store/root-store';

interface DataSourceConfigurationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export default function DataSourceConfigurationModal({
  isOpen,
  onClose,
  canClose = false,
}: DataSourceConfigurationModalProps) {
  const router = useRouter();
  const { isDataSourceConfigured } = useAppStore();
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleConfigureDataSource = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/settings');
    });
  };

  const handleSkipForNow = () => {
    if (canClose && onClose) {
      onClose();
    }
  };

  // Check if user already has a data source configured
  const hasDataSource = isDataSourceConfigured();

  if (hasDataSource && canClose) {
    // Auto-close if data source is configured and modal can be closed
    setTimeout(() => {
      if (onClose) onClose();
    }, 100);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="relative border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connect Your Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Required to access your dashboard
              </p>
            </div>
          </div>

          {canClose && (
            <button
              onClick={handleSkipForNow}
              className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Warning Message */}
            <div className="flex items-start space-x-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/50 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Data Source Required
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300/80">
                  To use Debark.AI's analytics features, you need to connect at least one data
                  source. This allows us to generate insights and visualizations from your data.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                What you'll get:
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Automated dashboard generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>AI-powered insights and recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Custom reports and alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Real-time data visualization</span>
                </li>
              </ul>
            </div>

            {/* Supported Data Sources */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Supported Data Sources:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
                      <span className="text-xs font-bold text-white">PH</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">PostHog</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Product analytics & feature flags
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-100 dark:text-green-800">
                    Available
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3 opacity-50 dark:border-gray-600 dark:bg-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-400 dark:bg-gray-600">
                      <span className="text-xs font-bold text-white">GA</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Google Analytics
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Web analytics & user behavior
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-100 dark:text-gray-600">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 border-t border-gray-200 p-4 dark:border-gray-700">
          <Button
            onClick={handleConfigureDataSource}
            disabled={isAnimating}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {isAnimating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Opening Settings...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Configure Data Source
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {canClose && (
            <Button
              onClick={handleSkipForNow}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Skip for now
            </Button>
          )}

          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Your data stays secure and is only used for generating insights
          </p>
        </div>
      </div>
    </div>
  );
}
