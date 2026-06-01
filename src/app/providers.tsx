'use client'
import { Provider, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { authAtom } from '@/atoms/auth'

function AuthInitializer() {
    const setAuth = useSetAtom(authAtom)
    useEffect(() => {
        const stored = localStorage.getItem('auth')
        if (stored) {
            try { setAuth(JSON.parse(stored)) } catch {}
        }
    }, [setAuth])
    return null
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider>
            <AuthInitializer />
            {children}
            <Toaster richColors theme="dark" position="top-right" />
        </Provider>
    )
}
