// pages/admin.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import Login from '../components/login'  // Import your Login component
import Home from './home'  // Import your Login component
import supabase from "../db/client";

export default function Admin () {
    const router = useRouter()

    useEffect(() => {
        // Check if the user is already logged in
        async function getUser () {
            const { data: { user } } = await supabase.auth.getUser();


            if (!user) {
                // If not logged in, redirect to the login page
                router.push('/login')
            }
        }
        getUser()
    }, [])

    return (
        <div>
            <Home />
        </div>
    )
}
