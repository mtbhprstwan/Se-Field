import type { User } from "../../domain/entities/user.entity"
import type { UserRepository } from "../../domain/repositories/user.repository"

class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email.toString() === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id.toString() === id) || null
  }

  async save(user: User): Promise<void> {
    this.users.push(user)
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id.toString() === user.id.toString())
    if (index !== -1) {
      this.users[index] = user
    }
  }
}

export const userRepository = new InMemoryUserRepository()
