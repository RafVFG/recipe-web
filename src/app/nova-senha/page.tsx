import { Suspense } from 'react'
import NovaSenhaContent from './_content'

export default function NovaSenhaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400">Carregando...</p>
            </div>
        }>
            <NovaSenhaContent />
        </Suspense>
    )
}
