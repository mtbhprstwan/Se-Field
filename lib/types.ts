// Legacy types for backward compatibility with existing UI components
export interface Field {
  id: string
  name: string
  type: string
  price: number
  image: string
  description: string
  operationalHours: {
    start: string
    end: string
  }
}

export interface Booking {
  id: string
  fieldId: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "expired"
  createdAt: Date
  paymentDeadline: Date
  cancellationReason?: string
  cancelledAt?: Date
  rescheduledAt?: Date
  oldSchedule?: {
    date: string
    startTime: string
    endTime: string
  }
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
  price: number
}
