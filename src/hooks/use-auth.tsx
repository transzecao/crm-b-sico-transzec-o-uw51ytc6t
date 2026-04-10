import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: any
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dummyUser = {
    id: 'public000000000',
    name: 'Usuário Público',
    email: 'public@transzecao.com',
    role: 'MASTER',
  }

  const signUp = async () => ({ error: null })
  const signIn = async () => ({ error: null })
  const signOut = () => {}

  return (
    <AuthContext.Provider value={{ user: dummyUser, signUp, signIn, signOut, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}
