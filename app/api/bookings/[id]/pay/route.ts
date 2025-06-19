import { type NextRequest, NextResponse } from "next/server"

// Mock bookings storage (same as in route.ts)
const mockBookings: any[] = [
  {
    id: "1",
    fieldId: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "08123456789",
    date: "2024-12-19",
    startTime: "09:00",
    endTime: "11:00",
    totalPrice: 300000,
    status: "confirmed",
    createdAt: new Date("2024-12-18"),
    paymentDeadline: new Date("2024-12-18T10:15:00"),
    notes: "Booking untuk turnamen",
  },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const booking = mockBookings.find((b) => b.id === params.id)

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  if (new Date() > new Date(booking.paymentDeadline)) {
    booking.status = "expired"
    return NextResponse.json({ error: "Waktu pembayaran sudah habis" }, { status: 400 })
  }

  booking.status = "confirmed"

  return NextResponse.json({ message: "Pembayaran berhasil" })
}
