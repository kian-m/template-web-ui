import { apiClient } from './api-client';
import { checkCredentials as check_posthog, updateCredentials as update_posthog } from '@/client';
import { getAuthHeaders } from './token-cache';

export const posthogApi = {
  checkPosthog: async () => {
    const headers = await getAuthHeaders();
    const res = await check_posthog({
      client: apiClient,
      ...(headers ? { headers } : {}),
    });
    return (res.data ?? { isValid: false }) as { isValid: boolean };
  },
  updatePosthog: async (apiKey: string, projectId: string) => {
    const headers = await getAuthHeaders();
    return update_posthog({
      client: apiClient,
      body: {
        posthogApiKey: apiKey,
        posthogProjectId: projectId,
      },
      ...(headers ? { headers } : {}),
    });
  },
};
