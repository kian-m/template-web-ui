const CONSENT_KEY = 'ph_consent'

function hasLocalStorageSupport () {
    try {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    } catch {
        return false
    }
}

export function setRecordingConsent (value) {
    if (!hasLocalStorageSupport()) return

    try {
        window.localStorage.setItem(CONSENT_KEY, value ? 'true' : 'false')
    } catch (error) {
        console.error('Failed to persist PostHog consent', error)
    }
}

export function hasRecordingConsent () {
    if (!hasLocalStorageSupport()) return true

    try {
        const stored = window.localStorage.getItem(CONSENT_KEY)
        return stored !== 'false'
    } catch {
        return true
    }
}

export { CONSENT_KEY }
