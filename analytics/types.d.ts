export interface PageViewEvent {
    url: string
    referrer: string
    timestamp: number
    user_id?: string
}

export interface ButtonClickEvent {
    button_text: string
    page_location: string
    timestamp: number
}

export interface FormInteractionEvent {
    form_name: string
    field_name: string
    action_type: string
    timestamp: number
}

export interface ProductViewedEvent {
    product_id: string
    product_name: string
    price?: number
    timestamp: number
}

export interface AddToCartEvent {
    product_id: string
    quantity: number
    price?: number
    timestamp: number
}

export interface PurchaseEvent {
    order_id: string
    total: number
    products: Array<{ product_id: string; quantity: number; price: number }>
    timestamp: number
}

export interface ScrollDepthEvent {
    scroll_percentage: number
    timestamp: number
}

export interface TimeOnPageEvent {
    duration: number
    timestamp: number
}

export interface SessionDurationEvent {
    session_duration: number
    timestamp: number
}

export interface NavigationEvent {
    type: 'menu_click' | 'search_query' | 'filter_applied'
    value: string
    page_location: string
    timestamp: number
}

export interface MediaInteractionEvent {
    media_type: 'video_play' | 'image_click' | 'download_started'
    element: string
    timestamp: number
}

export interface HoverEvent {
    element: string
    page_location: string
    timestamp: number
}

export interface KeyboardInputEvent {
    key: string
    page_location: string
    timestamp: number
}
