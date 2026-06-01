'use client'
import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { Recipe, Pagination } from '@/types'

interface UseRecipesParams {
    name?: string
    ingredient?: string
    tags?: string
    prepTime?: number
    sort?: 'favorites'
    page?: number
    pageSize?: number
}

export function useRecipes(params: UseRecipesParams = {}) {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { name, ingredient, tags, prepTime, sort, page, pageSize } = params

    useEffect(() => {
        setLoading(true)
        const query = new URLSearchParams()
        if (name) query.set('name', name)
        if (ingredient) query.set('ingredient', ingredient)
        if (tags) query.set('tags', tags)
        if (prepTime) query.set('prepTime', String(prepTime))
        if (sort) query.set('sort', sort)
        query.set('page', String(page ?? 1))
        query.set('pageSize', String(pageSize ?? 12))

        api.get<{ data: Recipe[]; pagination: Pagination }>(`/recipes?${query.toString()}`)
            .then((res) => {
                setRecipes(res.data.data)
                setPagination(res.data.pagination)
                setError(null)
            })
            .catch(() => setError('Erro ao carregar receitas'))
            .finally(() => setLoading(false))
    }, [name, ingredient, tags, prepTime, sort, page, pageSize])

    return { recipes, pagination, loading, error }
}
