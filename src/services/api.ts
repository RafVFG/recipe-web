import axios from 'axios'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('auth')
        if (stored) {
            try {
                const { token } = JSON.parse(stored)
                if (token) config.headers.Authorization = `Bearer ${token}`
            } catch {}
        }
    }
    return config
})
