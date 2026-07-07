import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('bhe_admin_token'))

  const login = (newToken) => {
    localStorage.setItem('bhe_admin_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('bhe_admin_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook — avoids importing useContext + AuthContext everywhere
export function useAuth() {
  return useContext(AuthContext)
}
