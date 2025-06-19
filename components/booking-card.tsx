"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CreditCard, X, CalendarDays } from "lucide-react"
import type { Booking } from "@/lib/types"
import { formatCurrency, formatDateTime, canCancelBooking } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import CancelBookingModal from "./cancel-booking-modal"
import RescheduleBookingModal from "./reschedule-booking-modal"

interface BookingCardProps {
  booking: Booking
  onUpdate: () => void
  onPayment?: () => void
}

export default function BookingCard({ booking, onUpdate, onPayment }: BookingCardProps) {
  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "expired":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi"
      case "pending":
        return "Menunggu Pembayaran"
      case "cancelled":
        return "Dibatalkan"
      case "expired":
        return "Kedaluwarsa"
      default:
        return status
    }
  }

  const handlePayment = async () => {
    if (onPayment) {
      onPayment()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Pembayaran Berhasil",
          description: "Pemesanan Anda telah dikonfirmasi",
        })
        onUpdate()
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

  // Calculate duration and display proper end time
  const calculateDuration = () => {
    const start = Number.parseInt(booking.startTime.split(":")[0])
    const end = Number.parseInt(booking.endTime.split(":")[0])
    return end - start
  }

  const duration = calculateDuration()
  const canModify = canCancelBooking(booking.date, booking.startTime)

  return (
    <>
      <Card className="overflow-hidden border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Booking #{booking.id}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Lapangan {booking.fieldId} • {duration} Jam
              </p>
            </div>
            <Badge className={`${getStatusColor(booking.status)} text-white font-semibold`}>
              {getStatusText(booking.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                <p className="font-semibold text-gray-800">{formatDateTime(booking.date, booking.startTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Durasi</p>
                <p className="font-semibold text-gray-800">
                  {booking.startTime} - {booking.endTime} ({duration} Jam)
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Informasi Pemesan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p>
                <span className="text-gray-600">Nama:</span> <span className="font-medium">{booking.userName}</span>
              </p>
              <p>
                <span className="text-gray-600">Email:</span> <span className="font-medium">{booking.userEmail}</span>
              </p>
              <p>
                <span className="text-gray-600">Telepon:</span> <span className="font-medium">{booking.userPhone}</span>
              </p>
              <p>
                <span className="text-gray-600">Durasi:</span> <span className="font-medium">{duration} Jam</span>
              </p>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
            <div className="text-left">
              <p className="text-sm text-gray-600">Total Pembayaran</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(booking.totalPrice)}</p>
              <p className="text-xs text-gray-500">
                {formatCurrency(booking.totalPrice / duration)}/jam × {duration} jam
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {booking.status === "pending" && (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading ? "Processing..." : "Bayar Sekarang"}
                </Button>
              )}

              {(booking.status === "confirmed" || booking.status === "pending") && (
                <>
                  <Button
                    onClick={() => setShowRescheduleModal(true)}
                    disabled={loading || !canModify}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>

                  <Button
                    onClick={() => setShowCancelModal(true)}
                    disabled={loading || !canModify}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batalkan
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Payment Deadline */}
          {booking.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⏰ <strong>Batas waktu pembayaran:</strong> {booking.paymentDeadline.toLocaleString("id-ID")}
              </p>
            </div>
          )}

          {/* Modification Warning */}
          {!canModify && (booking.status === "confirmed" || booking.status === "pending") && (
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ <strong>Perhatian:</strong> Pembatalan dan reschedule hanya bisa dilakukan maksimal 12 jam sebelum
                waktu pemesanan
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CancelBookingModal
        booking={booking}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={onUpdate}
      />

      <RescheduleBookingModal
        booking={booking}
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSuccess={onUpdate}
      />
    </>
  )
}
