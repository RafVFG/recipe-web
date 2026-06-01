import { Suspense } from 'react'
import VerifyContent from './_content'

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400">Verificando seu acesso...</p>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}
