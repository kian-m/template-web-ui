'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import posthog from 'posthog-js';

const rainbow = ['#c85a1d', '#f2b25d', '#c46cc7'];
const baseHost = process.env.NEXT_PUBLIC_SHORT_LINK_BASE_URL || 'https://clk.ly';
let posthogInitialized = false;

function initPosthog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === 'undefined' || !key || posthogInitialized) {
    return;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    autocapture: false,
    capture_pageview: false,
  });
  posthogInitialized = true;
}

function capture(event: string, properties: Record<string, unknown>) {
  if (!posthogInitialized) return;
  posthog.capture(event, properties);
}

type ShortLink = {
  id: string;
  originalUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: string;
};

type ApiLink = {
  alias: string;
  destinationUrl: string;
  shortUrl: string;
  createdAt: string;
};

function toShortLink(link: ApiLink): ShortLink {
  return {
    id: `${link.alias}-${link.createdAt}`,
    alias: link.alias,
    originalUrl: link.destinationUrl,
    shortUrl: link.shortUrl,
    createdAt: link.createdAt,
  };
}

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [destination, setDestination] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    initPosthog();
  }, []);

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('clkly-theme') : null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      return;
    }

    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.theme = theme;
      localStorage.setItem('clkly-theme', theme);
      capture('theme_toggled', { theme });
    }
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/links');
        if (!response.ok) {
          throw new Error('Unable to load your links right now.');
        }

        const data = (await response.json()) as { links?: ApiLink[] };
        const parsed = (data.links || []).map(toShortLink);
        if (!cancelled) {
          setShortLinks(parsed);
          capture('links_loaded', { count: parsed.length });
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback('Unable to load your existing links. Please try again.');
          capture('links_load_failed', { reason: error instanceof Error ? error.message : 'unknown' });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const accentGradient = useMemo(
    () =>
      `linear-gradient(120deg, ${rainbow
        .map((shade, index) => `${shade} ${(index / rainbow.length) * 100}%`)
        .join(', ')})`,
    [],
  );

  const handleShorten = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedUrl = destination.trim();
    if (!sanitizedUrl) {
      setFeedback('Please drop in a destination URL to shorten.');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: sanitizedUrl, alias: customAlias.trim() || undefined }),
      });

      const data = (await response.json()) as { link?: ApiLink; message?: string };

      if (!response.ok || !data.link) {
        const message = data.message || 'Unable to create your short link right now.';
        setFeedback(message);
        capture('link_create_failed', { message, status: response.status });
        return;
      }

      const newLink = toShortLink(data.link);
      setShortLinks((prev) => [newLink, ...prev]);
      setFeedback('Fresh short link generated and synced to Sheets.');
      capture('link_shortened', {
        alias: newLink.alias,
        hasCustomAlias: Boolean(customAlias.trim()),
        destinationLength: sanitizedUrl.length,
      });
      setCustomAlias('');
      setDestination('');
    } catch (error) {
      const message = 'Unable to create your short link right now.';
      setFeedback(message);
      capture('link_create_failed', { reason: error instanceof Error ? error.message : 'unknown' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="page-shell">
      <div className="grid-backdrop" aria-hidden>
        {rainbow.map((shade, index) => (
          <span key={shade} className="grid-stripe" style={{ background: shade, opacity: 0.04 * (index + 1) }} />
        ))}
      </div>

      <header className="page-header">
        <div className="pill">Server-side energy, zero bloat</div>
        <button className="toggle" onClick={toggleTheme} aria-label="Toggle color mode">
          <span className="toggle-thumb" />
          <span className="toggle-text">{theme === 'light' ? 'Light' : 'Dark'} mode</span>
        </button>
      </header>

      <main className="content">
        <section className="hero">
          <div className="logo-mark" style={{ backgroundImage: accentGradient }}>
            <div className="logo-glyph">clkly</div>
          </div>
          <p className="tagline">
            A minimal, Apple-inspired command center for shortening links. Keep it lean, keep it fast, and plug in Sheets when
            you are ready to persist.
          </p>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Shorten anything</p>
              <h2 className="panel-title">Drop a link. Choose your endpoint. Ship.</h2>
            </div>
            <div className="status-chip">Private Google Sheet backend</div>
          </div>

          <form className="form" onSubmit={handleShorten}>
            <label className="field">
              <span className="field-label">Destination URL</span>
              <input
                type="url"
                name="destination"
                placeholder="https://design.apple.com/inspiration"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Custom endpoint (optional)</span>
              <div className="alias-row">
                <span className="base-host">{baseHost}/</span>
                <input
                  type="text"
                  name="alias"
                  placeholder="colorstream"
                  value={customAlias}
                  onChange={(event) => setCustomAlias(event.target.value.replace(/\s+/g, '-'))}
                  maxLength={32}
                />
              </div>
            </label>

            <div className="actions">
              <button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving to Sheets…' : 'Shorten link'}
              </button>
              <p className="hint">All server-ready. Swap in Sheets later for persistence and auditability.</p>
            </div>
          </form>

          {feedback && <p className="feedback">{feedback}</p>}

          <div className="list-header">
            <div>
              <p className="eyebrow">Shortened links</p>
              <h3 className="panel-title">Your freshly minted endpoints</h3>
            </div>
            <div className="badge-row">
              {rainbow.map((tone) => (
                <span key={tone} className="swatch" style={{ background: tone }} />
              ))}
            </div>
          </div>

          <ul className="link-list">
            {isLoading && (
              <li className="empty-state">
                <p>Loading your links from the private sheet…</p>
              </li>
            )}
            {!isLoading && shortLinks.length === 0 && (
              <li className="empty-state">
                <p>
                  Nothing shortened yet. Paste a link above and watch clkly shape it into a crisp endpoint.
                </p>
              </li>
            )}
            {shortLinks.map((link) => (
              <li key={link.id} className="link-row">
                <div>
                  <p className="link-alias">{link.shortUrl}</p>
                  <p className="link-destination" title={link.originalUrl}>
                    {link.originalUrl}
                  </p>
                </div>
                <div className="link-meta">
                  <span className="meta-chip">{new Date(link.createdAt).toLocaleString()}</span>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(link.shortUrl);
                      setFeedback('Copied to clipboard. Ready for launch.');
                      capture('link_copied', { alias: link.alias });
                    }}
                  >
                    Copy
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
