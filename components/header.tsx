"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, User, LogOut, Calendar, CalendarDays } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"
import LoginModal from "./auth/login-modal"

export default function Header() {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black sport-text-gradient">Sefield</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Beranda
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Jadwal Lapangan
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/my-bookings">
                    <Button className="sport-button">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="hover:bg-purple-50 border-purple-200">
                        <User className="w-4 h-4 mr-2" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profil Saya
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-bookings" className="cursor-pointer">
                          <Calendar className="w-4 h-4 mr-2" />
                          Booking Saya
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-red-50 cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowLoginModal(true)}
                    className="hover:bg-purple-50 border-purple-200"
                  >
                    Masuk/Daftar
                  </Button>
                  <Link href="/my-bookings">
                    <Button className="sport-button">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
