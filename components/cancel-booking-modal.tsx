"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, X } from "lucide-react"
import type { Booking } from "@/lib/types"
import { formatDateTime, canCancelBooking } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CancelBookingModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CancelBookingModal({ booking, isOpen, onClose, onSuccess }: CancelBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const { toast } = useToast()

  const handleCancel = async () => {
    if (!booking) return

    if (!canCancelBooking(booking.date, booking.startTime)) {
      toast({
        title: "Tidak Dapat Dibatalkan",
        description: "Pembatalan hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        toast({
          title: "Pemesanan Dibatalkan",
          description: "Pemesanan Anda telah berhasil dibatalkan",
        })
        onSuccess()
        onClose()
        setReason("")
      } else {
        const error = await response.json()
        toast({
          title: "Gagal Membatalkan",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membatalkan pemesanan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return null

  const canCancel = canCancelBooking(booking.date, booking.startTime)
  const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`)
  const now = new Date()
  const timeDiff = bookingDateTime.getTime() - now.getTime()
  const hoursDiff = Math.floor(timeDiff / (1000 * 3600))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            Batalkan Pemesanan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Detail Pemesanan</h3>
              <p className="text-sm text-muted-foreground">Booking ID: #{booking.id}</p>
              <p className="text-sm">{formatDateTime(booking.date, booking.startTime)}</p>
              <p className="text-sm">Lapangan: {booking.fieldId}</p>
            </CardContent>
          </Card>

          {/* Warning */}
          {!canCancel ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Tidak Dapat Dibatalkan</h4>
                    <p className="text-sm text-red-700">
                      Pembatalan hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan.
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Waktu tersisa: {hoursDiff > 0 ? `${hoursDiff} jam` : "Kurang dari 1 jam"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Konfirmasi Pembatalan</h4>
                    <p className="text-sm text-yellow-700">Pemesanan akan dibatalkan dan tidak dapat dikembalikan.</p>
                    <p className="text-sm text-yellow-700 mt-1">Waktu tersisa untuk pembatalan: {hoursDiff} jam</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason Input */}
          {canCancel && (
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Pembatalan (Opsional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Batal
            </Button>
            {canCancel && (
              <Button onClick={handleCancel} variant="destructive" className="flex-1" disabled={loading}>
                {loading ? "Membatalkan..." : "Batalkan Pemesanan"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
