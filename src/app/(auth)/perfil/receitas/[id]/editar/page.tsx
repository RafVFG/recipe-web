'use client'
import { useParams } from 'next/navigation'
import NavBar from '@/components/NavBar'
import RecipeForm from '@/components/RecipeForm'
import { useRecipe } from '@/hooks/useRecipe'

export default function EditarReceitaPage() {
    const { id } = useParams<{ id: string }>()
    const { recipe, loading, error } = useRecipe(id)

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500">Carregando...</p>
        </div>
    )

    if (error || !recipe) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-400">Receita não encontrada</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950">
            <NavBar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-zinc-50 mb-8">Editar Receita</h1>
                <RecipeForm initialData={recipe} />
            </main>
        </div>
    )
}
