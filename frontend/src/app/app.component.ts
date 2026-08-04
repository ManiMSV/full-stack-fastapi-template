import { Component, signal } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { Button } from "primeng/button"

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Button],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class App {
  protected readonly title = signal("frontend")
}
