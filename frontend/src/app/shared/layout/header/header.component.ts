import { Component, inject, signal } from "@angular/core"
import { Router } from "@angular/router"

import { AuthService } from "../../../core/auth.service"

@Component({
  selector: "app-header",
  imports: [],
  template: `
    <header class="flex items-center justify-between border-b border-surface-200 px-6 py-3 dark:border-surface-800">
      <span class="text-sm text-surface-500 dark:text-surface-400">Header</span>
      <div class="relative">
        <button
          data-testid="user-menu"
          type="button"
          aria-haspopup="menu"
          aria-expanded="{{ menuOpen() }}"
          (click)="menuOpen.set(!menuOpen())"
          class="rounded px-3 py-1.5 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
        >
          {{ authService.session()?.email ?? "Account" }}
        </button>
        @if (menuOpen()) {
          <div class="fixed inset-0 z-40" (click)="menuOpen.set(false)"></div>
          <div
            role="menu"
            class="absolute right-0 z-50 mt-1 min-w-40 rounded border border-surface-200 bg-surface-0 py-1 shadow-lg dark:border-surface-800 dark:bg-surface-900"
          >
            <button
              role="menuitem"
              type="button"
              (click)="logout()"
              class="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
            >
              Log out
            </button>
          </div>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  protected readonly menuOpen = signal(false)

  protected logout(): void {
    this.menuOpen.set(false)
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
