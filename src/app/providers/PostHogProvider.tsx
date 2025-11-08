'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider ({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if we have the required environment variables
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        // Enable session recording
        session_recording: {
          recordCrossOriginIframes: true,
        },
        // Capture all events automatically
        autocapture: {
          dom_event_allowlist: [ 'click', 'submit', 'change' ], // Capture clicks, form submits, and input changes
          url_allowlist: undefined, // Track all URLs
          element_allowlist: undefined, // Track all elements
          css_selector_allowlist: undefined, // No restrictions on CSS selectors
        },
        // Enable all features
        capture_pageview: true, // Automatically capture pageviews
        capture_pageleave: true, // Capture when users leave pages
        disable_session_recording: false, // Ensure session recording is NOT disabled
        enable_recording_console_log: true, // Capture console logs
        // Performance monitoring
        capture_performance: true,
        // Persistence
        persistence: 'localStorage+cookie',
        // Cross-domain tracking
        cross_subdomain_cookie: true,
        // Advanced options
        advanced_disable_decide: false, // Enable feature flags and A/B testing
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog initialized successfully')
          }
        },
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
