## Architecture

**kit-slides** is a Vue component library distributed as a local package (referenced via path). It exposes the rendering engine and building blocks for composing presentations.

**What kit-slides exposes:**

- `SlideDeck` — main component with toolbar (print, infinite scroll toggle), deck management, slide rendering
- `SlideBase`, `SlideSection` — layout primitives for composing custom slides
- Built-in slides (`CoverSlide`, `KpiSlide`, `ChartSlide`, …)
- Intermediate components (`BentoSlide`, `BentoCard`, `kpi/` components)
- UI atoms (`KpiCard`, `DeltaBadge`, …)
- `IAdapter` as an empty marker interface

**What stays outside (consumer's responsibility):**

- The deck itself: slide composition, `deck.ts`, ordering
- Data and adapters (fetching, normalization, domain shapes)
- Domain-specific custom slides

**Typical consumer:**
Any Vue app that wants a slide-based visualization. It mounts `SlideDeck` in a page and builds its own slides by composing `SlideBase` + widgets. With the infinite scroll toggle, the deck becomes a standard scrollable frontend view.

**Getting started:**
`decks/starter` inside the kit-slides repo is the reference template — a complete, working deck. The consumer copies it into their own repo and adapts it. The kit-slides repo itself is the minimal consumer example.

## Public Contract — kit-slides entry point

The rule is simple: if it's imported from kit-slides, it's public. If it's imported from kit-slides/src/..., it's internal and can break at any time.

**What is NOT public**

Anything under kit-slides/src/... — internal paths, never import directly
Raw\* row types (RawSummaryRow, etc.) — live in the deck, not in the kit
Domain shapes (AreaRow, ChannelRow, computed types) — starter's own types, not exported by the kit

## Multi-deck

`SlideDeck` receives `slides: SlideDefinition[]` and renders them — that's it. Deck selection, routing, and context switching are the consumer's responsibility, handled via the consumer's own Vue router.

The deck switcher currently in the toolbar is an internal dev-environment artifact of the kit-slides repo (`__KIT_DECKS__`, `__KIT_CURRENT_DECK__` are Vite plugin implementation details). It is not part of `SlideDeck`'s public API and will be removed from it.
