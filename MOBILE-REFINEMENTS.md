# Mobile garden refinements

Existing layout, content, translations, service URLs and supplied artwork preserved.

- Balanced mobile section padding, including symmetric safe-area handling. The previous 44px/76px split shifted content left.
- Mobile garden reduced from 1,512 to 918 descendant elements (39% fewer). Small painted companion leaves and flower clusters supply density without additional DOM or animation timelines.
- Mobile side-plant animation budget reduced from 14 to 10, still balanced across left/right and flowers/leaves. Economical devices retain the four-plant budget.
- Garden parallax targets reduced from 502 to 60 on mobile. Observer lookups use maps, ambient classes change only when necessary, and unchanged parallax transforms are not rewritten.
- Mobile fades are local to small pieces instead of full-document rails; the full-height blend overlay is disabled on mobile. Existing distant/middle/foreground layers remain separate.
- Stronger varied branch and flower sway, five reusable drifting botanicals instead of three, and fewer concurrent wing animations on mobile. No React scroll state, particle timers or continuous JavaScript loop.
- Removed the invocation's circular ring. Retained a soft radial Ganesha aura with unchanged original artwork.

## Validation

Build and seven regression tests passed. Browser viewport checks at 360, 375, 390, 412 and 430 CSS pixels in English and Hindi found zero horizontal overflow, no checked text/control clipping, and main container centers within 0.1px of the available viewport center. Original Ganesha/monogram checksums passed.

Read-only transform samples confirmed independent changing wind and petal motion. Reduced-motion fixture reported zero running ambient elements, hidden/non-animated falling particles and no hidden reveal text; no console errors were reported. During sampled scrolling from the hero through families/programme, layout-shift and long-task counters did not increase after the opening settled. Initial page/opening setup did register layout shift and one long task, so this is not a claim of zero loading CLS or guaranteed phone frame rates. Physical-device profiling and live third-party service delivery were not performed.
