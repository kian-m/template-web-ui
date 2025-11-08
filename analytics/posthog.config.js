import posthog from 'posthog-js'
import { hasRecordingConsent } from './consent.js'

const POSTHOG_KEY = 'phc_VZX1tioRIHsGxMdBVLlW7PEKGOw13antIazxQHTM7V0'
const POSTHOG_HOST = 'https://us.posthog.com'

const isProd = process.env.NODE_ENV === 'production'
let initialized = false

function ensureSessionRecording () {
    if (typeof posthog?.sessionRecording?.startRecording === 'function') {
        posthog.sessionRecording.startRecording()
    } else if (typeof posthog?.startSessionRecording === 'function') {
        posthog.startSessionRecording()
    }
}

export function initPostHog () {
    if (typeof window === 'undefined' || initialized || !hasRecordingConsent()) return
    try {
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            capture_pageview: true,
            autocapture: true,
            disable_session_recording: false,
            session_recording: {
                enabled: true,
                maskAllInputs: false,
            },
            debug: !isProd,
        })
        ensureSessionRecording()
        initialized = true
    } catch (error) {
        console.error('PostHog initialization failed', error)
    }
}

export function getFeatureFlag (flag) {
    try {
        return posthog.isFeatureEnabled(flag)
    } catch (error) {
        console.error('Feature flag check failed', error)
        return false
    }
}

export { posthog }
