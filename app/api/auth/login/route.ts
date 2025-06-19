import { type NextRequest, NextResponse } from "next/server"

// Mock users storage (same as register)
const mockUsers: any[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    password: "password123",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = mockUsers.find((u) => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-token-${user.id}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Gagal login" }, { status: 500 })
  }
}
