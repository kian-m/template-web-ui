#!/usr/bin/env node

/**
 * Browser Debug Tool for Claude
 * This script launches a Chromium browser with developer tools to debug React issues
 * DO NOT COMMIT THIS FILE TO GIT
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const DEBUG_PORT = 3000;
const DEBUG_URL = `http://localhost:${DEBUG_PORT}`;
const SCREENSHOT_DIR = path.join(__dirname, 'debug-screenshots');
const LOG_FILE = path.join(__dirname, 'debug-browser.log');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Clear previous log
fs.writeFileSync(LOG_FILE, `Debug session started: ${new Date().toISOString()}\n\n`);

function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  if (data) {
    const dataStr = JSON.stringify(data, null, 2);
    console.log(dataStr);
    fs.appendFileSync(LOG_FILE, dataStr + '\n');
  }
}

async function debugBrowser() {
  log('Launching browser...');
  
  const browser = await chromium.launch({
    headless: false, // Show the browser
    devtools: true,  // Open DevTools automatically
    args: [
      '--auto-open-devtools-for-tabs',
      '--disable-web-security', // For testing CORS issues
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: SCREENSHOT_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  // Capture console messages
  page.on('console', async msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    
    log(`Console [${type}]: ${text}`, {
      url: location.url,
      lineNumber: location.lineNumber,
      columnNumber: location.columnNumber
    });

    // Capture stack traces for errors
    if (type === 'error') {
      try {
        const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
        log('Error details:', args);
      } catch (e) {
        log('Could not parse error details');
      }
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    log('Page error:', {
      message: error.message,
      stack: error.stack
    });
  });

  // Capture request failures
  page.on('requestfailed', request => {
    log('Request failed:', {
      url: request.url(),
      failure: request.failure()
    });
  });

  // Capture responses
  page.on('response', response => {
    if (response.status() >= 400) {
      log(`HTTP ${response.status()}: ${response.url()}`);
    }
  });

  try {
    log(`Navigating to ${DEBUG_URL}...`);
    await page.goto(DEBUG_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    log('Page loaded successfully');

    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Try to detect React DevTools
    const hasReact = await page.evaluate(() => {
      return !!(window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
    });
    log(`React detected: ${hasReact}`);

    // Check for React errors in the error boundary
    const reactErrors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
      return Array.from(errorElements).map(el => ({
        className: el.className,
        text: el.textContent?.substring(0, 200)
      }));
    });
    if (reactErrors.length > 0) {
      log('Found error elements:', reactErrors);
    }

    // Capture React component tree (if React DevTools is available)
    const componentTree = await page.evaluate(() => {
      try {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook && hook.renderers && hook.renderers.size > 0) {
          // Get first renderer
          const renderer = hook.renderers.values().next().value;
          if (renderer && renderer.getFiberRoots) {
            const roots = Array.from(renderer.getFiberRoots());
            if (roots.length > 0) {
              const fiber = roots[0].current;
              
              // Traverse fiber tree to find issues
              const issues = [];
              let maxDepth = 0;
              
              function traverseFiber(fiber, depth = 0) {
                if (!fiber || depth > 100) {
                  if (depth > 100) {
                    issues.push(`Maximum depth exceeded at component: ${fiber?.elementType?.name || 'Unknown'}`);
                  }
                  return;
                }
                
                maxDepth = Math.max(maxDepth, depth);
                
                // Check for suspense boundaries
                if (fiber.tag === 13) { // SuspenseComponent
                  issues.push(`Suspense at depth ${depth}`);
                }
                
                // Check for error boundaries
                if (fiber.tag === 10) { // ClassComponent with error boundary
                  issues.push(`Error boundary at depth ${depth}`);
                }
                
                // Check memo comparisons
                if (fiber.tag === 14) { // MemoComponent
                  const prevProps = fiber.alternate?.memoizedProps;
                  const nextProps = fiber.memoizedProps;
                  if (prevProps && nextProps && prevProps !== nextProps) {
                    issues.push(`Memo re-render at depth ${depth}: ${fiber.elementType?.name}`);
                  }
                }
                
                // Traverse children
                if (fiber.child) {
                  traverseFiber(fiber.child, depth + 1);
                }
                
                // Traverse siblings
                if (fiber.sibling) {
                  traverseFiber(fiber.sibling, depth);
                }
              }
              
              traverseFiber(fiber);
              
              return {
                maxDepth,
                issues,
                rootType: fiber?.elementType?.name || 'Unknown'
              };
            }
          }
        }
      } catch (e) {
        return { error: e.message };
      }
      return null;
    });
    
    if (componentTree) {
      log('React component tree analysis:', componentTree);
    }

    // Check for infinite loops by monitoring setState calls
    await page.evaluate(() => {
      let setStateCallCount = 0;
      let lastResetTime = Date.now();
      const stateCallLog = [];
      
      // Hook into React's setState
      const originalSetState = Object.getPrototypeOf(React.Component.prototype).setState;
      if (originalSetState) {
        Object.getPrototypeOf(React.Component.prototype).setState = function(...args) {
          setStateCallCount++;
          
          const now = Date.now();
          if (now - lastResetTime > 1000) {
            setStateCallCount = 0;
            lastResetTime = now;
          }
          
          if (setStateCallCount > 50) {
            console.error('INFINITE LOOP DETECTED: Too many setState calls!', {
              count: setStateCallCount,
              component: this.constructor.name
            });
          }
          
          stateCallLog.push({
            component: this.constructor.name,
            time: now,
            stack: new Error().stack
          });
          
          return originalSetState.apply(this, args);
        };
      }
      
      // Also monitor hooks
      window.__debugSetStateCallCount = () => setStateCallCount;
      window.__debugStateCallLog = () => stateCallLog;
    });

    // Navigate to a dashboard to trigger the issue
    log('Attempting to navigate to dashboard...');
    
    // Click on first dashboard if sidebar exists
    const hasDashboard = await page.evaluate(() => {
      const dashboardLinks = document.querySelectorAll('a[href*="/dashboard/"]');
      if (dashboardLinks.length > 0) {
        dashboardLinks[0].click();
        return true;
      }
      return false;
    });
    
    if (hasDashboard) {
      log('Clicked on dashboard link, waiting for navigation...');
      await page.waitForTimeout(5000);
      
      // Check setState call count
      const stateInfo = await page.evaluate(() => {
        return {
          callCount: window.__debugSetStateCallCount ? window.__debugSetStateCallCount() : 0,
          log: window.__debugStateCallLog ? window.__debugStateCallLog().slice(-10) : []
        };
      });
      
      log('setState monitoring:', stateInfo);
    }

    // Take screenshots
    const timestamp = Date.now();
    await page.screenshot({ 
      path: path.join(SCREENSHOT_DIR, `debug-${timestamp}.png`),
      fullPage: true 
    });
    log(`Screenshot saved: debug-${timestamp}.png`);

    // Get performance metrics
    const metrics = await page.evaluate(() => ({
      memory: performance.memory,
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').length
    }));
    log('Performance metrics:', metrics);

    // Keep browser open for manual inspection
    log('\n=================================');
    log('Browser is ready for inspection.');
    log('Press Ctrl+C to exit.');
    log('=================================\n');
    
    // Keep the script running
    await new Promise(() => {});
    
  } catch (error) {
    log('Error during debugging:', error);
    
    // Take error screenshot
    await page.screenshot({ 
      path: path.join(SCREENSHOT_DIR, `error-${Date.now()}.png`),
      fullPage: true 
    });
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Shutting down debug browser...');
  process.exit(0);
});

// Run the debugger
debugBrowser().catch(error => {
  log('Fatal error:', error);
  process.exit(1);
});