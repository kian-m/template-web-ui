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

## Google Auth (Server-Side)

This app includes server-side Google sign-in using NextAuth. Secrets are kept on the server and never exposed to the browser.

Setup:

- Create a Google OAuth 2.0 Client (Web) in Google Cloud Console.
- Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy `.env.example` to `.env.local` and fill in values:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=... # e.g., `openssl rand -base64 32`
# NEXTAUTH_URL=http://localhost:3000
```

Run locally:

```
npm run dev
```

Usage in UI:

- A Sign in with Google button appears on the landing screen (top-right).
- After signing in, your name/avatar show with a Sign out button.

### Roles (Admin)

- Set admin emails in `.env.local`:

```
ADMIN_EMAILS=user1@example.com,user2@example.com
```

- Middleware gates the entire app and restricts `/admin` to admins only. Non-admins are redirected to sign-in or denied based on session.
- The Admin button on the landing page only shows for admins.

## Google Service Account (Server)

Add a Google service account for server-to-server API calls.

1) Create a Service Account in Google Cloud (and download JSON key):
   - IAM & Admin → Service Accounts → Create Service Account → Create Key → JSON
2) Copy `.env.example` → `.env.local` and fill:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...@....gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your-project-id
```

Notes:
- Keep the private key on one line with literal `\n` sequences. The code converts them to newlines at runtime.
- Never commit `.env.local`.

Test route:
- `GET /api/service-account-test` — fetches an access token for `cloud-platform` scope and returns a token preview.
- Adjust scopes in `src/app/api/service-account-test/route.ts` as needed for your APIs (e.g., Sheets, Drive).

### Google Sheets via Service Account

Configure:
- Share your target spreadsheet with the service account email.
- Set in `.env.local`:

```
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

API endpoints (protected by auth middleware):
- `GET /api/sheets?range=Sheet1!A1:C10` — reads a range and returns values.
- `POST /api/sheets` — appends rows.
  - Body example:

```
{
  "range": "Sheet1!A:C",
  "values": [["2025-01-01", "Workout", "OK"]],
  "valueInputOption": "USER_ENTERED"
}
```

Implementation:
- Helper: `src/services/googleSheets.ts` uses the service account to call the Sheets REST API.
- Routes: `src/app/api/sheets/route.ts` for read/append operations.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
