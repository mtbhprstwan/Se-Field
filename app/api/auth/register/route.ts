import { type NextRequest, NextResponse } from "next/server"

// Mock users storage
const mockUsers: any[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    password: "password123", // In real app, this would be hashed
  },
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password, // In real app, hash this password
    }

    mockUsers.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-token-${newUser.id}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 })
  }
}
