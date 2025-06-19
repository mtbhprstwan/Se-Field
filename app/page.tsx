import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FieldCard from "@/components/field-card"
import { fields } from "@/lib/data"
import { Calendar, Clock, CreditCard, Shield, Zap, Trophy, Target, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-float">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            BOOK YOUR
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              GAME TIME
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto font-light">
            Platform booking lapangan olahraga terdepan dengan teknologi terkini
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#fields">
              <Button size="lg" className="sport-button text-white font-bold px-8 py-4 text-lg rounded-full">
                <Zap className="w-5 h-5 mr-2" />
                MULAI BOOKING
              </Button>
            </Link>
            <Link href="/my-bookings">
              <Button
                size="lg"
                variant="outline"
                className="glass-effect text-white border-white/30 hover:bg-white/20 font-bold px-8 py-4 text-lg rounded-full"
              >
                <Target className="w-5 h-5 mr-2" />
                CEK BOOKING
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="w-16 h-16 rounded-full sport-gradient opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-12 h-12 rounded-full sport-gradient-2 opacity-20"></div>
        </div>
        <div className="absolute top-1/2 right-20 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-8 h-8 rounded-full sport-gradient-3 opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full sport-gradient flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full sport-gradient-2 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full sport-gradient-3 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Sports Venues</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full sport-gradient-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="sport-text-gradient">KENAPA PILIH SEFIELD?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teknologi terdepan untuk pengalaman booking yang tak terlupakan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="sport-card border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl sport-gradient flex items-center justify-center group-hover:animate-pulse-glow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Real-time Booking</h3>
                <p className="text-gray-600">Lihat ketersediaan lapangan secara real-time dengan teknologi terdepan</p>
              </CardContent>
            </Card>

            <Card className="sport-card border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl sport-gradient-2 flex items-center justify-center group-hover:animate-pulse-glow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Flexible Schedule</h3>
                <p className="text-gray-600">Ubah jadwal dengan mudah hingga H-12 jam sebelum main</p>
              </CardContent>
            </Card>

            <Card className="sport-card border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl sport-gradient-3 flex items-center justify-center group-hover:animate-pulse-glow">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Secure Payment</h3>
                <p className="text-gray-600">Sistem pembayaran QRIS yang aman dan terpercaya</p>
              </CardContent>
            </Card>

            <Card className="sport-card border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl sport-gradient-4 flex items-center justify-center group-hover:animate-pulse-glow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Money Back</h3>
                <p className="text-gray-600">Garansi uang kembali dengan kebijakan yang jelas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section id="fields" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="sport-text-gradient">PILIH LAPANGAN FAVORITMU</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Berbagai pilihan lapangan berkualitas tinggi untuk semua jenis olahraga
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 sport-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-float">
            <Target className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">READY TO PLAY?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Jangan tunggu lagi! Book lapangan sekarang dan rasakan pengalaman bermain yang luar biasa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#fields">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-full"
              >
                <Trophy className="w-5 h-5 mr-2" />
                BOOK SEKARANG
              </Button>
            </Link>
            <Link href="/my-bookings">
              <Button
                size="lg"
                variant="outline"
                className="glass-effect text-white border-white/30 hover:bg-white/20 font-bold px-8 py-4 text-lg rounded-full"
              >
                <Calendar className="w-5 h-5 mr-2" />
                CEK BOOKING SAYA
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 animate-float" style={{ animationDelay: "0s" }}>
          <div className="w-20 h-20 rounded-full bg-white/10"></div>
        </div>
        <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-16 h-16 rounded-full bg-white/10"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-12 h-12 rounded-full bg-white/10"></div>
        </div>
      </section>
    </div>
  )
}
