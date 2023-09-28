import Image from "next/image";
import Login from "../components/login";
import { useEffect } from "react";
import { useRouter } from 'next/router'
import supabase from "../db/client";

export default function LoginPage () {
    const router = useRouter()

    useEffect(() => {
        // Check if the user is already logged in
        const user = supabase.auth.getUser()

        if (!user) {
            // If not logged in, redirect to the login page
            router.push('/login')
        }
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Login/>
        </main>
    )
}
