"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Zap, CalendarIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface BookingCalendarProps {
  fieldId: string
  onSlotSelect: (date: Date, time: string, price: number) => void
}

export default function BookingCalendar({ fieldId, onSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability()
    }
  }, [selectedDate])

  const fetchAvailability = async () => {
    if (!selectedDate) return

    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/fields/${fieldId}/availability?date=${dateStr}`)
      const data = await response.json()
      setTimeSlots(data)
    } catch (error) {
      console.error("Error fetching availability:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSelect = (time: string, price: number) => {
    setSelectedTime(time)
    if (selectedDate) {
      onSlotSelect(selectedDate, time, price)
    }
  }

  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="sport-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sport-text-gradient">
            <CalendarIcon className="w-5 h-5" />
            Pilih Tanggal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < today || date > maxDate}
            className="rounded-xl border-0 shadow-lg"
          />
        </CardContent>
      </Card>

      <Card className="sport-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sport-text-gradient">
            <Clock className="w-5 h-5" />
            Pilih Waktu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Pilih tanggal terlebih dahulu</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Memuat jadwal...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot.time, slot.price)}
                  className={`flex flex-col h-auto p-4 rounded-xl transition-all duration-300 ${
                    selectedTime === slot.time
                      ? "sport-button text-white"
                      : slot.available
                        ? "hover:scale-105 hover:shadow-lg border-2 border-gray-200 hover:border-purple-300"
                        : "opacity-50"
                  }`}
                >
                  <span className="font-bold text-lg">{slot.time}</span>
                  <span className="text-xs opacity-80">
                    {slot.available ? (
                      <>
                        <Zap className="w-3 h-3 inline mr-1" />
                        {formatCurrency(slot.price)}
                      </>
                    ) : (
                      "Tidak Tersedia"
                    )}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
