'use client'
import NavBar from '@/components/NavBar'
import RecipeForm from '@/components/RecipeForm'

export default function NovaReceitaPage() {
    return (
        <div className="min-h-screen bg-zinc-950">
            <NavBar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-zinc-50 mb-8">Nova Receita</h1>
                <RecipeForm />
            </main>
        </div>
    )
}
