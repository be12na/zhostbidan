import { createContext } from 'react'
import type { SessionUser } from '../../types/domain'

export interface AuthContextValue {
  user: SessionUser | null
  loading: boolean
  login: (email: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
