'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import NavBar from '@/components/NavBar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useMyRecipes } from '@/hooks/useMyRecipes'
import { api } from '@/services/api'

export default function PerfilPage() {
    const { recipes, loading, refresh } = useMyRecipes()
    const [deleteId, setDeleteId] = useState<number | null>(null)

    async function handleDelete() {
        if (!deleteId) return
        try {
            await api.delete(`/recipe/${deleteId}`)
            toast.success('Receita excluída')
            refresh()
        } catch {
            toast.error('Erro ao excluir receita')
        } finally {
            setDeleteId(null)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <NavBar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-zinc-50">Minhas Receitas</h1>
                    <Link
                        href="/perfil/receitas/nova"
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-400 text-green-950 font-medium rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Nova receita
                    </Link>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Carregando...</p>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <p className="text-zinc-500">Você ainda não criou nenhuma receita.</p>
                        <Link href="/perfil/receitas/nova" className="text-green-400 hover:text-green-300 transition-colors">
                            Criar minha primeira receita →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recipes.map(recipe => (
                            <div key={recipe.id} className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-zinc-50 font-semibold truncate">{recipe.name}</p>
                                    {recipe.prepTime && (
                                        <p className="text-zinc-500 text-sm flex items-center gap-1 mt-0.5">
                                            <Clock size={12} />
                                            {recipe.prepTime} min
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Link
                                        href={`/perfil/receitas/${recipe.id}/editar`}
                                        className="p-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={15} />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(recipe.id)}
                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <ConfirmDialog
                open={deleteId !== null}
                title="Excluir receita"
                description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    )
}
