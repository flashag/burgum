# Website redesign

## Goal and approval
- User approved the second image concept and requested implementation in this Jekyll repository.
- Minimal white/sans-serif homepage, uniform cards for all five games, dedicated game pages, real Steam capsules/screenshots/descriptions for Steam games.
- Preserve mobile store links, privacy policies, domain/advertising verification files, and unrelated untracked AGENTS.md.
- No staging, commits, deployment, framework migration, or Windows app control.

## Implementation plan
- [x] Extend existing post metadata and capture public Steam content in `_data/steam.json`.
- [x] Update existing shared templates and stylesheet; add reusable game card and game layout.
- [x] Add progressively enhanced keyboard-accessible screenshot gallery.
- [x] Verify rendering, page/asset links, desktop/mobile layout and gallery.

## State
- Implementation complete in the current checkout. No staging, commit, or deployment.
- Five posts use the shared game layout and explicit `/games/<slug>/` permalinks.
- Shared homepage includes, head/footer/nav, page layout, stylesheet entry/layout and main CSS updated.
- New `_includes/game_card.html`, `_layouts/game.html`, `js/gallery.js`, Steam snapshot, and 55 local capsule/screenshot/thumbnail assets.
- `scripts/update-steam.ps1` refreshes public English Steam content for quoted steam_id fields in posts. README documents content, build, and verification.
- `_config.yml` uses the production URL/contact email and excludes development files from published output.
- Steam data is a build-time snapshot, not a browser API dependency. Mobile content remains from existing posts.

## Verification
- PASS: actual Jekyll 4.3.4 build through its Ruby API using a temporary portable Ruby runtime; no project dependencies changed. Native optional server dependencies prevented using standard Bundler/Rake; HTMLProofer external-link checks were not run.
- PASS: tests/check_site.py validates eight built HTML pages, local assets/links/fragments, five game routes, related games, and excluded development files.
- PASS: three Node gallery tests cover selection, wraparound, keyboard controls, and native modified clicks.
- PASS: headless Chrome checks every game page, image loading, gallery click/keyboard interactions, uniform card media, no JavaScript errors, and no overflow at 320/375/768/1440px.
- PASS: PowerShell updater syntax and git diff whitespace checks.
- Desktop/mobile homepage and Birdfull screenshots visually inspected and retained in the task's visualization directory as preview artifacts.
- Live site remains unchanged. Existing untracked AGENTS.md was not modified.
- Temporary Ruby runtime/dependencies removed and QA server stopped after checks. Built `_site` remains ignored; preview screenshots remain as reviewable artifacts.
