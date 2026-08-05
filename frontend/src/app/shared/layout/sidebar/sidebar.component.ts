import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

interface NavEntry {
  label: string
  route: string
  pending?: number
}

@Component({
  selector: "app-sidebar",
  imports: [RouterLink],
  template: `
    <aside class="flex w-60 shrink-0 flex-col gap-1 border-r border-surface-200 p-4 dark:border-surface-800">
      <h2 class="mb-2 px-3 text-sm font-semibold text-surface-900 dark:text-surface-0">
        Full Stack FastAPI
      </h2>
      @for (entry of navEntries; track entry.route) {
        <a
          [routerLink]="entry.route"
          class="flex items-center justify-between rounded px-3 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
        >
          {{ entry.label }}
          @if (entry.pending !== undefined) {
            <span class="rounded-full bg-surface-200 px-2 py-0.5 text-xs text-surface-700 dark:bg-surface-700 dark:text-surface-100">
              {{ entry.pending }}
            </span>
          }
        </a>
      }
    </aside>
  `,
})
export class SidebarComponent {
  protected readonly navEntries: NavEntry[] = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "Items", route: "/items", pending: 0 },
    { label: "Admin Users", route: "/admin/users", pending: 0 },
    { label: "Settings", route: "/settings" },
  ]
}
