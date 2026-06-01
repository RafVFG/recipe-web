'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { Recipe } from '@/types'

export function useMyRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(() => {
        setLoading(true)
        api.get<Recipe[]>('/user/recipes')
            .then((res) => { setRecipes(res.data); setError(null) })
            .catch(() => setError('Erro ao carregar suas receitas'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { refresh() }, [refresh])

    return { recipes, loading, error, refresh }
}
