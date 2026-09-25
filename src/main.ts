import "./styles.css"
import type p5 from "p5"
import { sketches, getSketch } from "./sketches"

const nav = document.querySelector<HTMLElement>("#nav")!
const header = document.querySelector<HTMLElement>("#header")!
const host = document.querySelector<HTMLElement>("#canvas-host")!

nav.innerHTML = `
  <div class="brand">Esketch</div>
  ${sketches
    .map(
      (s) =>
        `<a href="#/${s.meta.id}" data-id="${s.meta.id}"><strong>${s.meta.title}</strong><small>${s.meta.concept}</small></a>`,
    )
    .join("")}
`

let current: p5 | null = null

const mount = (id: string) => {
  const mod = getSketch(id)
  if (current) {
    current.remove()
    current = null
  }
  host.innerHTML = ""
  header.innerHTML = `<h1>${mod.meta.title}</h1><p>${mod.meta.concept}</p>`
  current = mod.createSketch(host)

  for (const link of nav.querySelectorAll("a")) {
    link.classList.toggle("active", link.getAttribute("data-id") === mod.meta.id)
  }
  history.replaceState(null, "", `#/${mod.meta.id}`)
}

const idFromHash = () => {
  const raw = location.hash.replace(/^#\/?/, "")
  return raw || sketches[0].meta.id
}

window.addEventListener("hashchange", () => mount(idFromHash()))
mount(idFromHash())

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    current?.remove()
    current = null
  })
}
