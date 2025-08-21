This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Analytics

### Installation

```
npm install posthog-js
```

### Setup

1. Ensure user consent is granted by calling `grantConsent()` from `analytics/utils.js`.
2. Place `<AnalyticsProvider />` inside the application layout (`src/app/layout.tsx`).
3. Use event helpers from `analytics/events.js` to track custom interactions.
4. Access feature flags for A/B tests using `getFeatureFlag()` from `analytics/posthog.config.js`.

### Event Usage Examples

```javascript
import {
  trackButtonClick,
  trackFormInteraction,
  trackScrollPercentage,
  trackNavigationEvent,
 trackMediaInteraction,
  trackProductViewed,
  trackAddToCart,
  trackPurchase,
  trackScheduleNow,
  trackBookNow,
  trackContactClick,
  trackFaqInteraction,
} from '../analytics/events'

// manual examples (page views are automatic)
trackButtonClick({ button_text: 'Subscribe', page_location: '/home', timestamp: Date.now() })
trackFormInteraction({ form_name: 'contact', field_name: 'email', action_type: 'input', timestamp: Date.now() })
trackScrollPercentage({ scroll_percentage: 50, timestamp: Date.now() })
trackNavigationEvent({ type: 'search_query', value: 'tutors', page_location: '/search', timestamp: Date.now() })
trackMediaInteraction({ media_type: 'video_play', element: 'intro.mp4', timestamp: Date.now() })
trackProductViewed({ product_id: 'sku-1', product_name: 'Premium Course', price: 199, timestamp: Date.now() })
trackAddToCart({ product_id: 'sku-1', quantity: 1, price: 199, timestamp: Date.now() })
trackPurchase({ order_id: 'order-1', total: 199, products: [{ product_id: 'sku-1', quantity: 1, price: 199 }], timestamp: Date.now() })
trackScheduleNow({ page_location: '/schedule', timestamp: Date.now() })
trackBookNow({ page_location: '/pricing', price: '99', group: 'gold', timestamp: Date.now() })
trackContactClick({ page_location: '/about', contact_type: 'email', value: 'mailto:info@example.com', timestamp: Date.now() })
trackFaqInteraction({ faq_id: 'shipping', action: 'open', timestamp: Date.now() })
```

### Automatic Tracking

- Add `data-action="schedule_now"` to "Schedule Now" buttons.
- Add `data-action="book_now"` and optional `data-price`/`data-group` to "Book Now" buttons.
- Links with `mailto:` or `tel:` schemes are captured as contact clicks automatically.
- Mark FAQ containers with `data-faq-id="your-id"` to capture FAQ interactions.

### Testing

- Click buttons, submit forms, scroll and play media; confirm corresponding events in PostHog Live view.
- Run `npm run lint` to verify code style.
- Start the development server with `npm run dev` and interact with the site to confirm events are sent to PostHog.

### Troubleshooting

- Verify that the PostHog key and host in `analytics/posthog.config.js` are correct.
- Ensure consent is granted before initialization.
- Check the browser console for initialization errors.
- Network requests to `https://us.posthog.com` should be visible after interactions.
