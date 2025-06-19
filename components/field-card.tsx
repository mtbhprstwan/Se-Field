"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, Zap } from "lucide-react"
import type { Field } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import LoginModal from "@/components/auth/login-modal"
import { useRouter } from "next/navigation"

interface FieldCardProps {
  field: Field
}

export default function FieldCard({ field }: FieldCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const getFieldGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case "futsal":
        return "sport-gradient"
      case "badminton":
        return "sport-gradient-2"
      case "basketball":
        return "sport-gradient-3"
      default:
        return "sport-gradient-4"
    }
  }

  const handleBookNowClick = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    router.push(`/booking/${field.id}`)
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    router.push(`/booking/${field.id}`)
  }

  return (
    <>
      <Card className="sport-card border-0 overflow-hidden group">
        <div className="relative">
          <Image
            src={field.image || "/placeholder.svg"}
            alt={field.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <Badge className={`absolute top-3 right-3 ${getFieldGradient(field.type)} text-white border-0 font-bold`}>
            {field.type}
          </Badge>
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold ml-1">5.0</span>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{field.name}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{field.description}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {field.operationalHours.start} - {field.operationalHours.end}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Jakarta Selatan</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Mulai dari</div>
                <div className="text-2xl font-black sport-text-gradient">{formatCurrency(field.price)}</div>
                <div className="text-xs text-gray-500">per jam</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-semibold">✓ Tersedia</div>
                <div className="text-xs text-gray-500">Hari ini</div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={handleBookNowClick}
            className="w-full sport-button text-white font-bold py-3 rounded-xl group"
          >
            <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            BOOK NOW
          </Button>
        </CardFooter>
      </Card>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
