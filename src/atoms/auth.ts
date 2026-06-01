import { atom } from 'jotai'
import { AuthState } from '@/types'

export const authAtom = atom<AuthState>({ token: null, userId: null })
