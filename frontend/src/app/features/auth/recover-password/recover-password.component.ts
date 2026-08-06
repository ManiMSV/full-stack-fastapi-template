import { Component, inject, signal } from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { Button } from "primeng/button"
import { InputText } from "primeng/inputtext"

import { Api } from "../../../core/api/api"
import { loginRecoverPassword } from "../../../core/api/fn/login/login-recover-password"

@Component({
  selector: "app-recover-password",
  imports: [ReactiveFormsModule, InputText, Button],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <form
        [formGroup]="form"
        class="w-full max-w-sm space-y-4"
        (ngSubmit)="submit()"
        (keydown.enter)="submit()"
      >
        <h1 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
          Password Recovery
        </h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          Enter your email address and we will send you a link to reset your
          password.
        </p>

        <div class="space-y-1">
          <input
            pInputText
            data-testid="email-input"
            formControlName="email"
            type="email"
            placeholder="Email"
            class="w-full"
          />
          @if (email.invalid && email.touched) {
            <p class="text-sm text-red-500">Invalid email address</p>
          }
        </div>

        @if (message()) {
          <p class="text-sm text-emerald-600 dark:text-emerald-400">{{ message() }}</p>
        }

        <p-button
          label="Continue"
          [disabled]="loading()"
          (onClick)="submit()"
        />
      </form>
    </div>
  `,
})
export class RecoverPasswordComponent {
  private readonly api = inject(Api)

  protected readonly form = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
  })

  protected readonly message = signal("")
  protected readonly loading = signal(false)

  protected get email(): FormControl<string | null> {
    return this.form.controls.email
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.loading()) {
      return
    }
    this.loading.set(true)
    this.message.set("")
    try {
      await this.api.invoke(loginRecoverPassword, {
        email: this.email.value ?? "",
      })
      this.message.set("Password recovery email sent")
    } catch {
      this.message.set("Password recovery email sent")
    } finally {
      this.loading.set(false)
    }
  }
}
