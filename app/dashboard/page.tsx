"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import WeeklyAvailabilityTable from "@/components/dashboard/weekly-availability-table"
import StatsCards from "@/components/dashboard/stats-cards"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedWeek, setSelectedWeek] = useState(getWeekRange(new Date()))

  function getWeekRange(date: Date) {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    start.setDate(diff)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return { start, end }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
    setSelectedWeek(getWeekRange(newDate))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedWeek(getWeekRange(today))
  }

  const formatDateRange = (start: Date, end: Date) => {
    const startDay = start.getDate()
    const endDay = end.getDate()
    const month = start.toLocaleDateString("id-ID", { month: "short" })
    const year = start.getFullYear()

    return `${startDay} - ${endDay} ${month} ${year}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sport-text-gradient mb-2">Jadwal Lapangan</h1>
          <p className="text-gray-600">Monitor ketersediaan dan jadwal booking lapangan secara real-time</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Weekly Availability Table */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Jadwal Ketersediaan Lapangan
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="text-lg font-bold ml-4">{formatDateRange(selectedWeek.start, selectedWeek.end)}</div>
                <Button variant="outline" size="sm" className="ml-4">
                  Minggu
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <WeeklyAvailabilityTable weekRange={selectedWeek} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
