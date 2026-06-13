import { StateCreator } from 'zustand';

export interface PosthogConfig {
  apiKey: string;
  projectId: string;
}

export interface DataSourceConfig {
  posthog?: PosthogConfig;
}

export interface SettingsSlice {
  dataSources: DataSourceConfig;
  userDataSheetId?: string;
  isDataSourceConfigured: () => boolean;
  posthogConfigured: boolean;
  remainingCredits: number;
  setRemainingCredits: (credits: number) => void;
  setPosthogConfigured: (configured: boolean) => void;
  setPosthogConfig: (config: PosthogConfig) => void;
  removePosthogConfig: () => void;
  validatePosthogConfig: (config: PosthogConfig) => { isValid: boolean; errors: string[] };
  setUserDataSheetId: (id: string) => void;
}

// PostHog API key validation
const validatePosthogApiKey = (apiKey: string): boolean => {
  // PostHog API keys typically start with 'phc_' and are 32+ characters
  return /^ph[c|x]_[a-zA-Z0-9_-]{30,}$/.test(apiKey);
};

//masking before saving
export const maskApiKey = (apiKey?: string) => {
  if (!apiKey) return apiKey || '';
  if (apiKey.length <= 8) return apiKey;
  return apiKey.substring(0, 8) + '•'.repeat(Math.max(apiKey.length - 8, 12));
};

// Project ID validation
const validatePosthogProjectId = (projectId: string): boolean => {
  // PostHog project IDs are typically numeric strings
  return /^\d+$/.test(projectId);
};

export const createSettingsSlice = (
  set: (partial: Partial<SettingsSlice> | ((state: SettingsSlice) => void)) => void,
  get: () => SettingsSlice,
): SettingsSlice => ({
  dataSources: {},
  userDataSheetId: undefined,
  posthogConfigured: false,
  remainingCredits: 0,

  isDataSourceConfigured: () => {
    if (get().posthogConfigured) {
      return true;
    }

    const { dataSources } = get();
    const { posthog } = dataSources;

    if (posthog) {
      const validation = get().validatePosthogConfig(posthog);
      return validation.isValid;
    }

    return false;
  },

  setPosthogConfigured: (configured: boolean) => set({ posthogConfigured: configured }),
  setRemainingCredits: (credits: number) => set({ remainingCredits: credits }),
  setUserDataSheetId: (id: string) => set({ userDataSheetId: id.trim() }),

  validatePosthogConfig: (config: PosthogConfig) => {
    const errors: string[] = [];

    if (!config.apiKey) {
      errors.push('API Key is required');
    } else if (!validatePosthogApiKey(config.apiKey)) {
      errors.push('Invalid API Key format (should start with "phc_")');
    }

    if (!config.projectId) {
      errors.push('Project ID is required');
    } else if (!validatePosthogProjectId(config.projectId)) {
      errors.push('Invalid Project ID format (should be numeric)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  setPosthogConfig: (config: PosthogConfig) => {
    const validation = get().validatePosthogConfig(config);

    if (!validation.isValid) {
      throw new Error(`Invalid PostHog configuration: ${validation.errors.join(', ')}`);
    }

    set((state) => ({
      dataSources: {
        ...state.dataSources,
        posthog: { ...config },
      },
    }));
  },

  removePosthogConfig: () => {
    set((state) => {
      const { posthog, ...restDataSources } = state.dataSources;
      return {
        dataSources: restDataSources,
      };
    });
  },
});
