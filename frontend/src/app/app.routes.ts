import type { Routes } from "@angular/router"

import { authGuard } from "./core/auth.guard"

export const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "signup",
    loadComponent: () =>
      import("./features/auth/signup/signup.component").then(
        (m) => m.SignupComponent,
      ),
  },
  {
    path: "recover-password",
    loadComponent: () =>
      import(
        "./features/auth/recover-password/recover-password.component"
      ).then((m) => m.RecoverPasswordComponent),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./features/auth/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: "",
    canActivate: [authGuard],
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "items",
        loadComponent: () =>
          import("./features/items/items-list/items-list.component").then(
            (m) => m.ItemsListComponent,
          ),
      },
      {
        path: "admin/users",
        loadComponent: () =>
          import("./features/admin/user-table/user-table.component").then(
            (m) => m.UserTableComponent,
          ),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./features/settings/settings.component").then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./shared/layout/not-found/not-found.component").then(
        (m) => m.NotFoundComponent,
      ),
  },
]
