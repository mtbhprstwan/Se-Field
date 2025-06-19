"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Calendar, Home, Trophy, Menu, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import LoginModal from "@/components/auth/login-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <html lang="id">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
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
                    <Link
                      href="#fields"
                      className="text-gray-700 hover:text-purple-600 font-semibold transition-colors"
                    >
                      Lapangan
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="text-gray-700 hover:text-purple-600 font-semibold transition-colors"
                    >
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
                            <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                              <User className="w-4 h-4" />
                              {user.name}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href="/my-bookings">
                                <Calendar className="w-4 h-4 mr-2" />
                                Booking Saya
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
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
                          className="font-semibold rounded-xl"
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

            <main className="min-h-screen">{children}</main>

            <footer className="bg-gray-900 text-white py-16">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl sport-gradient flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-black text-white">Sefield</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Platform booking lapangan olahraga terdepan di Indonesia dengan teknologi terkini
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-4 text-lg">Layanan</h4>
                    <ul className="space-y-3 text-gray-400">
                      <li className="hover:text-white transition-colors cursor-pointer">Booking Lapangan</li>
                      <li className="hover:text-white transition-colors cursor-pointer">Pembayaran QRIS</li>
                      <li className="hover:text-white transition-colors cursor-pointer">Reschedule</li>
                      <li className="hover:text-white transition-colors cursor-pointer">24/7 Support</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-4 text-lg">Olahraga</h4>
                    <ul className="space-y-3 text-gray-400">
                      <li className="hover:text-white transition-colors cursor-pointer">⚽ Futsal</li>
                      <li className="hover:text-white transition-colors cursor-pointer">🏸 Badminton</li>
                      <li className="hover:text-white transition-colors cursor-pointer">🎾 Basketball</li>
                      <li className="hover:text-white transition-colors cursor-pointer">🎾 Tennis</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-4 text-lg">Kontak</h4>
                    <ul className="space-y-3 text-gray-400">
                      <li>📧 hello@sefield.id</li>
                      <li>📞 +62 21 1234 5678</li>
                      <li>💬 +62 812 3456 7890</li>
                      <li>📍 Jakarta, Indonesia</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">&copy; 2024 Sefield. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                      <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                        Privacy Policy
                      </span>
                      <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                        Terms of Service
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
