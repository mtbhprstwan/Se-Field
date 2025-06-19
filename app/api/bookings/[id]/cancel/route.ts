import { type NextRequest, NextResponse } from "next/server"

// Mock bookings storage
const mockBookings: any[] = []

function canCancelBooking(date: string, startTime: string): boolean {
  const bookingDateTime = new Date(`${date}T${startTime}`)
  const now = new Date()
  const timeDiff = bookingDateTime.getTime() - now.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  return hoursDiff >= 12
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { reason } = await request.json()

    const bookingIndex = mockBookings.findIndex((b) => b.id === params.id)
    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const booking = mockBookings[bookingIndex]

    if (!canCancelBooking(booking.date, booking.startTime)) {
      return NextResponse.json(
        { error: "Pembatalan hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan" },
        { status: 400 },
      )
    }

    mockBookings[bookingIndex] = {
      ...booking,
      status: "cancelled",
      cancellationReason: reason || "Tidak ada alasan",
      cancelledAt: new Date(),
    }

    return NextResponse.json({
      message: "Booking berhasil dibatalkan",
      booking: mockBookings[bookingIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Gagal membatalkan booking" }, { status: 500 })
  }
}
