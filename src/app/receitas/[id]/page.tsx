'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useRecipe } from '@/hooks/useRecipe'
import { api } from '@/services/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function RecipeDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { recipe, loading, error } = useRecipe(id)
    const router = useRouter()

    const [favorited, setFavorited] = useState(false)
    const [favLoading, setFavLoading] = useState(false)

    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false
        return !!localStorage.getItem('auth')
    }

    useEffect(() => {
        if (!isAuthenticated()) return
        api.get<{ id: number }[]>('/user/favorites')
            .then(res => {
                setFavorited(res.data.some(r => r.id === Number(id)))
            })
            .catch(() => {})
    }, [id])

    async function handleFavorite() {
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }
        setFavLoading(true)
        try {
            if (favorited) {
                await api.delete(`/user/favorites/${id}`)
                setFavorited(false)
                toast.success('Removido dos favoritos')
            } else {
                await api.post('/user/favorites', { idRecipe: Number(id) })
                setFavorited(true)
                toast.success('Adicionado aos favoritos')
            }
        } catch {
            toast.error('Erro ao atualizar favorito')
        } finally {
            setFavLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500">Carregando...</p>
        </div>
    )

    if (error || !recipe) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-center space-y-4">
                <p className="text-zinc-400">{error ?? 'Receita não encontrada'}</p>
                <Link href="/" className="text-green-400 hover:text-green-300 transition-colors">← Voltar</Link>
            </div>
        </div>
    )

    const directions: string[] = (() => {
        try { return JSON.parse(recipe.directions) } catch { return [recipe.directions] }
    })()

    const primaryPhoto = recipe.photos?.find(p => p.isPrimary === 1) ?? recipe.photos?.[0]

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors text-sm">
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                    <button
                        onClick={handleFavorite}
                        disabled={favLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                            favorited
                                ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                                : 'bg-zinc-800 text-zinc-400 hover:text-green-300 hover:bg-zinc-700'
                        }`}
                        title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Heart size={16} className={favorited ? 'fill-green-400' : ''} />
                        {favorited ? 'Favoritado' : 'Favoritar'}
                    </button>
                </div>

                {primaryPhoto && (
                    <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden mb-8">
                        <img
                            src={`${API_URL}${primaryPhoto.url}`}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <h1 className="text-4xl font-black text-zinc-50 mb-4">{recipe.name}</h1>

                <div className="flex flex-wrap gap-5 mb-6 text-zinc-400 text-sm">
                    {recipe.prepTime && (
                        <div className="flex items-center gap-1.5">
                            <Clock size={15} />
                            <span>{recipe.prepTime} min</span>
                        </div>
                    )}
                    {recipe.yields && (
                        <div className="flex items-center gap-1.5">
                            <Users size={15} />
                            <span>{recipe.yields} porções</span>
                        </div>
                    )}
                </div>

                {recipe.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-400 text-sm rounded-full border border-zinc-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {recipe.description && (
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">{recipe.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-10">
                    <section>
                        <h2 className="text-xl font-bold text-zinc-50 mb-4">Ingredientes</h2>
                        <ul className="space-y-2">
                            {recipe.ingredients?.map((ing, i) => (
                                <li key={i} className="flex gap-3 text-zinc-300 text-sm">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>{ing.amount ? `${ing.amount} de ${ing.name}` : ing.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-50 mb-4">Modo de Preparo</h2>
                        <ol className="space-y-4">
                            {directions.map((step, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 text-green-950 text-xs font-bold flex items-center justify-center mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    )
}
