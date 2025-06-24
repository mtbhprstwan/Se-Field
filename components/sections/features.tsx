import { CheckCircle, Clock, RefreshCw, CreditCard } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Penjadwalan Lapangan",
    description: "Pilih jadwal yang tersedia sesuai jam operasional lapangan",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: RefreshCw,
    title: "Reschedule Mudah",
    description: "Ubah jadwal booking maksimal 12 jam sebelum waktu pemesanan",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Clock,
    title: "Pembatalan Fleksibel",
    description: "Batalkan booking maksimal 12 jam sebelum jadwal bermain",
    color: "text-orange-600 bg-orange-100",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Cepat",
    description: "Selesaikan pembayaran dalam 15 menit setelah booking",
    color: "text-purple-600 bg-purple-100",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Fitur Unggulan</h2>
          <p className="mt-4 text-lg text-gray-600">Nikmati kemudahan booking lapangan dengan fitur-fitur terdepan</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${feature.color}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
