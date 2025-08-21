import posthog from 'posthog-js'
import { initPostHog } from './posthog.config.js'

const CONSENT_KEY = 'ph_consent'
let pageStart = Date.now()

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
    localStorage.setItem(CONSENT_KEY, 'true')
    posthog.opt_in_capturing()
    initPostHog()
}

export function revokeConsent () {
    localStorage.setItem(CONSENT_KEY, 'false')
    posthog.opt_out_capturing()
}

export function hasConsent () {
    try {
        return localStorage.getItem(CONSENT_KEY) === 'true'
    } catch {
        return false
    }
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
