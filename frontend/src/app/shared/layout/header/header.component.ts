import { Component, inject } from "@angular/core"
import { Router } from "@angular/router"
import { Menu } from "primeng/menu"

import { AuthService } from "../../../core/auth.service"

@Component({
  selector: "app-header",
  imports: [Menu],
  template: `
    <header class="flex items-center justify-between border-b border-surface-200 px-6 py-3 dark:border-surface-800">
      <span class="text-sm text-surface-500 dark:text-surface-400">Header</span>
      <div>
        <p-menu #menu popup="true" [model]="menuItems" />
        <button
          data-testid="user-menu"
          type="button"
          (click)="menu.toggle($event)"
          class="rounded px-3 py-1.5 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
        >
          {{ authService.session()?.email ?? "Account" }}
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  protected readonly menuItems = [
    { label: "Log out", command: (): void => this.logout() },
  ]

  protected logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
