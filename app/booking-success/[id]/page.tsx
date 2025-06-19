"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CreditCard, Calendar, ArrowRight } from "lucide-react"
import type { Booking } from "@/lib/types"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function BookingSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  useEffect(() => {
    if (booking && booking.status === "pending") {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const deadline = new Date(booking.paymentDeadline).getTime()
        const difference = deadline - now

        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000))
        } else {
          setTimeLeft(0)
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [booking])

  const fetchBooking = async () => {
    try {
      // In a real app, you'd fetch the specific booking
      // For now, we'll simulate it
      const response = await fetch(`/api/bookings?userEmail=dummy@email.com`)
      const bookings = await response.json()
      const currentBooking = bookings.find((b: Booking) => b.id === params.id)
      setBooking(currentBooking)
    } catch (error) {
      console.error("Error fetching booking:", error)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${params.id}/pay`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Pembayaran Berhasil!",
          description: "Mengarahkan ke halaman pemesanan...",
        })

        // Redirect to my-bookings with email parameter
        setTimeout(() => {
          router.push(`/my-bookings?email=${encodeURIComponent(booking?.userEmail || "")}`)
        }, 1500)
      } else {
        const error = await response.json()
        toast({
          title: "Pembayaran Gagal",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses pembayaran",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const goToMyBookings = () => {
    router.push(`/my-bookings?email=${encodeURIComponent(booking?.userEmail || "")}`)
  }

  if (!booking) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const endTime = `${Number.parseInt(booking.startTime.split(":")[0]) + 1}:00`

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pemesanan Berhasil!</h1>
        <p className="text-muted-foreground">Booking ID: #{booking.id}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detail Pemesanan</CardTitle>
            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
              {booking.status === "confirmed" ? "Dikonfirmasi" : "Menunggu Pembayaran"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tanggal & Waktu</p>
                <p className="font-semibold">{formatDateTime(booking.date, booking.startTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Durasi</p>
                <p className="font-semibold">
                  {booking.startTime} - {endTime}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Informasi Pemesan</h3>
            <p>
              <strong>Nama:</strong> {booking.userName}
            </p>
            <p>
              <strong>Email:</strong> {booking.userEmail}
            </p>
            <p>
              <strong>Telepon:</strong> {booking.userPhone}
            </p>
          </div>

          <div className="flex justify-between items-center text-lg">
            <span>Total Pembayaran:</span>
            <span className="font-bold text-primary">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </CardContent>
      </Card>

      {booking.status === "pending" && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Menunggu Pembayaran</h3>
                <p className="text-sm text-yellow-700">Selesaikan pembayaran sebelum waktu habis</p>
              </div>
            </div>

            {timeLeft > 0 ? (
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{formatTime(timeLeft)}</div>
                <p className="text-sm text-yellow-700">Waktu tersisa untuk pembayaran</p>
              </div>
            ) : (
              <div className="text-center mb-4">
                <p className="text-red-600 font-semibold">Waktu pembayaran telah habis</p>
              </div>
            )}

            <Button onClick={handlePayment} disabled={loading || timeLeft === 0} className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </CardContent>
        </Card>
      )}

      {booking.status === "confirmed" && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Pembayaran Berhasil!</h3>
            <p className="text-green-700">
              Pemesanan Anda telah dikonfirmasi. Silakan datang sesuai jadwal yang telah ditentukan.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Kembali ke Beranda
          </Button>
        </Link>
        <Button onClick={goToMyBookings} className="flex-1">
          <ArrowRight className="w-4 h-4 mr-2" />
          Lihat Semua Pemesanan
        </Button>
      </div>
    </div>
  )
}
