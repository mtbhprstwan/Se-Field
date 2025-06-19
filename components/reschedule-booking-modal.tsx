"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Clock, AlertTriangle } from "lucide-react"
import type { Booking } from "@/lib/types"
import { formatDateTime, canCancelBooking } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface RescheduleBookingModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RescheduleBookingModal({ booking, isOpen, onClose, onSuccess }: RescheduleBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedDate && booking) {
      fetchAvailability()
    }
  }, [selectedDate, booking])

  const fetchAvailability = async () => {
    if (!selectedDate || !booking) return

    setLoadingSlots(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/fields/${booking.fieldId}/availability?date=${dateStr}`)
      const data = await response.json()
      setTimeSlots(data)
    } catch (error) {
      console.error("Error fetching availability:", error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleReschedule = async () => {
    if (!booking || !selectedDate || !selectedTime) return

    if (!canCancelBooking(booking.date, booking.startTime)) {
      toast({
        title: "Tidak Dapat Diubah",
        description: "Reschedule hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newDate = selectedDate.toISOString().split("T")[0]
      const newEndTime = `${Number.parseInt(selectedTime.split(":")[0]) + 1}:00`

      const response = await fetch(`/api/bookings/${booking.id}/reschedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDate,
          newStartTime: selectedTime,
          newEndTime,
        }),
      })

      if (response.ok) {
        toast({
          title: "Jadwal Berhasil Diubah",
          description: "Pemesanan Anda telah dijadwal ulang",
        })
        onSuccess()
        onClose()
        setSelectedDate(undefined)
        setSelectedTime("")
      } else {
        const error = await response.json()
        toast({
          title: "Gagal Mengubah Jadwal",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengubah jadwal",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return null

  const canReschedule = canCancelBooking(booking.date, booking.startTime)
  const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`)
  const now = new Date()
  const timeDiff = bookingDateTime.getTime() - now.getTime()
  const hoursDiff = Math.floor(timeDiff / (1000 * 3600))

  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            Reschedule Pemesanan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Booking Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Pemesanan Saat Ini</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Booking ID</p>
                  <p className="font-semibold">#{booking.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jadwal Saat Ini</p>
                  <p className="font-semibold">{formatDateTime(booking.date, booking.startTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          {!canReschedule ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Tidak Dapat Diubah</h4>
                    <p className="text-sm text-red-700">
                      Reschedule hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan.
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Waktu tersisa: {hoursDiff > 0 ? `${hoursDiff} jam` : "Kurang dari 1 jam"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Pilih Tanggal Baru</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < today || date > maxDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Pilih Waktu Baru</h3>
                  {!selectedDate ? (
                    <p className="text-muted-foreground text-center py-8">Pilih tanggal terlebih dahulu</p>
                  ) : loadingSlots ? (
                    <p className="text-center py-8">Memuat jadwal...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="flex flex-col h-auto p-3"
                          size="sm"
                        >
                          <span className="font-semibold">{slot.time}</span>
                          <span className="text-xs">{slot.available ? "Tersedia" : "Tidak Tersedia"}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* New Schedule Summary */}
          {selectedDate && selectedTime && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">Jadwal Baru</h3>
                <div className="flex items-center gap-2 text-green-700">
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(selectedDate.toISOString().split("T")[0], selectedTime)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Batal
            </Button>
            {canReschedule && (
              <Button
                onClick={handleReschedule}
                className="flex-1"
                disabled={loading || !selectedDate || !selectedTime}
              >
                {loading ? "Mengubah Jadwal..." : "Konfirmasi Reschedule"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
