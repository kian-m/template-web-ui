// PostHog development events for tracking code changes and development velocity

interface DevelopmentEvent {
  event: string;
  properties: Record<string, any>;
}

const POSTHOG_KEY = 'phc_uMZrC3rnOvMCRlgGWuLkCPTkjZXgat6ifxVQki40Hhn';
const POSTHOG_HOST = 'https://us.i.posthog.com';

/**
 * Send development-related events to PostHog
 * Used for tracking code changes, feature implementations, and development patterns
 */
export async function sendDevelopmentEvent(
  eventName: string,
  properties: Record<string, any>
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const payload = {
    api_key: POSTHOG_KEY,
    event: eventName,
    properties: {
      ...properties,
      timestamp,
      tool: 'claude-code',
      project: 'debark',
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp,
    distinct_id: 'claude-code-tool',
  };

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Failed to send PostHog development event:', error);
  }
}

/**
 * Track feature implementation
 */
export function trackFeatureImplementation(
  featureName: string,
  details: Record<string, any> = {}
) {
  return sendDevelopmentEvent('feature_implemented', {
    feature: featureName,
    ...details,
  });
}

/**
 * Track bug fix
 */
export function trackBugFix(
  bugDescription: string,
  filesAffected: string[],
  details: Record<string, any> = {}
) {
  return sendDevelopmentEvent('bug_fixed', {
    description: bugDescription,
    files_affected: filesAffected,
    file_count: filesAffected.length,
    ...details,
  });
}

/**
 * Track refactoring
 */
export function trackRefactoring(
  component: string,
  reason: string,
  details: Record<string, any> = {}
) {
  return sendDevelopmentEvent('code_refactored', {
    component,
    reason,
    ...details,
  });
}

/**
 * Track test creation/update
 */
export function trackTestUpdate(
  testFile: string,
  testType: 'unit' | 'integration' | 'e2e',
  action: 'created' | 'updated' | 'fixed',
  details: Record<string, any> = {}
) {
  return sendDevelopmentEvent('test_updated', {
    test_file: testFile,
    test_type: testType,
    action,
    ...details,
  });
}

/**
 * Track major architectural changes
 */
export function trackArchitecturalChange(
  description: string,
  impact: 'low' | 'medium' | 'high',
  details: Record<string, any> = {}
) {
  return sendDevelopmentEvent('architectural_change', {
    description,
    impact,
    ...details,
  });
}

/**
 * Track performance improvements
 */
export function trackPerformanceImprovement(
  area: string,
  improvement: string,
  metrics?: Record<string, any>
) {
  return sendDevelopmentEvent('performance_improved', {
    area,
    improvement,
    metrics,
  });
}

/**
 * Track dependency updates
 */
export function trackDependencyUpdate(
  packageName: string,
  fromVersion: string,
  toVersion: string,
  updateType: 'major' | 'minor' | 'patch'
) {
  return sendDevelopmentEvent('dependency_updated', {
    package: packageName,
    from_version: fromVersion,
    to_version: toVersion,
    update_type: updateType,
  });
}