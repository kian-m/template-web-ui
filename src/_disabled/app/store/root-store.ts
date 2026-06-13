import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDashboardSlice, DashboardSlice } from './dashboard-store';
import { createSettingsSlice, SettingsSlice, maskApiKey } from './settings-store';

export interface AppStoreState extends DashboardSlice, SettingsSlice {}

export const useAppStore = create<AppStoreState>()(
  persist(
    immer((set, get) => ({
      ...createDashboardSlice(set, get),
      ...createSettingsSlice(set, get),
    })),
    {
      name: 'debark-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dashboards: state.dashboards,
        activeDashboardId: state.activeDashboardId,
        isNavigating: state.isNavigating,
        userDataSheetId: state.userDataSheetId,
        dataSources: {
          posthog: state.dataSources.posthog
            ? {
                apiKey: state.dataSources.posthog.apiKey
                  ? maskApiKey(state.dataSources.posthog.apiKey)
                  : undefined,
                projectId: state.dataSources.posthog.projectId,
              }
            : undefined,
        },
        posthogConfigured: state.posthogConfigured,
        remainingCredits: state.remainingCredits,
      }),
    },
  ),
);

// Clear the persisted "debark-store" from localStorage
export const clearAppStoreCache = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('debark-store');
  } catch (error) {
    console.error('Failed to clear persisted store', error);
  }
};
