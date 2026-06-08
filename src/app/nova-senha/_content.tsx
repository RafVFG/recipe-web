'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function NovaSenhaContent() {
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showRetryLink, setShowRetryLink] = useState(false)
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            router.replace('/login')
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!token) return
        setLoading(true)
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword })
            const { jwt } = res.data
            const payload = JSON.parse(atob(jwt.split('.')[1]))
            const userId = typeof payload.userId === 'number' ? payload.userId : Number(payload.userId)
            if (!userId) {
                toast.error('Erro ao redefinir senha')
                return
            }
            login(jwt, userId)
            router.replace('/')
        } catch (err: any) {
            if (err?.response?.status === 400) {
                toast.error('Token inválido ou expirado')
                setShowRetryLink(true)
            } else {
                toast.error('Erro ao redefinir senha')
            }
        } finally {
            setLoading(false)
        }
    }

    if (!token) return null

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <h1 className="text-5xl font-black text-zinc-50 select-none">Receitas</h1>
                    <p className="mt-2 text-zinc-400">Definir nova senha</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova senha"
                        required
                        autoComplete="new-password"
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-400 text-green-950 font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Salvando...' : 'Salvar nova senha'}
                    </button>
                    {showRetryLink && (
                        <p className="text-center text-sm text-zinc-500">
                            <Link href="/esqueci-senha" className="text-green-400 hover:text-green-300 transition-colors">
                                Solicitar novo link →
                            </Link>
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
