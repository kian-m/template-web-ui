'use client';
import { useEffect } from 'react'
import { initPostHog } from './posthog.config.js'
import {
    trackPageView,
    trackButtonClick,
    trackFormInteraction,
    trackScrollPercentage,
    trackSessionDuration,
    trackNavigationEvent,
    trackMediaInteraction,
    trackHover,
    trackKeyboard,
} from './events.js'
import { identifyUser, setupErrorTracking, timeOnPage, resetTimer, trackPerformance } from './utils.js'

export function useAnalytics (userId) {
    useEffect(() => {
        initPostHog()
        trackPerformance()
        setupErrorTracking()
        if (userId) identifyUser(userId)

        trackPageView({
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            user_id: userId,
        })

        const clickHandler = e => {
            const target = e.target.closest('button, a, img')
            const page_location = window.location.pathname
            const timestamp = Date.now()
            if (target) {
                if (target.tagName === 'BUTTON') {
                    trackButtonClick({ button_text: target.textContent || 'button', page_location, timestamp })
                } else if (target.tagName === 'A') {
                    const text = target.textContent || target.href
                    trackNavigationEvent({ type: 'menu_click', value: text, page_location, timestamp })
                    if (target.getAttribute('download') !== null) {
                        trackMediaInteraction({ media_type: 'download_started', element: target.href, timestamp })
                    }
                } else if (target.tagName === 'IMG') {
                    trackMediaInteraction({ media_type: 'image_click', element: target.src, timestamp })
                }
            }
        }

        const submitHandler = e => {
            const form = e.target
            const form_name = form.getAttribute('name') || form.getAttribute('id') || 'form'
            const timestamp = Date.now()
            Array.from(form.elements).forEach(el => {
                if (el.name) {
                    trackFormInteraction({ form_name, field_name: el.name, action_type: 'submit', timestamp })
                }
            })
        }

        const scrollHandler = () => {
            const scrollTop = window.scrollY + window.innerHeight
            const height = document.documentElement.scrollHeight
            const scroll_percentage = Math.round((scrollTop / height) * 100)
            trackScrollPercentage({ scroll_percentage, timestamp: Date.now() })
        }

        const mouseoverHandler = e => {
            const element = e.target
            if (element instanceof HTMLElement) {
                trackHover({ element: element.tagName.toLowerCase(), page_location: window.location.pathname, timestamp: Date.now() })
            }
        }

        const keyHandler = e => {
            trackKeyboard({ key: e.key, page_location: window.location.pathname, timestamp: Date.now() })
        }

        const playHandler = e => {
            const element = e.target
            if (element instanceof HTMLVideoElement) {
                trackMediaInteraction({ media_type: 'video_play', element: element.currentSrc, timestamp: Date.now() })
            }
        }

        const beforeUnload = () => {
            timeOnPage()
            trackSessionDuration({ session_duration: Date.now() - performance.timeOrigin, timestamp: Date.now() })
            resetTimer()
        }

        window.addEventListener('click', clickHandler, true)
        window.addEventListener('submit', submitHandler, true)
        window.addEventListener('scroll', scrollHandler)
        window.addEventListener('mouseover', mouseoverHandler)
        window.addEventListener('keydown', keyHandler)
        window.addEventListener('play', playHandler, true)
        window.addEventListener('beforeunload', beforeUnload)

        return () => {
            window.removeEventListener('click', clickHandler, true)
            window.removeEventListener('submit', submitHandler, true)
            window.removeEventListener('scroll', scrollHandler)
            window.removeEventListener('mouseover', mouseoverHandler)
            window.removeEventListener('keydown', keyHandler)
            window.removeEventListener('play', playHandler, true)
            window.removeEventListener('beforeunload', beforeUnload)
            resetTimer()
        }
    }, [userId])
}

export function AnalyticsProvider ({ userId }) {
    useAnalytics(userId)
    return null
}
