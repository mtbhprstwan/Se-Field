import type { UserRepository } from "../../domain/repositories/user.repository"

export interface LoginUserRequest {
  email: string
  password: string
}

export interface LoginUserResponse {
  userId: string
  email: string
  name: string
  token: string
}

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(request.email)
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Verify password (in real app, use bcrypt)
    if (user.password !== request.password) {
      throw new Error("Invalid email or password")
    }

    // Generate simple token (in real app, use JWT)
    const token = Buffer.from(`${user.id.toString()}:${Date.now()}`).toString("base64")

    return {
      userId: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      token,
    }
  }
}
