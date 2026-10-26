# Website continuity

## Current goal and authorization
- User requested catalog/content changes to the approved minimal Jekyll redesign; implementation is complete locally.
- No commits, staging, deployment, framework changes, or Windows app control.

## Current implementation
- Six games, newest release first: Rogue Curling (Upcoming, planned 2026-12-07), Tidy Backpack: In the Faraway Lands (2026-10-12), Alien Morgue (2026-02-16), Birdfull (2025-03-11), Tidy Backpack (2024-09-17), Fall Words (October 2023).
- English Tap post and unused icon removed. Its generated page is absent after rebuilding.
- Post release_order strings drive catalog and related-game ordering independently of publication dates.
- Steam refresh script captures coming_soon and updates release_order from Steam; undated upcoming games use 9999-12-31.
- Game cards use shared game_metadata.html for date/Upcoming and genre instead of authored blurbs.
- Detail-page preview excerpts real descriptions; About retains the full Steam short description, with existing press-kit links directly underneath. Developer/publisher facts sidebar and its CSS removed.
- Header uses existing img/logo_burgum.png. Intro and studio biography replaced with user's exact requested copy (em dashes encoded in HTML).
- New game posts and Steam capsules/screenshots/thumbnails added; Steam data/assets refreshed. README and checks updated for six games.
- Existing privacy policies, mobile store links, and domain/verification files retained.

## Verification
- PASS: Jekyll 4.3.4 Ruby API build; current _site rebuilt for the user's local preview.
- PASS: local link/asset/fragment checks across nine HTML pages and six game routes.
- PASS: three gallery unit tests; updater syntax check; updater executed successfully for all five Steam games; git diff whitespace check.
- PASS: headless Chrome verifies exact six-game release ordering, logo, metadata, removed sidebar, press-kit placement, image loading, gallery click/keyboard controls, and layouts at 320/375/768/1440px.
- Updated catalog and Rogue Curling desktop screenshots visually inspected and retained in task visualization directory.
- Full Bundler/HTMLProofer external-link check not run; temporary portable Ruby used for the actual build.
- User previews _site via a static server; refresh after this rebuild. QA server uses separate port 4001 and is stopped after checks. Temporary Ruby runtime is removed after verification.
