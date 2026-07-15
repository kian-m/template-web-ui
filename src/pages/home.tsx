'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        posthog?: {
            capture: (eventName: string, properties?: Record<string, unknown>) => void;
        };
    }
}

const inactiveHealthActions = [
    {
        label: 'Eating',
        description: 'Meal logging is temporarily unavailable while we refine the experience.',
    },
    {
        label: 'Workout',
        description: 'Workout planning is temporarily unavailable while we refine the experience.',
    },
];

export default function Home () {
    useEffect(() => {
        window.posthog?.capture('health_main_ctas_deactivated_viewed', {
            inactiveActions: inactiveHealthActions.map((action) => action.label.toLowerCase()),
            surface: 'main_page',
        });
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-white">
            <section className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-emerald-950/40 sm:p-12">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                    Health dashboard
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Your wellness tools are getting tuned up.
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    Eating and workout actions are intentionally deactivated by default for now so the next release can focus on a safer, more polished health experience.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {inactiveHealthActions.map((action) => (
                        <button
                            aria-describedby={`${action.label.toLowerCase()}-status`}
                            className="cursor-not-allowed rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-5 text-left opacity-60 shadow-inner shadow-black/20 transition sm:px-8"
                            disabled
                            key={action.label}
                            type="button"
                        >
                            <span className="block text-2xl font-semibold text-white">{action.label}</span>
                            <span
                                className="mt-3 block text-sm leading-6 text-slate-300"
                                id={`${action.label.toLowerCase()}-status`}
                            >
                                {action.description}
                            </span>
                            <span className="mt-5 inline-flex rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
                                Deactivated for now
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}
