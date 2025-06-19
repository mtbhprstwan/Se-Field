"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { Field } from "@/lib/types"

interface TimeSlot {
  time: string
  available: boolean
  bookedBy?: string
}

interface FieldDetailModalProps {
  field: Field
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
}

export default function FieldDetailModal({ field, isOpen, onClose, selectedDate = new Date() }: FieldDetailModalProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(selectedDate)

  // Generate time slots from 06:00 to 23:00
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      // Mock availability based on date - different patterns for different days
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isPeakHour = hour >= 17 && hour <= 21

      // Weekend and peak hours have higher booking rate
      let bookingChance = 0.3
      if (isWeekend) bookingChance += 0.2
      if (isPeakHour) bookingChance += 0.3

      const isBooked = Math.random() > 1 - bookingChance
      slots.push({
        time,
        available: !isBooked,
        bookedBy: isBooked ? `User ${Math.floor(Math.random() * 100)}` : undefined,
      })
    }
    return slots
  }

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setTimeSlots(generateTimeSlots(currentDate))
        setLoading(false)
      }, 500)
    }
  }, [isOpen, field.id, currentDate])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString()
  }

  const availableSlots = timeSlots.filter((slot) => slot.available).length
  const bookedSlots = timeSlots.filter((slot) => !slot.available).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold sport-text-gradient">Detail {field.name}</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {field.type}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(field.price)}/jam
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Date Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Pilih Tanggal
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Date Selector - Next 7 Days */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {getNext7Days().map((date, index) => (
                <Button
                  key={index}
                  variant={isSameDate(date, currentDate) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentDate(date)}
                  className={`flex flex-col p-3 h-auto ${
                    isSameDate(date, currentDate)
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:bg-purple-50 border-purple-200"
                  }`}
                >
                  <span className="text-xs font-medium">
                    {isToday(date) ? "Hari Ini" : formatDateShort(date).split(" ")[0]}
                  </span>
                  <span className="text-sm font-bold">{date.getDate()}</span>
                </Button>
              ))}
            </div>

            {/* Selected Date Display */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">{formatDate(currentDate)}</span>
                {isToday(currentDate) && <Badge className="bg-green-500 hover:bg-green-600 text-xs">Hari Ini</Badge>}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
              <div className="text-sm text-green-700">Slot Tersedia</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{bookedSlots}</div>
              <div className="text-sm text-red-700">Slot Terboking</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{timeSlots.length}</div>
              <div className="text-sm text-blue-700">Total Slot</div>
            </div>
          </div>

          {/* Time Slots Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Jadwal Ketersediaan</h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Memuat jadwal...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`
                      p-3 rounded-lg border-2 text-center transition-all duration-200
                      ${slot.available ? "bg-green-50 border-green-200 hover:bg-green-100" : "bg-red-50 border-red-200"}
                    `}
                  >
                    <div className="font-semibold text-lg">{slot.time}</div>
                    <Badge
                      className={`mt-1 text-xs ${
                        slot.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {slot.available ? "✅ Tersedia" : "❌ Terboking"}
                    </Badge>
                    {!slot.available && slot.bookedBy && (
                      <div className="text-xs text-gray-500 mt-1">oleh {slot.bookedBy}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Tersedia untuk booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Sudah terboking</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button
            className="sport-button"
            onClick={() => {
              onClose()
              // Navigate to booking page with selected date
              const dateParam = currentDate.toISOString().split("T")[0]
              window.location.href = `/booking/${field.id}?date=${dateParam}`
            }}
          >
            Book Sekarang
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
