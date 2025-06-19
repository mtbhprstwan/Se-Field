import { type NextRequest, NextResponse } from "next/server"

// Mock bookings storage (in real app, this would be a database)
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
  {
    id: "2",
    fieldId: "2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userPhone: "08987654321",
    date: "2024-12-19",
    startTime: "10:00",
    endTime: "11:00",
    totalPrice: 80000,
    status: "pending",
    createdAt: new Date("2024-12-18"),
    paymentDeadline: new Date("2024-12-19T10:15:00"),
    notes: "Latihan rutin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if slot is still available
    const existingBooking = mockBookings.find(
      (b) =>
        b.fieldId === body.fieldId &&
        b.date === body.date &&
        b.startTime === body.startTime &&
        (b.status === "confirmed" || b.status === "pending"),
    )

    if (existingBooking) {
      return NextResponse.json({ error: "Slot sudah tidak tersedia" }, { status: 400 })
    }

    const booking = {
      id: Date.now().toString(),
      ...body,
      status: "pending",
      createdAt: new Date(),
      paymentDeadline: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    }

    mockBookings.push(booking)

    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat pemesanan" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userEmail = searchParams.get("userEmail")

  if (!userEmail) {
    return NextResponse.json({ error: "User email is required" }, { status: 400 })
  }

  const userBookings = mockBookings.filter((b) => b.userEmail === userEmail)
  return NextResponse.json(userBookings)
}
