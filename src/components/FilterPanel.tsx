'use client'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'
import TagInput from './TagInput'

interface FilterState {
    ingredient?: string
    tags?: string
    prepTime?: number
}

interface FilterPanelProps {
    filters: FilterState
    onApply: (filters: FilterState) => void
}

export default function FilterPanel({ filters, onApply }: FilterPanelProps) {
    const [open, setOpen] = useState(false)
    const [local, setLocal] = useState<FilterState>(filters)
    const [localTags, setLocalTags] = useState<string[]>(
        () => filters.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? []
    )

    function apply() {
        const withTags: FilterState = { ...local, tags: localTags.length ? localTags.join(',') : undefined }
        onApply(withTags)
        setOpen(false)
    }

    function clear() {
        const empty: FilterState = {}
        setLocal(empty)
        setLocalTags([])
        onApply(empty)
        setOpen(false)
    }

    const activeCount = Object.values(filters).filter(Boolean).length

    return (
        <>
            <button
                onClick={() => {
                    setLocal(filters)
                    setLocalTags(filters.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? [])
                    setOpen(true)
                }}
                className={clsx(
                    'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap',
                    activeCount > 0
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                )}
            >
                <SlidersHorizontal size={16} />
                Filtros {activeCount > 0 && `(${activeCount})`}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-zinc-50">Filtros</h2>
                            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-50 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Ingrediente</label>
                                <input
                                    type="text"
                                    value={local.ingredient ?? ''}
                                    onChange={(e) => setLocal(l => ({ ...l, ingredient: e.target.value || undefined }))}
                                    placeholder="ex: tomate"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Tags</label>
                                <TagInput
                                    tags={localTags}
                                    onChange={setLocalTags}
                                    placeholder="ex: almoço"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Tempo de preparo (min)</label>
                                <input
                                    type="number"
                                    value={local.prepTime ?? ''}
                                    onChange={(e) => setLocal(l => ({ ...l, prepTime: e.target.value ? Number(e.target.value) : undefined }))}
                                    placeholder="ex: 30"
                                    min="1"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button onClick={clear} className="flex-1 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm hover:border-zinc-500 transition-colors">
                                Limpar
                            </button>
                            <button onClick={apply} className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
