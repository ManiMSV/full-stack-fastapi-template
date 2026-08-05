import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { Button } from "primeng/button"

@Component({
  selector: "app-not-found",
  imports: [RouterLink, Button],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 class="text-6xl font-bold text-surface-900 dark:text-surface-0">404</h1>
      <p class="text-surface-500 dark:text-surface-400">Page not found</p>
      <a routerLink="/">
        <p-button label="Go to Dashboard" />
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
