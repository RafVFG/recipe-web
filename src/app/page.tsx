'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import RecipeCard from '@/components/RecipeCard'
import SearchBar from '@/components/SearchBar'
import FilterPanel from '@/components/FilterPanel'
import { useRecipes } from '@/hooks/useRecipes'

interface FilterState {
    ingredient?: string
    tags?: string
    prepTime?: number
}

export default function HomePage() {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterState>({})
    const [page, setPage] = useState(1)

    const { recipes, pagination, loading } = useRecipes({
        name: search || undefined,
        sort: search ? undefined : 'favorites',
        ingredient: filters.ingredient,
        tags: filters.tags,
        prepTime: filters.prepTime,
        page,
    })

    function handleSearch(value: string) {
        setSearch(value)
        setPage(1)
    }

    function handleFilters(newFilters: FilterState) {
        setFilters(newFilters)
        setPage(1)
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-5xl font-black text-zinc-50 mb-8">Receitas</h1>

                <div className="flex gap-3 mb-8">
                    <SearchBar value={search} onChange={handleSearch} />
                    <FilterPanel filters={filters} onApply={handleFilters} />
                </div>

                {loading ? (
                    <p className="text-zinc-500">Carregando...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>

                        {recipes.length === 0 && (
                            <p className="text-zinc-500 text-center py-16">Nenhuma receita encontrada.</p>
                        )}

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-10">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg disabled:opacity-40 hover:bg-zinc-700 transition-colors"
                                >
                                    Anterior
                                </button>
                                <span className="text-zinc-400 text-sm">{page} / {pagination.totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg disabled:opacity-40 hover:bg-zinc-700 transition-colors"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
