export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl sport-gradient flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white">Sefield</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Platform booking lapangan olahraga terdepan di Indonesia dengan teknologi terkini
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Layanan</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Booking Lapangan</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pembayaran QRIS</li>
              <li className="hover:text-white transition-colors cursor-pointer">Reschedule</li>
              <li className="hover:text-white transition-colors cursor-pointer">24/7 Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Olahraga</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">⚽ Futsal</li>
              <li className="hover:text-white transition-colors cursor-pointer">🏸 Badminton</li>
              <li className="hover:text-white transition-colors cursor-pointer">🏀 Basketball</li>
              <li className="hover:text-white transition-colors cursor-pointer">🎾 Tennis</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Kontak</h4>
            <ul className="space-y-3 text-gray-400">
              <li>📧 hello@sefield.id</li>
              <li>📞 +62 21 1234 5678</li>
              <li>💬 +62 812 3456 7890</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Sefield. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
