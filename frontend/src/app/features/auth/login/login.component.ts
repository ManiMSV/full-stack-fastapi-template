import { Component, inject, type OnInit, signal } from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { Button } from "primeng/button"
import { InputPassword } from "primeng/inputpassword"
import { InputText } from "primeng/inputtext"

import { AuthService } from "../../../core/auth.service"

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule, InputText, InputPassword, Button, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <form
        [formGroup]="form"
        class="w-full max-w-sm space-y-4"
        (ngSubmit)="submit()"
        (keydown.enter)="submit()"
      >
        <h1 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
          Log In
        </h1>

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
            <p class="text-sm text-red-500">
              {{ email.hasError("email") ? "Invalid email address" : "Email is required" }}
            </p>
          }
        </div>

        <div class="space-y-1">
          <input
            pInputPassword
            data-testid="password-input"
            formControlName="password"
            type="password"
            placeholder="Password"
            class="w-full"
          />
          @if (password.invalid && password.touched) {
            <p class="text-sm text-red-500">Password is required</p>
          }
        </div>

        @if (errorMessage()) {
          <p class="text-sm text-red-500">{{ errorMessage() }}</p>
        }

        <div class="flex flex-col gap-2">
          <p-button label="Log In" [disabled]="loading()" (onClick)="submit()" />
          <a
            routerLink="/recover-password"
            class="text-sm text-primary-500 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(["/dashboard"])
    }
  }

  protected readonly form = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      validators: [Validators.required],
    }),
  })

  protected readonly errorMessage = signal("")
  protected readonly loading = signal(false)

  protected get email(): FormControl<string | null> {
    return this.form.controls.email
  }

  protected get password(): FormControl<string | null> {
    return this.form.controls.password
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.loading()) {
      return
    }
    this.loading.set(true)
    this.errorMessage.set("")
    try {
      await this.authService.login(
        this.email.value ?? "",
        this.password.value ?? "",
      )
      await this.router.navigate(["/dashboard"])
    } catch {
      this.errorMessage.set("Incorrect email or password")
    } finally {
      this.loading.set(false)
    }
  }
}
