'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email: email.trim(), password })
            const { jwt } = res.data
            const payload = JSON.parse(atob(jwt.split('.')[1]))
            const userId = typeof payload.userId === 'number' ? payload.userId : Number(payload.userId)
            if (!userId) {
                toast.error('Erro ao entrar')
                return
            }
            login(jwt, userId)
            router.replace('/')
        } catch (err: any) {
            if (err?.response?.status === 401) {
                toast.error('Email ou senha inválidos')
            } else {
                toast.error('Erro ao entrar')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <h1 className="text-5xl font-black text-zinc-50 select-none">Receitas</h1>
                    <p className="mt-2 text-zinc-400">Entre na sua conta</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <div className="text-right">
                        <Link href="/esqueci-senha" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                            Esqueci minha senha →
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-400 text-green-950 font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="text-center text-zinc-500 text-sm">
                    Não tem conta?{' '}
                    <Link href="/cadastro" className="text-green-400 hover:text-green-300 transition-colors">
                        Cadastre-se →
                    </Link>
                </p>
            </div>
        </div>
    )
}
