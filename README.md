# Sefield - Field Booking System

Aplikasi pemesanan lapangan olahraga modern dengan Next.js dan TypeScript.

## 🚀 Quick Start

### Prerequisites

Pastikan Anda sudah menginstall:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone repository**
   \`\`\`bash
   git clone <repository-url>
   cd sefield
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser**
   Buka [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
sefield/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── booking/           # Booking pages
│   ├── dashboard/         # Dashboard page
│   ├── my-bookings/       # User bookings
│   └── globals.css        # Global styles
├── components/            # React Components
│   ├── ui/               # UI Components (shadcn/ui)
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities
│   ├── data.ts          # Mock data
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
└── public/              # Static assets
\`\`\`

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
\`\`\`

### VS Code Setup

1. **Install recommended extensions:**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - TypeScript Importer
   - Prettier - Code formatter

2. **VS Code settings** (`.vscode/settings.json`):
   \`\`\`json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   \`\`\`

## 🎯 Features

- ✅ **Field Booking System** - Pemesanan lapangan dengan durasi 1-3 jam
- ✅ **Authentication** - Login/Register system
- ✅ **Payment Simulation** - QRIS payment flow
- ✅ **Dashboard** - Jadwal lapangan dengan availability
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Modern UI** - shadcn/ui components dengan Tailwind CSS

## 🔧 Configuration

### Environment Variables

Buat file `.env.local` (opsional):
\`\`\`env
NEXT_PUBLIC_APP_NAME=Sefield
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Tailwind CSS

Konfigurasi sudah disetup di `tailwind.config.ts` dengan:
- Custom colors untuk brand Sefield
- shadcn/ui integration
- Responsive breakpoints

## 📱 Usage

### 1. Browse Fields
- Lihat daftar lapangan di homepage
- Klik "BOOK NOW" untuk memulai booking

### 2. Authentication
- Klik "Masuk/Daftar" untuk login/register
- Harus login sebelum bisa booking

### 3. Booking Process
- Pilih tanggal dan waktu
- Pilih durasi (1-3 jam)
- Isi data pemesan
- Proses pembayaran dengan QRIS

### 4. Manage Bookings
- Lihat booking di "Pemesanan Saya"
- Cancel atau reschedule booking
- Track payment status

### 5. Dashboard
- Akses "Jadwal Lapangan" untuk monitoring
- Lihat availability semua lapangan
- Klik "Detail" untuk info lengkap




