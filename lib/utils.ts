import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTimeSlots(startHour: string, endHour: string): string[] {
  const slots: string[] = []
  const start = Number.parseInt(startHour.split(":")[0])
  const end = Number.parseInt(endHour.split(":")[0])

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }

  return slots
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function canCancelBooking(bookingDate: string, bookingTime: string): boolean {
  const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`)
  const now = new Date()
  const timeDiff = bookingDateTime.getTime() - now.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)

  return hoursDiff >= 12
}

export function isPaymentExpired(paymentDeadline: Date): boolean {
  return new Date() > paymentDeadline
}
