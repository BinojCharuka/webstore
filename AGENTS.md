<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- All page motion goes through the shared layer — `src/components/Reveal.tsx` (plus `MaskLine`, `ScrambleText`, `Marquee`, `SpotlightCard`, `ScrollProgress`) for behaviour and the `reveal` / `reveal-mask` / `spotlight` / `shine` / `nav-link` / `skill-row` / `marquee` / `animate-*` utilities in `src/styles.css` for styling — instead of one-off inline animation or a motion library, so `prefers-reduced-motion` is honoured in one place.
- Initial portfolio readiness is coordinated by LoadingScreen and page-ready using document load, font readiness, and portrait loading/decoding; resource failures settle and content remounts on readiness so entrance motion starts when visible.
- ThemeProvider owns theme switching through semantic CSS tokens; a root pre-paint script restores the browser-local appearance preference so loading and content share the same theme without flashing.
