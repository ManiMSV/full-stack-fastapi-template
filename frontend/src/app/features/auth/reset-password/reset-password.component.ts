import { Component, inject, signal } from "@angular/core"
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { Button } from "primeng/button"
import { InputPassword } from "primeng/inputpassword"

import { Api } from "../../../core/api/api"
import { loginResetPassword } from "../../../core/api/fn/login/login-reset-password"

function passwordsMatchValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const password = group.get("password")?.value
  const confirmPassword = group.get("confirmPassword")?.value
  return password === confirmPassword ? null : { mismatch: true }
}

@Component({
  selector: "app-reset-password",
  imports: [ReactiveFormsModule, InputPassword, Button],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <form
        [formGroup]="form"
        class="w-full max-w-sm space-y-4"
        (ngSubmit)="submit()"
        (keydown.enter)="submit()"
      >
        <h1 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
          Reset Password
        </h1>

        <div class="space-y-1">
          <input
            pInputPassword
            data-testid="new-password-input"
            formControlName="password"
            type="password"
            placeholder="New Password"
            class="w-full"
          />
          @if (password.invalid && password.touched) {
            @if (password.hasError("minlength")) {
              <p class="text-sm text-red-500">Password must be at least 8 characters</p>
            } @else {
              <p class="text-sm text-red-500">Password is required</p>
            }
          }
        </div>

        <div class="space-y-1">
          <input
            pInputPassword
            data-testid="confirm-password-input"
            formControlName="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="w-full"
          />
          @if (group.hasError("mismatch") && confirmPassword.touched && !confirmPassword.hasError("required")) {
            <p class="text-sm text-red-500">The passwords don't match</p>
          }
        </div>

        @if (message()) {
          <p class="text-sm text-emerald-600 dark:text-emerald-400">{{ message() }}</p>
        }

        <p-button
          label="Reset Password"
          [disabled]="loading()"
          (onClick)="submit()"
        />
      </form>
    </div>
  `,
})
export class ResetPasswordComponent {
  private readonly api = inject(Api)
  private readonly route = inject(ActivatedRoute)

  protected readonly form = new FormGroup(
    {
      password: new FormControl("", {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl("", {
        validators: [Validators.required],
      }),
    },
    { validators: [passwordsMatchValidator] },
  )

  protected readonly message = signal("")
  protected readonly loading = signal(false)

  protected get group(): FormGroup {
    return this.form
  }

  protected get password(): FormControl<string | null> {
    return this.form.controls.password
  }

  protected get confirmPassword(): FormControl<string | null> {
    return this.form.controls.confirmPassword
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.loading()) {
      return
    }
    const token = this.route.snapshot.queryParamMap.get("token") ?? ""
    const newPassword = this.password.value ?? ""
    this.loading.set(true)
    this.message.set("")
    try {
      await this.api.invoke(loginResetPassword, {
        body: { token, new_password: newPassword },
      })
      this.message.set("Password updated successfully")
    } catch {
      this.message.set("Invalid token")
    } finally {
      this.loading.set(false)
    }
  }
}
