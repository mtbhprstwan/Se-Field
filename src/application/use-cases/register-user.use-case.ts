import { User, UserId, Email } from "../../domain/entities/user.entity"
import type { UserRepository } from "../../domain/repositories/user.repository"

export interface RegisterUserRequest {
  name: string
  email: string
  password: string
  phone?: string
}

export interface RegisterUserResponse {
  userId: string
  email: string
  name: string
}

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Validate password
    if (request.password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Create user
    const userId = new UserId(Date.now().toString())
    const email = new Email(request.email)
    const user = new User(userId, email, request.name, request.password, request.phone)

    await this.userRepository.save(user)

    return {
      userId: userId.toString(),
      email: email.toString(),
      name: user.name,
    }
  }
}
