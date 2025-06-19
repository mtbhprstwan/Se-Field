"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Calendar, Home, Trophy, Menu, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"
import LoginModal from "@/components/auth/login-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

function HeaderWithAuth() {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl sport-gradient flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black sport-text-gradient">Sefield</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                Beranda
              </Link>
              <Link href="#fields" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                Lapangan
              </Link>
              <Link href="/my-bookings" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                Booking Saya
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="hidden md:block">
                <Button variant="ghost" size="sm" className="font-semibold">
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Button>
              </Link>

              {user ? (
                <>
                  <Link href="/my-bookings">
                    <Button className="sport-button text-white font-semibold rounded-xl">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl border-purple-200 hover:border-purple-300"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-semibold">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/my-bookings" className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Booking Saya
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    variant="outline"
                    className="font-semibold rounded-xl border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Masuk / Daftar
                  </Button>
                  <Link href="/my-bookings">
                    <Button className="sport-button text-white font-semibold rounded-xl">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                </>
              )}

              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
