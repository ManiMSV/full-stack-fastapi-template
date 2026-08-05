import { Injectable, inject, signal } from "@angular/core"
import { Api } from "./api/api"
import { loginLoginAccessToken } from "./api/fn/login/login-login-access-token"
import { usersReadUserMe } from "./api/fn/users/users-read-user-me"
import type { UserPublic } from "./api/models/user-public"

const TOKEN_KEY = "access_token"

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly #api = inject(Api)

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY))
  readonly session = signal<UserPublic | null>(null)

  get isAuthenticated(): boolean {
    return this.token() !== null
  }

  async login(username: string, password: string): Promise<void> {
    const { access_token } = await this.#api.invoke(loginLoginAccessToken, {
      body: { username, password },
    })
    localStorage.setItem(TOKEN_KEY, access_token)
    this.token.set(access_token)
    await this.refreshMe()
  }

  async refreshMe(): Promise<UserPublic | null> {
    if (!this.isAuthenticated) {
      this.session.set(null)
      return null
    }
    const user = await this.#api.invoke(usersReadUserMe)
    this.session.set(user)
    return user
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    this.token.set(null)
    this.session.set(null)
  }
}
