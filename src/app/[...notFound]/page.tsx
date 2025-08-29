'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trackNotFoundRedirect } from '@/analytics/events'

export default function NotFoundRedirectPage () {
    const router = useRouter()

    useEffect(() => {
        trackNotFoundRedirect({ path: window.location.pathname })
        router.replace('/')
    }, [router])

    return null
}
