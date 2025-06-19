"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar } from "lucide-react"
import BookingCard from "@/components/booking-card"
import type { Booking } from "@/lib/types"
import PaymentModal from "@/components/payment-modal"

export default function MyBookingsPage() {
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [hasAutoSearched, setHasAutoSearched] = useState(false)

  const fetchBookingsWithEmail = useCallback(async (emailToSearch: string) => {
    if (!emailToSearch) return

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings?userEmail=${encodeURIComponent(emailToSearch)}`)
      const data = await response.json()
      setBookings(data)
      setSearched(true)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fill email from URL parameter and auto-search (only once)
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam && !hasAutoSearched) {
      setEmail(emailParam)
      setHasAutoSearched(true)
      fetchBookingsWithEmail(emailParam)
    }
  }, [searchParams, hasAutoSearched, fetchBookingsWithEmail])

  const fetchBookings = async () => {
    await fetchBookingsWithEmail(email)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBookings()
  }

  const handlePaymentFromCard = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pemesanan Saya</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua pemesanan lapangan Anda</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Cari Pemesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              type="email"
              placeholder="Masukkan email yang digunakan saat booking"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Mencari..." : "Cari"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tidak Ada Pemesanan</h3>
                <p className="text-muted-foreground">Belum ada pemesanan dengan email tersebut</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Ditemukan {bookings.length} pemesanan</h2>
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdate={fetchBookings}
                    onPayment={() => handlePaymentFromCard(booking)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <PaymentModal
        booking={selectedBooking}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => {
          fetchBookings()
          setShowPaymentModal(false)
        }}
      />
    </div>
  )
}
