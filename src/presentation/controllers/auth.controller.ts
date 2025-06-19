import { type NextRequest, NextResponse } from "next/server"
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case"
import { LoginUserUseCase } from "../../application/use-cases/login-user.use-case"
import { userRepository } from "../../infrastructure/repositories/in-memory-user.repository"

export class AuthController {
  private registerUseCase = new RegisterUserUseCase(userRepository)
  private loginUseCase = new LoginUserUseCase(userRepository)

  async register(request: NextRequest) {
    try {
      const body = await request.json()
      const result = await this.registerUseCase.execute(body)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Registration failed" },
        { status: 400 },
      )
    }
  }

  async login(request: NextRequest) {
    try {
      const body = await request.json()
      const result = await this.loginUseCase.execute(body)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 401 })
    }
  }
}
