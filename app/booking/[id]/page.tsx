"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import BookingCalendar from "@/components/booking-calendar"
import BookingForm from "@/components/booking-form"
import LoginModal from "@/components/auth/login-modal"
import type { Field } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import PaymentModal from "@/components/payment-modal"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [field, setField] = useState<Field | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<any>(null)

  useEffect(() => {
    fetchField()
  }, [params.id])

  // Check if user needs to login when component mounts
  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginModal(true)
    }
  }, [user, isLoading])

  const fetchField = async () => {
    if (!params.id) return  // <-- cegah error saat undefined
  
    try {
      const response = await fetch("/api/fields")
      const fields: Field[] = await response.json()
  
      const currentField = fields.find((f) => f.id === params.id)
      setField(currentField || null)
    } catch (error) {
      console.error("Error fetching field:", error)
    }
  }
  

  const handleSlotSelect = (date: Date, time: string, price: number) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setSelectedDate(date)
    setSelectedTime(time)
    setSelectedPrice(price)
  }

  const handleBookingSubmit = async (formData: any) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!selectedDate || !selectedTime || !field) return

    setLoading(true)
    try {
      const bookingData = {
        fieldId: field.id,
        ...formData,
        date: selectedDate.toISOString().split("T")[0],
        startTime: selectedTime,
        totalPrice: selectedPrice * formData.duration,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const booking = await response.json()
        setCurrentBooking(booking)
        setShowPaymentModal(true)

        toast({
          title: "Pemesanan Berhasil! 🎉",
          description: "Silakan selesaikan pembayaran",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Pemesanan Gagal ❌",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error ❌",
        description: "Terjadi kesalahan saat memproses pemesanan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    router.push(`/booking-success/${currentBooking.id}`)
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    toast({
      title: "Login Berhasil! 🎉",
      description: "Sekarang Anda bisa melanjutkan booking",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!field) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Field tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
        <p className="text-muted-foreground">{field.description}</p>
        {!user && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ Anda perlu login terlebih dahulu untuk melakukan booking</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BookingCalendar fieldId={field.id} onSlotSelect={handleSlotSelect} />
        </div>
        <div>
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            price={selectedPrice}
            fieldName={field.name}
            onSubmit={handleBookingSubmit}
            loading={loading}
          />
        </div>
      </div>

      <PaymentModal
        booking={currentBooking}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
