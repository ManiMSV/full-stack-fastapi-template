import { Component, input } from "@angular/core"

@Component({
  selector: "app-empty-state",
  template: `
    <div class="flex flex-col items-center gap-2 p-8 text-center">
      <p class="text-sm text-surface-500 dark:text-surface-400">{{ message() }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly message = input<string>("Nothing here yet")
}
