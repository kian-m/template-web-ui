'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle () {
    const { resolvedTheme, setTheme } = useTheme()
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-academic-gold"
            data-ph-event="theme_toggle_click"
        >
            {resolvedTheme === 'dark'
                ? <Sun className="w-5 h-5 text-academic-gold" />
                : <Moon className="w-5 h-5 text-academic-gold" />}
        </button>
    )
}
