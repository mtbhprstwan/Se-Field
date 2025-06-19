import { type NextRequest, NextResponse } from "next/server"
import { bookings, updateBooking } from "@/lib/data"
import { canCancelBooking } from "@/lib/utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newDate, newStartTime, newEndTime } = await request.json()

    const booking = bookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (!canCancelBooking(booking.date, booking.startTime)) {
      return NextResponse.json(
        { error: "Reschedule hanya bisa dilakukan maksimal 12 jam sebelum waktu pemesanan" },
        { status: 400 },
      )
    }

    // Check if new slot is available
    const conflictingBooking = bookings.find(
      (b) =>
        b.fieldId === booking.fieldId &&
        b.date === newDate &&
        b.startTime === newStartTime &&
        b.id !== params.id &&
        (b.status === "confirmed" || b.status === "pending"),
    )

    if (conflictingBooking) {
      return NextResponse.json({ error: "Slot baru sudah tidak tersedia" }, { status: 400 })
    }

    // Store old schedule for history
    const oldSchedule = {
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    }

    updateBooking(params.id, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      rescheduledAt: new Date(),
      oldSchedule: oldSchedule,
    })

    return NextResponse.json({
      message: "Jadwal berhasil diubah",
      booking: bookings.find((b) => b.id === params.id),
    })
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengubah jadwal" }, { status: 500 })
  }
}
