import { Component, inject } from "@angular/core"
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { Button } from "primeng/button"
import { InputText } from "primeng/inputtext"
import { Password } from "primeng/password"

import { Api } from "../../../core/api/api"
import { usersRegisterUser } from "../../../core/api/fn/users/users-register-user"
import { AuthService } from "../../../core/auth.service"

function passwordsMatchValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const password = group.get("password")?.value
  const confirmPassword = group.get("confirmPassword")?.value
  return password === confirmPassword ? null : { mismatch: true }
}

@Component({
  selector: "app-signup",
  imports: [ReactiveFormsModule, InputText, Password, Button, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <form
        class="w-full max-w-sm space-y-4"
        (ngSubmit)="submit()"
        (keydown.enter)="submit()"
      >
        <h1 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
          Sign Up
        </h1>

        <div class="space-y-1">
          <input
            pInputText
            data-testid="full-name-input"
            formControlName="fullName"
            placeholder="Full Name"
            class="w-full"
          />
          @if (fullName.invalid && fullName.touched) {
            <p class="text-sm text-red-500">Full Name is required</p>
          }
        </div>

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

        <div class="space-y-1">
          <p-password styleClass="w-full">
            <input
              pPassword
              data-testid="password-input"
              formControlName="password"
              type="password"
              placeholder="Password"
              class="w-full"
            />
          </p-password>
          @if (password.invalid && password.touched) {
            @if (password.hasError("minlength")) {
              <p class="text-sm text-red-500">Password must be at least 8 characters</p>
            } @else {
              <p class="text-sm text-red-500">Password is required</p>
            }
          }
        </div>

        <div class="space-y-1">
          <p-password styleClass="w-full">
            <input
              pPassword
              data-testid="confirm-password-input"
              formControlName="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              class="w-full"
            />
          </p-password>
          @if (confirmPassword.invalid && confirmPassword.touched) {
            @if (group.hasError("mismatch") && !confirmPassword.hasError("required")) {
              <p class="text-sm text-red-500">The passwords don't match</p>
            } @else {
              <p class="text-sm text-red-500">Password is required</p>
            }
          }
        </div>

        @if (errorMessage) {
          <p class="text-sm text-red-500">{{ errorMessage }}</p>
        }

        <div class="flex flex-col gap-2">
          <p-button label="Sign Up" [disabled]="loading" (onClick)="submit()" />
          <a routerLink="/login" class="text-sm text-primary-500 hover:underline">
            Log In
          </a>
        </div>
      </form>
    </div>
  `,
})
export class SignupComponent {
  private readonly api = inject(Api)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  protected readonly form = new FormGroup(
    {
      fullName: new FormControl("", {
        validators: [Validators.required],
      }),
      email: new FormControl("", {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl("", {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl("", {
        validators: [Validators.required],
      }),
    },
    { validators: [passwordsMatchValidator] },
  )

  protected errorMessage = ""
  protected loading = false

  protected get group(): FormGroup {
    return this.form
  }

  protected get fullName(): FormControl<string | null> {
    return this.form.controls.fullName
  }

  protected get email(): FormControl<string | null> {
    return this.form.controls.email
  }

  protected get password(): FormControl<string | null> {
    return this.form.controls.password
  }

  protected get confirmPassword(): FormControl<string | null> {
    return this.form.controls.confirmPassword
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.loading) {
      return
    }
    const fullName = this.fullName.value ?? ""
    const email = this.email.value ?? ""
    const password = this.password.value ?? ""
    this.loading = true
    this.errorMessage = ""
    try {
      await this.api.invoke(usersRegisterUser, {
        body: { email, password, full_name: fullName },
      })
      await this.authService.login(email, password)
      await this.router.navigate(["/dashboard"])
    } catch {
      this.errorMessage =
        "The user with this email already exists in the system"
    } finally {
      this.loading = false
    }
  }
}
