# Frontend boundary

Beautiful UI is the only UI system allowed in this repository.

Source of truth:
https://github.com/slev12397/beautiful-ui
Pinned reference:
44a274e598395ab61e7c96c26fda2758780253b7

## Hard rules

- Use Beautiful UI components and primitives for interactive UI and reusable surfaces.
- Preserve Beautiful UI's foundation stylesheet, tokens, typography, spacing, radii, shadows, motion, and interaction language.
- Do not introduce shadcn/ui, Radix wrappers, Material UI, Chakra, Bootstrap, custom component libraries, or a parallel visual system.
- Do not hand-build generic replacements for a Beautiful UI component that already exists.
- Product-specific composition may use semantic HTML for page layout and content, but buttons, chat/composer surfaces, status elements, controls, cards, tables, and other reusable UI must come from Beautiful UI or be a direct product adaptation of a copied Beautiful UI primitive.
- Iconoir is allowed because Beautiful UI already depends on it.
- Any change that adds a second UI system, generic substitute components, or duplicates a Beautiful UI primitive is a regression and must be removed before merge.
- When adapting a Beautiful UI primitive for product behavior, preserve its visual structure and token usage and document the upstream source in the component.

## Current product mapping

- Home CTA: Beautiful UI Button
- Home status labels: Beautiful UI StatusPill
- Theme control: Beautiful UI ThemeToggle
- Intake conversation: Beautiful UI ChatComposer adaptation
- Diagnostic attachments: upstream Beautiful UI ContextCards verbatim + upstream Beautiful UI Button
- Confirmation lookup: Beautiful UI SearchList + TaskRows adaptation
- Intake completion action: Beautiful UI Button


## Diagnostic panel hard rule

- The diagnostic attachment panel must not define its own card, panel, badge, or control system.
- Use the upstream Beautiful UI ContextCards primitive verbatim for attachment presentation.
- Use the upstream Beautiful UI Button primitive for Take photo, Record video, and Add files.
- Semantic wrappers may only arrange those upstream primitives; they must not recreate a visual component.
