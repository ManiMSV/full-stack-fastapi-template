import { Component } from "@angular/core"
import { ProgressSpinner } from "primeng/progressspinner"

@Component({
  selector: "app-loading-spinner",
  imports: [ProgressSpinner],
  template: `
    <div class="flex items-center justify-center p-8">
      <p-progressspinner
        styleClass="w-10 h-10"
        ariaLabel="Loading"
      />
    </div>
  `,
})
export class LoadingSpinnerComponent {}
