// src/app/settings/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Edit2, ExternalLink, Eye, EyeOff, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PosthogConfig } from '@/app/store/settings-store';
import { useAppStore } from '@/app/store/root-store';
import { posthogApi } from '@/app/services/posthog-api';
import DashboardLayout from '@/app/components/dashboard/layout';
import { useGoogleSheetsAuth } from '@/app/context/google-sheets-auth';
import { upsertEncryptedKeys } from '@/app/services/sheets-browser';
import { deriveAesKeyFromString, encryptJsonWithAesGcm, decryptJsonWithAesGcm } from '@/app/services/crypto';

export default function SettingsPage() {
  const router = useRouter();
  const {
    dataSources,
    setPosthogConfig,
    removePosthogConfig,
    validatePosthogConfig,
    setPosthogConfigured,
    posthogConfigured,
  } = useAppStore();

  const [posthogForm, setPosthogForm] = useState<PosthogConfig>({
    apiKey: dataSources.posthog?.apiKey || '',
    projectId: dataSources.posthog?.projectId || '',
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const verifyConnection = useCallback(async () => {
    try {
      const res = await posthogApi.checkPosthog();
      setPosthogConfigured(res.isValid);
      console.log(res.isValid);
    } catch {
      setPosthogConfigured(false);
    }
  }, [setPosthogConfigured]);

  useEffect(() => {
    verifyConnection();
  }, [verifyConnection]);

  const handlePosthogSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors([]);

      try {
        const validation = validatePosthogConfig(posthogForm);

        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }

        if (!isSignedIn || !accessToken) {
          toast.error('Sign in with Google to save to your sheet');
          return;
        }
        if (!userSub) {
          toast.error('No Google user ID; please sign in');
          return;
        }
        const key = await deriveAesKeyFromString(userSub);
        const { cipherB64, ivB64 } = await encryptJsonWithAesGcm(key, {
          apiKey: posthogForm.apiKey,
          projectId: posthogForm.projectId,
        });
        await upsertEncryptedKeys({
          accessToken,
          spreadsheetId: (process.env.NEXT_PUBLIC_CONFIG_SHEETS_SPREADSHEET_ID || '').trim(),
          userKey: userSub,
          cipherB64,
          ivB64,
          sheetName: ((process.env.NEXT_PUBLIC_CONFIG_SHEETS_RANGE || 'Config!A:C').split('!')[0] || 'Config').trim(),
        });

        setPosthogConfig(posthogForm);
        setPosthogConfigured(true);
        toast.success('Saved to service account sheet');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save configuration';
        setErrors([errorMessage]);
        const event = errorMessage.toLowerCase().includes('invalid')
          ? 'invalid_ph_key'
          : 'settings_save_error';
        toast.error(errorMessage, { event });
      } finally {
        setIsLoading(false);
      }
    },
    [validatePosthogConfig, posthogForm, setPosthogConfig, isSignedIn, accessToken, userSub, sheetIdInput, defaultSheetId, sheetRangeInput, setPosthogConfigured],
  );

  const handleRemovePosthog = useCallback(() => {
    setPosthogForm({
      apiKey: '',
      projectId: '',
    });
    setPosthogConfigured(false);
  }, []);

  const maskApiKey = useCallback((apiKey: string | null) => {
    if (!apiKey) return '';
    if (apiKey.length <= 8) return apiKey;
    return apiKey.substring(0, 8) + '•'.repeat(Math.max(apiKey.length - 8, 12));
  }, []);

  const maskedCurrentApiKey = useMemo(
    () => maskApiKey(dataSources.posthog?.apiKey || ''),
    [maskApiKey, dataSources.posthog],
  );

  // Google Sheets via frontend token (GIS)
  const { isSignedIn, signIn, ensureSheetsToken, accessToken, userSub } = useGoogleSheetsAuth();
  const defaultSheetId = process.env.NEXT_PUBLIC_CONFIG_SHEETS_SPREADSHEET_ID || '';
  const [sheetIdInput, setSheetIdInput] = useState(defaultSheetId);
  const [sheetRangeInput, setSheetRangeInput] = useState('Config!A:B');
  const [sheetLoading, setSheetLoading] = useState(false);
  const loadFromSheet = useCallback(async () => {
    if (!accessToken) {
      await ensureSheetsToken();
      if (!accessToken) return; // will re-enter on next click if needed
    }
    setSheetLoading(true);
    try {
      if (!userSub) {
        toast.error('No Google user ID; please sign in');
        return;
      }
      const url = new URL(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent((process.env.NEXT_PUBLIC_CONFIG_SHEETS_SPREADSHEET_ID || '').trim())}/values/${encodeURIComponent(
          (process.env.NEXT_PUBLIC_CONFIG_SHEETS_RANGE || 'Config!A:C'),
        )}`,
      );
      url.searchParams.set('majorDimension', 'ROWS');
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!res.ok) throw new Error('Failed to read sheet');
      const json = (await res.json()) as { values?: string[][] };
      const rows = json.values || [];
      const row = rows.find((r) => (r?.[0] || '').trim() === userSub);
      if (!row) {
        toast.error('No entry found for your account; save your keys first.');
        return;
      }
      const cipherB64 = row[1];
      const ivB64 = row[2];
      const key = await deriveAesKeyFromString(userSub);
      const payload = await decryptJsonWithAesGcm<{ apiKey: string; projectId: string }>(key, cipherB64, ivB64);
      setPosthogConfig({ apiKey: payload.apiKey, projectId: payload.projectId });
      setPosthogConfigured(true);
      toast.success('Decrypted config from your Google Sheet');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load from Google Sheets');
    } finally {
      setSheetLoading(false);
    }
  }, [accessToken, sheetIdInput, sheetRangeInput, defaultSheetId, setPosthogConfig, setPosthogConfigured, signIn, userSub]);

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl p-6">
          <div className="space-y-8">
            {/* App Config Sheet (DB) via Google Sheets */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Config Sheet (DB)</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loads/saves your encrypted API keys in the sheet from env</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sheet ID (env): {process.env.NEXT_PUBLIC_CONFIG_SHEETS_SPREADSHEET_ID || 'not set'}</div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button onClick={loadFromSheet} disabled={sheetLoading} className="bg-blue-600 hover:bg-blue-700">
                  {sheetLoading ? 'Loading…' : 'Load keys from sheet'}
                </Button>
                {posthogConfigured && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">Current API Key: {maskedCurrentApiKey}</div>
                )}
              </div>
            </div>

            {/* My Data Sheet (for future persistence) */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Data Sheet</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">This sheet ID will be used later to persist your dashboards/widgets.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">My Data Sheet ID</label>
                  <Input value={dataSheetIdInput} onChange={(e) => setDataSheetIdInput(e.target.value)} placeholder="1abc..." className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button
                  onClick={() => {
                    useAppStore.getState().setUserDataSheetId(dataSheetIdInput);
                    toast.success('Saved data sheet ID');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save My Data Sheet ID
                </Button>
                {useAppStore.getState().userDataSheetId && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">Current: {useAppStore.getState().userDataSheetId}</div>
                )}
              </div>
            </div>
            {/* Data Sources Section */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Data Sources
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Configure your data sources to start analyzing your data with Debark.AI
              </p>

              {/* PostHog Configuration */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                      <span className="text-sm font-bold text-white">PH</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">PostHog</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Product analytics and feature flags
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {posthogConfigured && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-100 dark:text-green-800">
                        <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        Connected
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open('https://posthog.com/docs/getting-started/install', '_blank')
                      }
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <form onSubmit={handlePosthogSubmit} className="space-y-4">
                  {errors.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-500 dark:bg-red-900/30">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          Configuration Error
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-200">
                        {errors.map((error, index) => (
                          <li key={index} className="ml-6">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!posthogConfigured && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="posthog-api-key"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          API Key *
                        </label>
                        <div className="relative">
                          <Input
                            id="posthog-api-key"
                            type={showApiKey ? 'text' : 'password'}
                            value={posthogForm.apiKey}
                            onChange={(e) =>
                              setPosthogForm((prev) => ({ ...prev, apiKey: e.target.value }))
                            }
                            placeholder="ph..."
                            className="border-gray-300 bg-white pr-10 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          Find your API key in PostHog → Project Settings → API Keys
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="posthog-project-id"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Project ID *
                        </label>
                        <Input
                          id="posthog-project-id"
                          type="text"
                          value={posthogForm.projectId}
                          onChange={(e) =>
                            setPosthogForm((prev) => ({ ...prev, projectId: e.target.value }))
                          }
                          placeholder="12345"
                          className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          Find your Project ID in PostHog → Project Settings
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex space-x-3">
                      {!posthogConfigured && (
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Configuration
                            </>
                          )}
                        </Button>
                      )}

                      {posthogConfigured && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleRemovePosthog}
                          disabled={isLoading}
                          data-ph-event="settings_posthog_edit"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {posthogConfigured && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Current API Key: {maskedCurrentApiKey}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Future Data Sources Placeholder */}
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-100/50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="text-center">
                  <h3 className="mb-2 font-medium text-gray-600 dark:text-gray-400">
                    More Data Sources Coming Soon
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    We're working on integrations with Google Analytics, Mixpanel, Amplitude, and
                    more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
