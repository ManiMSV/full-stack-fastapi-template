import { TestBed } from "@angular/core/testing"
import { Api } from "./api/api"
import { loginLoginAccessToken } from "./api/fn/login/login-login-access-token"
import { usersReadUserMe } from "./api/fn/users/users-read-user-me"
import type { UserPublic } from "./api/models/user-public"
import { AuthService } from "./auth.service"

const TOKEN_KEY = "access_token"

const mockUser: UserPublic = {
  id: "user-1",
  email: "user@example.com",
  full_name: "Test User",
  is_active: true,
  is_superuser: false,
}

describe("AuthService", () => {
  let api: { invoke: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    localStorage.clear()
    api = { invoke: vi.fn() }
  })

  function createService(): AuthService {
    TestBed.configureTestingModule({
      providers: [{ provide: Api, useValue: api }],
    })
    return TestBed.inject(AuthService)
  }

  function mockLoginFlow(): void {
    api.invoke.mockImplementation((fn: unknown) => {
      if (fn === loginLoginAccessToken) {
        return Promise.resolve({ access_token: "new-token" })
      }
      if (fn === usersReadUserMe) {
        return Promise.resolve(mockUser)
      }
      throw new Error(`Unexpected API call: ${String(fn)}`)
    })
  }

  it("restores token from localStorage on init", () => {
    localStorage.setItem(TOKEN_KEY, "stored-token")
    const service = createService()
    expect(service.token()).toBe("stored-token")
    expect(service.isAuthenticated).toBe(true)
  })

  it("is unauthenticated when no token is stored", () => {
    const service = createService()
    expect(service.token()).toBeNull()
    expect(service.isAuthenticated).toBe(false)
    expect(service.session()).toBeNull()
  })

  it("login persists token and loads session", async () => {
    mockLoginFlow()
    const service = createService()

    await service.login("user@example.com", "secret")

    expect(api.invoke).toHaveBeenCalledWith(loginLoginAccessToken, {
      body: { username: "user@example.com", password: "secret" },
    })
    expect(localStorage.getItem(TOKEN_KEY)).toBe("new-token")
    expect(service.token()).toBe("new-token")
    expect(service.session()).toEqual(mockUser)
  })

  it("failed login rejects and does not persist token", async () => {
    api.invoke.mockRejectedValue(new Error("Unauthorized"))
    const service = createService()

    await expect(service.login("user@example.com", "wrong")).rejects.toThrow(
      "Unauthorized",
    )
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(service.token()).toBeNull()
    expect(service.isAuthenticated).toBe(false)
  })

  it("logout clears token and session", async () => {
    mockLoginFlow()
    const service = createService()
    await service.login("user@example.com", "secret")

    service.logout()

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(service.token()).toBeNull()
    expect(service.session()).toBeNull()
    expect(service.isAuthenticated).toBe(false)
  })

  it("refreshMe returns null when not authenticated", async () => {
    const service = createService()

    const result = await service.refreshMe()

    expect(result).toBeNull()
    expect(service.session()).toBeNull()
    expect(api.invoke).not.toHaveBeenCalled()
  })
})
