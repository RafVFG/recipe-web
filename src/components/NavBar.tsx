'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function NavBar() {
    const { auth, logout } = useAuth()
    const router = useRouter()

    function handleLogout() {
        logout()
        router.replace('/')
    }

    return (
        <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-black text-zinc-50 hover:text-green-300 transition-colors">
                    Receitas
                </Link>
                <div className="flex items-center gap-1">
                    {auth.token ? (
                        <>
                            <Link
                                href="/perfil"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors text-sm"
                            >
                                <User size={16} />
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors text-sm"
                            >
                                <LogOut size={16} />
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors text-sm"
                        >
                            <LogIn size={16} />
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
