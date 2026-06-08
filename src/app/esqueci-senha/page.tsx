'use client'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function EsqueciSenhaPage() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/auth/forgot-password', { email: email.trim() })
            setSent(true)
        } catch {
            toast.error('Erro ao enviar. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-zinc-50">Link enviado!</h1>
                    <p className="text-zinc-400">Se o e-mail estiver cadastrado, você receberá um link em breve.</p>
                    <Link href="/login" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                        ← Voltar ao login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <h1 className="text-5xl font-black text-zinc-50 select-none">Receitas</h1>
                    <p className="mt-2 text-zinc-400">Recuperar senha</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-400 text-green-950 font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Enviando...' : 'Enviar link'}
                    </button>
                </form>
                <p className="text-center text-zinc-500 text-sm">
                    <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors">
                        ← Voltar ao login
                    </Link>
                </p>
            </div>
        </div>
    )
}
