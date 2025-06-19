"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { fields } from "@/lib/data"
import FieldDetailModal from "@/components/field-detail-modal"

interface WeekRange {
  start: Date
  end: Date
}

interface BookingBlock {
  id: string
  fieldId: string
  time: string
  duration: number
  status: "khusus" | "lunas" | "pending"
  customerName?: string
}

export default function WeeklyAvailabilityTable({ weekRange }: { weekRange: WeekRange }) {
  const [bookings, setBookings] = useState<BookingBlock[]>([])
  const [selectedField, setSelectedField] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Generate week days
  const getWeekDays = () => {
    const days = []
    const current = new Date(weekRange.start)

    for (let i = 0; i < 7; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const weekDays = getWeekDays()
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  // Sample booking data - in real app, fetch from API
  useEffect(() => {
    const sampleBookings: BookingBlock[] = [
      // Wednesday
      { id: "1", fieldId: "1", time: "20", duration: 1, status: "khusus" },
      // Thursday
      { id: "2", fieldId: "1", time: "16", duration: 1, status: "khusus" },
      { id: "3", fieldId: "2", time: "18", duration: 1, status: "khusus" },
      { id: "4", fieldId: "3", time: "18", duration: 1, status: "lunas" },
      { id: "5", fieldId: "1", time: "20", duration: 1, status: "khusus" },
      // Friday
      { id: "6", fieldId: "1", time: "06", duration: 1, status: "khusus" },
      { id: "7", fieldId: "2", time: "08", duration: 1, status: "khusus" },
      { id: "8", fieldId: "3", time: "16", duration: 1, status: "khusus" },
      { id: "9", fieldId: "1", time: "18", duration: 1, status: "khusus" },
      { id: "10", fieldId: "2", time: "20", duration: 1, status: "khusus" },
      // Saturday
      { id: "11", fieldId: "1", time: "08", duration: 1, status: "lunas" },
      { id: "12", fieldId: "2", time: "10", duration: 1, status: "lunas" },
      { id: "13", fieldId: "3", time: "12", duration: 1, status: "lunas" },
      { id: "14", fieldId: "1", time: "18", duration: 1, status: "lunas" },
      // Sunday
      { id: "15", fieldId: "1", time: "08", duration: 1, status: "lunas" },
      { id: "16", fieldId: "2", time: "10", duration: 1, status: "lunas" },
      { id: "17", fieldId: "3", time: "12", duration: 1, status: "lunas" },
      { id: "18", fieldId: "1", time: "18", duration: 1, status: "khusus" },
    ]

    setBookings(sampleBookings)
  }, [weekRange])

  const getBookingsForDay = (dayIndex: number) => {
    // Filter bookings for specific day
    return bookings.filter((booking) => {
      // In real app, you'd match by actual date
      // For demo, distribute bookings across week
      if (dayIndex === 2) return ["1", "2", "3", "4", "5"].includes(booking.id) // Wednesday
      if (dayIndex === 3) return ["6", "7", "8", "9", "10"].includes(booking.id) // Thursday
      if (dayIndex === 4) return ["11", "12", "13", "14"].includes(booking.id) // Friday
      if (dayIndex === 5) return ["15", "16", "17", "18"].includes(booking.id) // Saturday
      return false
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "khusus":
        return "bg-teal-400 text-white border-teal-500"
      case "lunas":
        return "bg-blue-500 text-white border-blue-600"
      case "pending":
        return "bg-orange-400 text-white border-orange-500"
      default:
        return "bg-gray-400 text-white border-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "khusus":
        return "Khusus"
      case "lunas":
        return "Lunas"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  const handleDetailClick = (field: any) => {
    setSelectedField(field)
    setShowDetailModal(true)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50 font-semibold text-center border-r border-gray-200">Lapangan</div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                <div className="font-semibold text-sm">
                  {dayNames[index]} {day.getDate()}/{day.getMonth() + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Field Rows */}
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-8 border-b border-gray-200 min-h-[200px]">
              {/* Field Name Column */}
              <div className="p-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-center">
                <div className="font-semibold text-sm">{field.name}</div>
                <div className="text-xs text-gray-500 mb-2">{field.type}</div>
                <div className="text-xs text-purple-600 font-medium mb-3">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(field.price)}
                  /jam
                </div>

                {/* Detail Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDetailClick(field)}
                  className="w-full text-xs border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Info className="w-3 h-3 mr-1" />
                  Detail
                </Button>
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIndex) => {
                const dayBookings = getBookingsForDay(dayIndex).filter((b) => b.fieldId === field.id.toString())

                return (
                  <div key={dayIndex} className="p-2 border-r border-gray-200 last:border-r-0 bg-yellow-50/30">
                    <div className="space-y-1">
                      {dayBookings.map((booking) => (
                        <Badge
                          key={booking.id}
                          className={`${getStatusColor(booking.status)} text-xs font-medium px-2 py-1 rounded-md block text-center`}
                        >
                          {booking.time} {getStatusLabel(booking.status)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Field Detail Modal */}
      {selectedField && (
        <FieldDetailModal
          field={selectedField}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedField(null)
          }}
          selectedDate={weekRange.start}
        />
      )}
    </>
  )
}
