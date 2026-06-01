'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            router.replace('/login')
            return
        }

        api.get(`/auth/verify?token=${token}`)
            .then((res) => {
                const { jwt } = res.data
                const payload = JSON.parse(atob(jwt.split('.')[1]))
                login(jwt, payload.userId)
                router.replace('/')
            })
            .catch(() => {
                toast.error('Link inválido ou expirado')
                router.replace('/login')
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-400">Verificando seu acesso...</p>
        </div>
    )
}
