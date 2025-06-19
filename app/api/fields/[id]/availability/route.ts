import { type NextRequest, NextResponse } from "next/server"

const fields = [
  { id: "1", price: 150000, operationalHours: { start: "06:00", end: "23:00" } },
  { id: "2", price: 80000, operationalHours: { start: "07:00", end: "22:00" } },
  { id: "3", price: 120000, operationalHours: { start: "06:00", end: "22:00" } },
]

// Mock bookings data
const mockBookings = [
  { fieldId: "1", date: "2024-12-19", startTime: "09:00", status: "confirmed" },
  { fieldId: "1", date: "2024-12-19", startTime: "14:00", status: "confirmed" },
  { fieldId: "1", date: "2024-12-19", startTime: "19:00", status: "pending" },
  { fieldId: "2", date: "2024-12-19", startTime: "10:00", status: "confirmed" },
  { fieldId: "2", date: "2024-12-19", startTime: "16:00", status: "confirmed" },
  { fieldId: "3", date: "2024-12-19", startTime: "08:00", status: "confirmed" },
  { fieldId: "3", date: "2024-12-19", startTime: "20:00", status: "confirmed" },
]

function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = []
  const startHour = Number.parseInt(start.split(":")[0])
  const endHour = Number.parseInt(end.split(":")[0])

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }

  return slots
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 })
  }

  const field = fields.find((f) => f.id === params.id)
  if (!field) {
    return NextResponse.json({ error: "Field not found" }, { status: 404 })
  }

  const timeSlots = generateTimeSlots(field.operationalHours.start, field.operationalHours.end)

  const bookedSlots = mockBookings
    .filter((b) => b.fieldId === params.id && b.date === date && (b.status === "confirmed" || b.status === "pending"))
    .map((b) => b.startTime)

  const availability = timeSlots.map((slot) => ({
    time: slot,
    available: !bookedSlots.includes(slot),
    price: field.price,
  }))

  return NextResponse.json(availability)
}
