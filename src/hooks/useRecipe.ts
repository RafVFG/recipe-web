'use client'
import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { Recipe } from '@/types'

export function useRecipe(id: string | number) {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        api.get<Recipe>(`/recipe/${id}`)
            .then((res) => { setRecipe(res.data); setError(null) })
            .catch(() => setError('Receita não encontrada'))
            .finally(() => setLoading(false))
    }, [id])

    return { recipe, loading, error }
}
