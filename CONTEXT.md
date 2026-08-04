# Design-system glossary

- **Theme prop** — A typed, token-backed scalar layout prop compiled through StyleX, such as `gap={3}`, `ms="auto"`, or `width="full"`. Other libraries often call this pattern a system prop or style prop.
- **Style prop** — The unrestricted `style?: StyleXStyles` escape hatch. It is composed last and therefore wins over component defaults, variants, and theme props.
- **Layout primitive** — `Box`, `Stack`, or `Grid`; a product-agnostic composition root with the broadest theme-prop contract. Only these primitives expose shared `color` and `bg` props.
- **Responsive style set** — A predeclared StyleX style that keeps every breakpoint value for a CSS property together. Pass it through `style`; theme props themselves remain scalar.
- **Field wrapper** — The public root around a label, control, description, and error. Layout theme props style this wrapper only; they never alter the inner control chrome.
