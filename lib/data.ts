import type { Field, Booking } from "./types"

export const fields: Field[] = [
  {
    id: "1",
    name: "Lapangan Futsal A",
    type: "Futsal",
    price: 150000,
    image: "/placeholder.svg?height=300&width=400",
    description: "Lapangan futsal dengan rumput sintetis berkualitas tinggi",
    operationalHours: {
      start: "06:00",
      end: "23:00",
    },
  },
  {
    id: "2",
    name: "Lapangan Badminton 1",
    type: "Badminton",
    price: 80000,
    image: "/placeholder.svg?height=300&width=400",
    description: "Lapangan badminton indoor dengan AC",
    operationalHours: {
      start: "07:00",
      end: "22:00",
    },
  },
  {
    id: "3",
    name: "Lapangan Basket Outdoor",
    type: "Basketball",
    price: 120000,
    image: "/placeholder.svg?height=300&width=400",
    description: "Lapangan basket outdoor dengan pencahayaan LED",
    operationalHours: {
      start: "06:00",
      end: "22:00",
    },
  },
]

// In-memory storage for bookings (in production, use a real database)
export let bookings: Booking[] = []

export const addBooking = (booking: Booking) => {
  bookings.push(booking)
}

export const updateBooking = (id: string, updates: Partial<Booking>) => {
  const index = bookings.findIndex((b) => b.id === id)
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates }
  }
}

export const deleteBooking = (id: string) => {
  bookings = bookings.filter((b) => b.id !== id)
}
