export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: string,
    private _password: string,
    public readonly phone?: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  get password(): string {
    return this._password
  }

  updatePassword(newPassword: string): void {
    if (newPassword.length < 6) {
      throw new UserError("Password must be at least 6 characters")
    }
    this._password = newPassword
  }

  updateProfile(name: string, phone?: string): void {
    if (!name || name.trim().length === 0) {
      throw new UserError("Name cannot be empty")
    }
    // Update name and phone logic would go here
  }
}

export class UserId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("User ID cannot be empty")
    }
  }

  toString(): string {
    return this.value
  }
}

export class Email {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid email format")
    }
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  toString(): string {
    return this.value
  }
}

export class UserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserError"
  }
}
