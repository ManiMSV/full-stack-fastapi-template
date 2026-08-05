import { Component, input, output } from "@angular/core"
import { Button } from "primeng/button"

@Component({
  selector: "app-error-state",
  imports: [Button],
  template: `
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      <p class="text-surface-700 dark:text-surface-200">{{ message() }}</p>
      <p-button label="Retry" (onClick)="retry.emit()" />
    </div>
  `,
})
export class ErrorStateComponent {
  readonly message = input<string>("Something went wrong")
  readonly retry = output<void>()
}
