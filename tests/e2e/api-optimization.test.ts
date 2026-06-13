import { test, expect } from '@playwright/test';

test.describe('Dashboard API Optimization', () => {
  let apiCalls: { method: string; url: string; timestamp: number }[] = [];

  test.beforeEach(async ({ page }) => {
    apiCalls = [];
    
    // Monitor all API calls
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      apiCalls.push({
        method: request.method(),
        url: request.url(),
        timestamp: Date.now()
      });
      await route.continue();
    });

    // Also monitor direct backend calls
    await page.route('**/dashboard/**', async (route) => {
      const request = route.request();
      if (request.url().includes('localhost:8080')) {
        apiCalls.push({
          method: request.method(),
          url: request.url(),
          timestamp: Date.now()
        });
      }
      await route.continue();
    });
  });

  test('should make minimal API calls on dashboard load', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to login
    const loginButton = page.locator('button:has-text("Login")').first();
    if (await loginButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Perform login if needed
      await loginButton.click();
      await page.waitForURL('**/dashboard/**', { timeout: 30000 });
    }
    
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard-content"], .widget-container, main', { 
      timeout: 10000 
    });
    
    // Give time for all initial requests to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Analyze API calls
    const dashboardListCalls = apiCalls.filter(call => 
      call.method === 'GET' && 
      call.url.match(/\/dashboard\/?$/)
    );
    
    const specificDashboardCalls = apiCalls.filter(call => 
      call.method === 'GET' && 
      call.url.match(/\/dashboard\/[a-zA-Z0-9-]+$/)
    );
    
    const widgetRefreshCalls = apiCalls.filter(call => 
      call.method === 'POST' && 
      call.url.includes('/widget') && 
      call.url.includes('/refresh')
    );
    
    // ASSERTIONS: Ensure optimal API usage
    
    // 1. Should only fetch dashboard list once
    expect(dashboardListCalls.length, 
      `Expected 1 dashboard list call, got ${dashboardListCalls.length}`
    ).toBeLessThanOrEqual(1);
    
    // 2. Should only fetch the current dashboard once
    expect(specificDashboardCalls.length,
      `Expected 1 specific dashboard call, got ${specificDashboardCalls.length}`
    ).toBe(1);
    
    // 3. Should not fetch other dashboards on initial load
    const uniqueDashboardIds = new Set(
      specificDashboardCalls.map(call => {
        const match = call.url.match(/\/dashboard\/([a-zA-Z0-9-]+)$/);
        return match ? match[1] : null;
      }).filter(Boolean)
    );
    
    expect(uniqueDashboardIds.size,
      `Expected only 1 unique dashboard to be fetched, got ${uniqueDashboardIds.size}`
    ).toBe(1);
    
    // Log the actual calls for debugging
    console.log('API Call Summary:');
    console.log(`- Dashboard list calls: ${dashboardListCalls.length}`);
    console.log(`- Specific dashboard calls: ${specificDashboardCalls.length}`);
    console.log(`- Unique dashboards fetched: ${uniqueDashboardIds.size}`);
    console.log(`- Widget refresh calls: ${widgetRefreshCalls.length}`);
  });

  test('should only refresh widgets for current dashboard', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Clear previous calls
    apiCalls = [];
    
    // Wait for widgets to load
    await page.waitForSelector('.widget-container', { timeout: 10000 });
    
    // Count widgets on current dashboard
    const widgetCount = await page.locator('.widget-container').count();
    
    // Wait for widget refreshes
    await page.waitForTimeout(3000);
    
    // Check widget refresh calls
    const widgetRefreshCalls = apiCalls.filter(call => 
      call.method === 'POST' && 
      call.url.includes('/widget') && 
      call.url.includes('/refresh')
    );
    
    // Should only refresh widgets that are actually displayed
    expect(widgetRefreshCalls.length,
      `Expected ${widgetCount} widget refresh calls, got ${widgetRefreshCalls.length}`
    ).toBeLessThanOrEqual(widgetCount);
    
    // Extract widget IDs from refresh calls
    const refreshedWidgetIds = new Set(
      widgetRefreshCalls.map(call => {
        const match = call.url.match(/\/widget\/([a-zA-Z0-9-]+)\/refresh/);
        return match ? match[1] : null;
      }).filter(Boolean)
    );
    
    // Each widget should only be refreshed once
    expect(refreshedWidgetIds.size,
      `Some widgets were refreshed multiple times`
    ).toBe(widgetRefreshCalls.length);
  });

  test('should not load other dashboards when switching', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Look for dashboard selector
    const dashboardSelector = page.locator('[aria-label="Dashboard selector"]').first();
    
    if (await dashboardSelector.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Clear calls before switching
      apiCalls = [];
      
      // Open dropdown
      await dashboardSelector.click();
      await page.waitForTimeout(500);
      
      // Select a different dashboard if available
      const dashboardOptions = page.locator('[role="menuitem"]');
      const optionCount = await dashboardOptions.count();
      
      if (optionCount > 1) {
        await dashboardOptions.nth(1).click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Check that only one dashboard was fetched
        const dashboardCalls = apiCalls.filter(call => 
          call.method === 'GET' && 
          call.url.match(/\/dashboard\/[a-zA-Z0-9-]+$/)
        );
        
        expect(dashboardCalls.length,
          `Expected 1 dashboard fetch on switch, got ${dashboardCalls.length}`
        ).toBe(1);
        
        // Should not fetch dashboard list again
        const listCalls = apiCalls.filter(call => 
          call.method === 'GET' && 
          call.url.match(/\/dashboard\/?$/)
        );
        
        expect(listCalls.length,
          `Should not fetch dashboard list on switch, got ${listCalls.length} calls`
        ).toBe(0);
      }
    }
  });
});