'use client'
import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    inputClassName?: string
}

export default function TagInput({ tags, onChange, placeholder = 'Nova tag', inputClassName }: TagInputProps) {
    const [input, setInput] = useState('')

    function addTag() {
        const tag = input.trim()
        if (!tag || tags.includes(tag)) return
        onChange([...tags, tag])
        setInput('')
    }

    function removeTag(tag: string) {
        onChange(tags.filter(t => t !== tag))
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    const baseInputClass = 'flex-1 px-3 py-2 border rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors text-sm'

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`${baseInputClass} ${inputClassName ?? 'bg-zinc-800 border-zinc-700'}`}
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="flex items-center gap-1.5 px-3 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors text-sm whitespace-nowrap"
                >
                    <Plus size={14} />
                    Adicionar
                </button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-zinc-500 hover:text-zinc-200 transition-colors ml-0.5"
                            >
                                <X size={11} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
