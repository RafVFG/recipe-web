'use client'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/auth/request', { email })
            setSent(true)
        } catch {
            toast.error('E-mail não encontrado')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-zinc-50">Link enviado!</h1>
                    <p className="text-zinc-400">Verifique seu e-mail para acessar o sistema.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <h1 className="text-5xl font-black text-zinc-50">Receitas</h1>
                    <p className="mt-2 text-zinc-400">Entre com seu e-mail para acessar</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Enviando...' : 'Enviar link de acesso'}
                    </button>
                </form>
                <p className="text-center text-zinc-500 text-sm">
                    Não tem conta?{' '}
                    <Link href="/cadastro" className="text-orange-500 hover:text-orange-400 transition-colors">
                        Cadastre-se →
                    </Link>
                </p>
            </div>
        </div>
    )
}
