import { captureEvent } from './utils.js'

export const EVENTS = {
    PAGE_VIEW: 'page_view',
    BUTTON_CLICK: 'button_click',
    FORM_INTERACTION: 'form_interaction',
    PRODUCT_VIEWED: 'product_viewed',
    ADD_TO_CART: 'add_to_cart',
    PURCHASE: 'purchase',
    SCROLL_DEPTH: 'scroll_depth',
    TIME_ON_PAGE: 'time_on_page',
    SESSION_DURATION: 'session_duration',
    NAVIGATION: 'navigation',
    MEDIA_INTERACTION: 'media_interaction',
    HOVER: 'hover',
    KEYBOARD: 'keyboard_input',
    SCHEDULE_NOW: 'schedule_now_click',
    BOOK_NOW: 'book_now_click',
    CONTACT_CLICK: 'contact_click',
    FAQ_INTERACTION: 'faq_interaction',
    NOT_FOUND_REDIRECT: 'not_found_redirect',
}

export function trackPageView (props) {
    captureEvent(EVENTS.PAGE_VIEW, props)
}

export function trackButtonClick (props) {
    captureEvent(EVENTS.BUTTON_CLICK, props)
}

export function trackFormInteraction (props) {
    captureEvent(EVENTS.FORM_INTERACTION, props)
}

export function trackProductViewed (props) {
    captureEvent(EVENTS.PRODUCT_VIEWED, props)
}

export function trackAddToCart (props) {
    captureEvent(EVENTS.ADD_TO_CART, props)
}

export function trackPurchase (props) {
    captureEvent(EVENTS.PURCHASE, props)
}

export function trackScrollPercentage (props) {
    captureEvent(EVENTS.SCROLL_DEPTH, props)
}

export function trackTimeOnPage (props) {
    captureEvent(EVENTS.TIME_ON_PAGE, props)
}

export function trackSessionDuration (props) {
    captureEvent(EVENTS.SESSION_DURATION, props)
}

export function trackNavigationEvent (props) {
    captureEvent(EVENTS.NAVIGATION, props)
}

export function trackMediaInteraction (props) {
    captureEvent(EVENTS.MEDIA_INTERACTION, props)
}

export function trackHover (props) {
    captureEvent(EVENTS.HOVER, props)
}

export function trackKeyboard (props) {
    captureEvent(EVENTS.KEYBOARD, props)
}

export function trackScheduleNow (props) {
    captureEvent(EVENTS.SCHEDULE_NOW, props)
}

export function trackBookNow (props) {
    captureEvent(EVENTS.BOOK_NOW, props)
}

export function trackContactClick (props) {
    captureEvent(EVENTS.CONTACT_CLICK, props)
}

export function trackFaqInteraction (props) {
    captureEvent(EVENTS.FAQ_INTERACTION, props)
}

export function trackNotFoundRedirect (props) {
    captureEvent(EVENTS.NOT_FOUND_REDIRECT, props)
}
