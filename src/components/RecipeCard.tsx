'use client'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Recipe } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const primaryPhoto = recipe.photos?.find(p => p.isPrimary === 1) ?? recipe.photos?.[0]

    return (
        <Link
            href={`/receitas/${recipe.id}`}
            className="group block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/5"
        >
            <div className="aspect-video bg-zinc-800 overflow-hidden">
                {primaryPhoto ? (
                    <img
                        src={`${API_URL}${primaryPhoto.url}`}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                        🍽️
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <h2 className="text-base font-bold text-zinc-50 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {recipe.name}
                </h2>
                {recipe.prepTime && (
                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                        <Clock size={13} />
                        <span>{recipe.prepTime} min</span>
                    </div>
                )}
                {recipe.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
