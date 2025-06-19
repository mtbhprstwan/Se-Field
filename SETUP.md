# Setup Tutorial - Sefield

## 📋 Step-by-Step Setup

### 1. Install Prerequisites

#### Node.js
1. Download dari [nodejs.org](https://nodejs.org/)
2. Pilih versi LTS (Long Term Support)
3. Install dengan default settings
4. Verify installation:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`

#### Visual Studio Code
1. Download dari [code.visualstudio.com](https://code.visualstudio.com/)
2. Install dengan default settings
3. Buka VS Code

#### Git (Optional)
1. Download dari [git-scm.com](https://git-scm.com/)
2. Install dengan default settings

### 2. Setup Project

#### Option A: Download ZIP
1. Download project sebagai ZIP
2. Extract ke folder pilihan Anda
3. Buka folder di VS Code

#### Option B: Git Clone
\`\`\`bash
git clone <repository-url>
cd sefield
code .
\`\`\`

### 3. Install Dependencies

1. **Buka Terminal di VS Code**
   - Tekan `Ctrl + `` (backtick)
   - Atau menu: Terminal → New Terminal

2. **Install packages**
   \`\`\`bash
   npm install
   \`\`\`
   
   Tunggu sampai selesai (biasanya 2-5 menit)

### 4. Install VS Code Extensions

1. **Buka Extensions panel**
   - Tekan `Ctrl + Shift + X`
   - Atau klik icon Extensions di sidebar

2. **Install extensions berikut:**
   - `Tailwind CSS IntelliSense`
   - `ES7+ React/Redux/React-Native snippets`
   - `Prettier - Code formatter`
   - `TypeScript Importer`

### 5. Run Development Server

1. **Start server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Open browser**
   - Buka [http://localhost:3000](http://localhost:3000)
   - Aplikasi Sefield akan muncul

### 6. Verify Setup

Pastikan semua berfungsi:
- ✅ Homepage loading dengan field cards
- ✅ Login modal bisa dibuka
- ✅ Jadwal Lapangan accessible
- ✅ No error di browser console

## 🎯 Development Workflow

### Daily Development
1. Buka VS Code
2. Open terminal: `Ctrl + ``
3. Run: `npm run dev`
4. Edit files di `components/` atau `app/`
5. Browser auto-refresh saat save

### File Structure
\`\`\`
📁 app/           → Pages (Next.js App Router)
📁 components/    → React Components
📁 lib/          → Utilities & data
📁 public/       → Images & static files
\`\`\`

### Hot Tips
- `Ctrl + S` → Auto format dengan Prettier
- `Ctrl + Shift + P` → Command palette
- `Ctrl + `` → Toggle terminal
- `F12` → Go to definition

## 🚨 Common Issues & Solutions

### Issue: "npm not found"
**Solution:** Install Node.js dari nodejs.org

### Issue: "Port 3000 in use"
**Solution:** 
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Issue: "Module not found"
**Solution:**
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### Issue: TypeScript errors
**Solution:** Restart TS Server
- `Ctrl + Shift + P`
- Type: "TypeScript: Restart TS Server"

### Issue: Tailwind not working
**Solution:** Install Tailwind CSS IntelliSense extension

## 🎉 You're Ready!

Sekarang Anda siap untuk:
- ✅ Edit components
- ✅ Add new features  
- ✅ Customize styling
- ✅ Deploy to production

Happy coding! 🚀
