"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MessageSquare, Clock } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

interface BookingFormProps {
  selectedDate: Date | null
  selectedTime: string
  price: number
  fieldName: string
  onSubmit: (formData: any) => void
  loading: boolean
}

export default function BookingForm({
  selectedDate,
  selectedTime,
  price,
  fieldName,
  onSubmit,
  loading,
}: BookingFormProps) {
  const { user } = useAuth()
  const [duration, setDuration] = useState("1")
  const [formData, setFormData] = useState({
    userName: user?.name || "",
    userEmail: user?.email || "",
    userPhone: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const durationHours = Number.parseInt(duration)
    const endTime = `${Number.parseInt(selectedTime.split(":")[0]) + durationHours}:00`

    onSubmit({
      ...formData,
      duration: durationHours,
      endTime,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!selectedDate || !selectedTime) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Pilih tanggal dan waktu terlebih dahulu</p>
        </CardContent>
      </Card>
    )
  }

  const durationHours = Number.parseInt(duration)
  const endTime = `${Number.parseInt(selectedTime.split(":")[0]) + durationHours}:00`
  const totalPrice = price * durationHours

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Pemesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{fieldName}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(selectedDate.toISOString().split("T")[0], selectedTime)}
            </p>
            <p className="text-sm text-muted-foreground">
              Durasi: {selectedTime} - {endTime} ({duration} jam)
            </p>
            <p className="text-lg font-bold text-primary mt-2">Total: {formatCurrency(totalPrice)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Durasi Bermain
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih durasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Jam - {formatCurrency(price)}</SelectItem>
                <SelectItem value="2">2 Jam - {formatCurrency(price * 2)}</SelectItem>
                <SelectItem value="3">3 Jam - {formatCurrency(price * 3)}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nama Lengkap
            </Label>
            <Input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              placeholder="Masukkan nama lengkap"
              disabled={!!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userEmail" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="userEmail"
              name="userEmail"
              type="email"
              value={formData.userEmail}
              onChange={handleInputChange}
              required
              placeholder="Masukkan email"
              disabled={!!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPhone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Nomor Telepon
            </Label>
            <Input
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleInputChange}
              required
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Tambahkan catatan jika diperlukan"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Pesan Sekarang"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
