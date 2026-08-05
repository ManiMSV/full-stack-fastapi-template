import { Component } from "@angular/core"

@Component({
  selector: "app-header",
  template: `
    <header class="flex items-center justify-between border-b border-surface-200 px-6 py-3 dark:border-surface-800">
      <span class="text-sm text-surface-500 dark:text-surface-400">Header</span>
    </header>
  `,
})
export class HeaderComponent {}
