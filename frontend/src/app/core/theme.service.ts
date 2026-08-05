import { effect, Injectable, signal } from "@angular/core"

const THEME_KEY = "theme"
const DARK_MODE_CLASS = "app-dark"

export type Theme = "light" | "dark"

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly theme = signal<Theme>(this.#storedTheme())

  constructor() {
    effect(() => this.#apply(this.theme()))
  }

  toggle(): void {
    this.theme.update((current) => (current === "light" ? "dark" : "light"))
  }

  #storedTheme(): Theme {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light"
  }

  #apply(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.classList.toggle(DARK_MODE_CLASS, theme === "dark")
  }
}
