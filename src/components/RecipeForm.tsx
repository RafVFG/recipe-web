'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import { Recipe } from '@/types'
import TagInput from './TagInput'

interface FormState {
    name: string
    description: string
    ingredients: { name: string; amount: string }[]
    directions: string[]
    prepTime: string
    yields: string
    tags: string[]
    rating: string
}

function parseDirections(directions: string): string[] {
    try { return JSON.parse(directions) } catch { return [directions] }
}

function buildInitialState(recipe?: Recipe): FormState {
    if (!recipe) return {
        name: '', description: '',
        ingredients: [{ name: '', amount: '' }],
        directions: [''],
        prepTime: '', yields: '', tags: [], rating: '',
    }
    return {
        name: recipe.name,
        description: recipe.description ?? '',
        ingredients: recipe.ingredients?.length
            ? recipe.ingredients.map(i => ({ name: i.name, amount: i.amount ?? '' }))
            : [{ name: '', amount: '' }],
        directions: parseDirections(recipe.directions),
        prepTime: recipe.prepTime ? String(recipe.prepTime) : '',
        yields: recipe.yields ? String(recipe.yields) : '',
        tags: recipe.tags ?? [],
        rating: recipe.rating ? String(recipe.rating) : '',
    }
}

export default function RecipeForm({ initialData }: { initialData?: Recipe }) {
    const router = useRouter()
    const [form, setForm] = useState<FormState>(() => buildInitialState(initialData))
    const [loading, setLoading] = useState(false)

    function updateIngredient(index: number, field: 'name' | 'amount', value: string) {
        setForm(f => {
            const updated = [...f.ingredients]
            updated[index] = { ...updated[index], [field]: value }
            return { ...f, ingredients: updated }
        })
    }

    function updateDirection(index: number, value: string) {
        setForm(f => {
            const updated = [...f.directions]
            updated[index] = value
            return { ...f, directions: updated }
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const filteredIngredients = form.ingredients.filter(i => i.name.trim())
        const filteredDirections = form.directions.filter(d => d.trim())

        if (!form.name.trim()) return toast.error('Nome é obrigatório')
        if (filteredIngredients.length === 0) return toast.error('Adicione ao menos um ingrediente')
        if (filteredDirections.length === 0) return toast.error('Adicione ao menos um passo')

        setLoading(true)
        try {
                await api.post('/create-or-update-recipe', {
                ...(initialData?.id ? { id: initialData.id } : {}),
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                ingredients: filteredIngredients,
                directions: filteredDirections,
                prepTime: form.prepTime ? Number(form.prepTime) : undefined,
                yields: form.yields ? Number(form.yields) : undefined,
                tags: form.tags,
                rating: form.rating ? Number(form.rating) : undefined,
            })
            toast.success(initialData ? 'Receita atualizada!' : 'Receita criada!')
            router.push('/perfil')
        } catch {
            toast.error('Erro ao salvar receita')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
    const smallInputClass = "w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome *</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Nome da receita"
                    required
                    className={inputClass}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Descrição</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Descrição opcional"
                    rows={3}
                    className={`${inputClass} resize-none`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ingredientes *</label>
                <div className="space-y-2">
                    {form.ingredients.map((ing, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                value={ing.name}
                                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                                placeholder="Ingrediente"
                                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-sm"
                            />
                            <input
                                type="text"
                                value={ing.amount}
                                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                                placeholder="Qtd (ex: 2 xícaras)"
                                className="w-40 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-sm"
                            />
                            {form.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))}
                                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', amount: '' }] }))}
                    className="mt-2 flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
                >
                    <Plus size={14} /> Adicionar ingrediente
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Modo de Preparo *</label>
                <div className="space-y-2">
                    {form.directions.map((step, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="flex-shrink-0 w-6 h-6 mt-2 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">
                                {i + 1}
                            </span>
                            <textarea
                                value={step}
                                onChange={(e) => updateDirection(i, e.target.value)}
                                placeholder={`Passo ${i + 1}`}
                                rows={2}
                                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-sm resize-none"
                            />
                            {form.directions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, directions: f.directions.filter((_, idx) => idx !== i) }))}
                                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors self-start mt-1"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, directions: [...f.directions, ''] }))}
                    className="mt-2 flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
                >
                    <Plus size={14} /> Adicionar passo
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tempo de preparo (min)</label>
                    <input
                        type="number"
                        value={form.prepTime}
                        onChange={(e) => setForm(f => ({ ...f, prepTime: e.target.value }))}
                        placeholder="ex: 45"
                        min="1"
                        className={smallInputClass}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Porções</label>
                    <input
                        type="number"
                        value={form.yields}
                        onChange={(e) => setForm(f => ({ ...f, yields: e.target.value }))}
                        placeholder="ex: 4"
                        min="1"
                        className={smallInputClass}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tags</label>
                <TagInput
                    tags={form.tags}
                    onChange={(t) => setForm(f => ({ ...f, tags: t }))}
                    inputClassName="bg-zinc-900 border-zinc-800"
                />
            </div>

            <div className="flex gap-4 pt-2">
                <button
                    type="button"
                    onClick={() => router.push('/perfil')}
                    className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar receita'}
                </button>
            </div>
        </form>
    )
}
