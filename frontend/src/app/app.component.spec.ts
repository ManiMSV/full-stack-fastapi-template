import { TestBed } from "@angular/core/testing"
import Aura from "@primeuix/themes/aura"
import { providePrimeNG } from "primeng/config"
import { App } from "./app.component"

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        providePrimeNG({
          theme: {
            preset: Aura,
          },
        }),
      ],
    }).compileComponents()
  })

  it("should create the app", () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it("should render the app title and a PrimeNG button", async () => {
    const fixture = TestBed.createComponent(App)
    await fixture.whenStable()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "Full Stack FastAPI Project",
    )
    expect(compiled.querySelector("p-button")).not.toBeNull()
  })
})
