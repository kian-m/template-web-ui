import posthog from 'posthog-js'
import { initPostHog } from './posthog.config.js'
import { hasRecordingConsent, setRecordingConsent } from './consent.js'

let pageStart = Date.now()

function ensureSessionRecording () {
    if (typeof posthog?.sessionRecording?.startRecording === 'function') {
        posthog.sessionRecording.startRecording()
    } else if (typeof posthog?.startSessionRecording === 'function') {
        posthog.startSessionRecording()
    }
}

export function captureEvent (name, properties = {}) {
    try {
        posthog.capture(name, properties)
    } catch (error) {
        console.error('Capture failed', error)
    }
}

export function identifyUser (id, properties = {}) {
    try {
        posthog.identify(id, properties)
    } catch (error) {
        console.error('Identify failed', error)
    }
}

export function setUserProperties (properties) {
    try {
        posthog.people.set(properties)
    } catch (error) {
        console.error('Setting user properties failed', error)
    }
}

export function setupErrorTracking () {
    window.addEventListener('error', e => {
        captureEvent('javascript_error', { message: e.message, stack: e.error?.stack })
    })
    window.addEventListener('unhandledrejection', e => {
        captureEvent('unhandled_rejection', { message: e.reason?.message || String(e.reason) })
    })
}

export function grantConsent () {
    setRecordingConsent(true)
    posthog.opt_in_capturing()
    initPostHog()
    ensureSessionRecording()
    captureEvent('posthog_consent_granted', { timestamp: Date.now() })
}

export function revokeConsent () {
    captureEvent('posthog_consent_revoked', { timestamp: Date.now() })
    setRecordingConsent(false)
    posthog.opt_out_capturing()
    if (typeof posthog?.sessionRecording?.stopRecording === 'function') {
        posthog.sessionRecording.stopRecording()
    } else if (typeof posthog?.stopSessionRecording === 'function') {
        posthog.stopSessionRecording()
    }
}

export function hasConsent () {
    return hasRecordingConsent()
}

export function trackPerformance () {
    try {
        const { loadEventEnd, navigationStart } = performance.timing
        const duration = loadEventEnd - navigationStart
        captureEvent('performance', { duration })
    } catch (error) {
        console.error('Performance tracking failed', error)
    }
}

export function timeOnPage () {
    const now = Date.now()
    const duration = now - pageStart
    captureEvent('time_on_page', { duration, timestamp: now })
}

export function resetTimer () {
    pageStart = Date.now()
}
