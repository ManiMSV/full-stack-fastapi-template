import { Component, inject, type OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { AuthService } from "../../core/auth.service"
import { HeaderComponent } from "./header/header.component"
import { SidebarComponent } from "./sidebar/sidebar.component"

@Component({
  selector: "app-layout",
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col">
        <app-header />
        <main class="flex-1 overflow-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  private readonly authService = inject(AuthService)

  ngOnInit(): void {
    void this.authService.refreshMe()
  }
}
