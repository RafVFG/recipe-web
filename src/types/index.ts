export interface Ingredient {
    id: number
    name: string
    amount: string | null
}

export interface Photo {
    id: number
    url: string
    isPrimary: number
}

export interface Recipe {
    id: number
    idUser: number
    name: string
    description: string | null
    directions: string
    rating: number | null
    prepTime: number | null
    yields: number | null
    created_at: string
    updated_at: string
    ingredients: Ingredient[]
    photos: Photo[]
    tags: string[]
}

export interface Pagination {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export interface PaginatedRecipes {
    data: Recipe[]
    pagination: Pagination
}

export interface AuthState {
    token: string | null
    userId: number | null
}
