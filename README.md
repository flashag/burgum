# BurGum Games website

A static Jekyll portfolio for BurGum Games. The homepage lists every game in
`site.posts`; each post renders its own page through `_layouts/game.html`.
The same `_includes/game_card.html` renders the catalog and related games.

## Build and preview

With Ruby, Bundler, and the project dependencies installed:

```sh
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

Open http://127.0.0.1:4000. No Node build step is required.

## Game content

The six games live in `_posts/*.markdown`. Their original metadata
and store/press links are retained. The current templates use:

- `layout: game` and a unique `permalink: /games/game-name/`
- `release_order`: an ISO date used for newest-first catalog ordering
- `stores`: a list of `label` and `url` pairs
- `presskit`: an optional press-kit URL
- `steam_id`: an optional **quoted string** identifying a Steam game

Steam games use a checked-in snapshot in `_data/steam.json` for the official
short description, release date, developer, publisher, and genres.
Capsules, screenshots, and smaller gallery thumbnails are stored locally in
`img/portfolio/steam/<app-id>/`. Visitors do not call the Steam API.

To refresh all games with a quoted `steam_id`, run from PowerShell:

```powershell
./scripts/update-steam.ps1
```

This reads the public English Steam app data and downloads its current assets.
Review the resulting metadata/assets and rebuild before publishing. The script
stops on network or data failures; it does not publish changes.

Mobile games omit `steam_id` and keep their existing icon, description, and
mobile-store links. Their dedicated pages use the same layout without a
fabricated screenshot gallery.

To add another game, follow an existing post, give it a unique permalink and
store links, and add its image (or quoted Steam ID). Every post automatically
appears on the homepage. Publication dates do not control catalog order; the
importer updates `release_order` from Steam release dates. Upcoming games with
no exact date sort first.

## Design and interactions

- `_includes/css/main.css`: minimal responsive styles; three columns on desktop,
  two on tablet, one on narrow screens.
- `_includes/head.html`: page titles, descriptions, canonical URLs, and
  baseurl-aware assets.
- `js/gallery.js`: thumbnail selection, previous/next controls, and
  Left/Right/Home/End keys when gallery controls have focus.
- Without JavaScript, screenshot thumbnails remain links to their full images.
- Both privacy sources and the public `/privacy-policy/` route remain intact.

## Verification

```sh
node --test tests/gallery.test.cjs
python tests/check_site.py
bundle exec rake test
```

The Python check requires a built `_site` and checks internal links, fragments,
assets, all six game routes, related-game links, and development-file exclusions.
Rake additionally runs the existing HTMLProofer external-link checks.

Optional headless browser checks require Playwright and installed Google Chrome.
With the preview server running and Playwright available to Node:

```sh
node tests/check_browser.cjs
```

Set `SITE_URL` to test another local address. The browser check covers all game
pages, image loading, gallery controls, uniform card media, JavaScript errors,
and overflow at 320, 375, 768, and 1440 pixels. It does not control a visible
Windows application.

## Deployment

The site retains its existing Jekyll hosting structure and `CNAME`.
No new hosting service or automatic deployment was added.
