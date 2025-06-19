"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate validation
    if (!email.includes("@")) {
      throw new Error("Email tidak valid")
    }

    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter")
    }

    // Create a mock user
    const userData = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
    }

    // Store user data
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", `mock-token-${Date.now()}`)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate validation
    if (!email.includes("@")) {
      throw new Error("Email tidak valid")
    }

    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter")
    }

    if (!name || name.length < 3) {
      throw new Error("Nama minimal 3 karakter")
    }

    // Create a user
    const userData = {
      id: `user-${Date.now()}`,
      email,
      name,
    }

    // Store user data
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", `mock-token-${Date.now()}`)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
