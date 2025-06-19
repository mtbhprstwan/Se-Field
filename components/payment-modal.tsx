"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, Clock, CreditCard } from "lucide-react"
import type { Booking } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
}

export default function PaymentModal({ booking, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success">("pending")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    if (booking && isOpen) {
      // Generate QR code URL (using QR Server API)
      const paymentData = {
        merchant: "Sefield",
        amount: booking.totalPrice,
        bookingId: booking.id,
        description: `Pembayaran booking lapangan #${booking.id}`,
      }

      const qrData = JSON.stringify(paymentData)
      const encodedData = encodeURIComponent(qrData)
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`)

      // Start countdown timer
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const deadline = new Date(booking.paymentDeadline).getTime()
        const difference = deadline - now

        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000))
        } else {
          setTimeLeft(0)
          clearInterval(timer)
          setPaymentStatus("pending")
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [booking, isOpen])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Disalin!",
      description: "Nomor virtual account telah disalin ke clipboard",
    })
  }

  const simulatePayment = async () => {
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/bookings/${booking?.id}/pay`, {
          method: "POST",
        })

        if (response.ok) {
          setPaymentStatus("success")
          toast({
            title: "Pembayaran Berhasil!",
            description: "Anda akan diarahkan ke halaman pemesanan",
          })

          // Redirect to my-bookings with email parameter after 2 seconds
          setTimeout(() => {
            onPaymentSuccess()
            onClose()
            // Redirect to my-bookings with email pre-filled
            router.push(`/my-bookings?email=${encodeURIComponent(booking?.userEmail || "")}`)
          }, 2000)
        } else {
          setPaymentStatus("pending")
          const error = await response.json()
          toast({
            title: "Pembayaran Gagal",
            description: error.error,
            variant: "destructive",
          })
        }
      } catch (error) {
        setPaymentStatus("pending")
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memproses pembayaran",
          variant: "destructive",
        })
      }
    }, 3000)
  }

  if (!booking) return null

  const virtualAccount = `8808${booking.id.padStart(10, "0")}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {paymentStatus === "success" ? "Pembayaran Berhasil!" : "Selesaikan Pembayaran"}
          </DialogTitle>
        </DialogHeader>

        {paymentStatus === "success" ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Pembayaran Berhasil!</h3>
            <p className="text-green-700 mb-4">Pemesanan Anda telah dikonfirmasi.</p>
            <Badge className="bg-green-500 mb-4">Booking Confirmed</Badge>
            <div className="text-sm text-muted-foreground">
              <p>Mengarahkan ke halaman pemesanan...</p>
              <div className="flex justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timer */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Waktu Pembayaran</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
                  </div>
                  <p className="text-sm text-yellow-700">
                    {timeLeft > 0 ? "Selesaikan pembayaran sebelum waktu habis" : "Waktu pembayaran habis"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Amount */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(booking.totalPrice)}</p>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  <p>Booking ID: #{booking.id}</p>
                  <p>Lapangan: {booking.fieldId}</p>
                </div>
              </CardContent>
            </Card>

            {/* QRIS Payment */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-center">Scan QR Code QRIS</h3>

                {/* Step-by-step instructions */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-semibold">📱 Langkah Pembayaran:</p>
                    <p>1. Scan QR code dengan aplikasi pembayaran</p>
                    <p>2. Konfirmasi pembayaran di aplikasi</p>
                    <p>3. Tekan tombol "Konfirmasi Bayar" di bawah</p>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-sm">
                    {qrCodeUrl && (
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="QR Code QRIS"
                        className="w-48 h-48"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground mb-4">
                  <p>Scan dengan aplikasi:</p>
                  <p className="font-semibold">GoPay • OVO • DANA • ShopeePay</p>
                  <p className="font-semibold">Mobile Banking • LinkAja • dll</p>
                </div>

                {/* Payment confirmation button */}
                <div className="border-t pt-4">
                  <Button
                    onClick={simulatePayment}
                    className="w-full h-12 text-lg font-semibold"
                    disabled={timeLeft === 0 || paymentStatus === "processing"}
                    variant={paymentStatus === "processing" ? "secondary" : "default"}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {paymentStatus === "processing" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses Pembayaran...
                      </>
                    ) : (
                      "Konfirmasi Bayar"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Tekan setelah menyelesaikan pembayaran via QRIS
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Account Alternative */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Atau Transfer ke Virtual Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank BCA</p>
                      <p className="font-mono font-semibold text-lg">{virtualAccount}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(virtualAccount)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Mandiri</p>
                      <p className="font-mono font-semibold text-lg">{virtualAccount}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(virtualAccount)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    💡 Setelah transfer, tekan "Konfirmasi Bayar" untuk verifikasi
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Close Button */}
            <div className="pt-2">
              <Button variant="outline" onClick={onClose} className="w-full" disabled={paymentStatus === "processing"}>
                Tutup
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground pb-2">
              <p>
                💡 <strong>Demo Mode:</strong> Tombol "Konfirmasi Bayar" untuk simulasi
              </p>
              <p>Dalam aplikasi nyata, pembayaran akan otomatis terdeteksi</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
