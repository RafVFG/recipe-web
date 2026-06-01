'use client'
import { useAtom } from 'jotai'
import { authAtom } from '@/atoms/auth'
import { AuthState } from '@/types'

export function useAuth() {
    const [auth, setAuth] = useAtom(authAtom)

    function login(token: string, userId: number) {
        const state: AuthState = { token, userId }
        localStorage.setItem('auth', JSON.stringify(state))
        setAuth(state)
    }

    function logout() {
        localStorage.removeItem('auth')
        setAuth({ token: null, userId: null })
    }

    return { auth, login, logout }
}
