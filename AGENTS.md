# Project Guidance

## Purpose and stack

- This repository is the BurGum Games public website, not game source code or a Godot project. It showcases Alien Morgue, Birdfull, Tidy Backpack, Fall Words, and English Tap, with store/presskit links, contact information, and privacy policies.
- Static site built with Ruby/Jekyll, Liquid templates, YAML front matter, Markdown (Kramdown), HTML, CSS, and browser JavaScript. The base is the Freelancer Jekyll theme.
- `freelancer-theme-jekyll.gemspec` declares Jekyll `~> 4.0`, Bundler `~> 2.0`, Rake `~> 13.0`, HTMLProofer `~> 3.15`, WEBrick `~> 1.7.0`, and several Jekyll plugin dependencies. Dependencies declared in the gemspec are not evidence that every plugin is enabled.
- Checked-in frontend libraries include jQuery 1.11.0, Bootstrap 3.2.0, Bootswatch 3.2.0, Font Awesome Free 6.1.2, jQuery Easing, classie, and jqBootstrapValidation. There is no Node/npm build pipeline or SPA framework.
- `CNAME` contains `burgumgames.com`; `_config.yml` still sets `url` to `https://flashag.github.io/burgum/`. These are repository settings, not confirmation of the live deployment. No GitHub Actions deployment workflow is checked in.

## Source map and rendering

| Path | Responsibility |
| --- | --- |
| `_config.yml` | Site identity, metadata, colors, social links, footer, collection output, and post permalink defaults. |
| `index.html` | Front matter selects `_layouts/default.html`. |
| `_layouts/default.html` | Includes head, navigation, header, game grid, static contact section, footer, game modals, and scripts in that order. |
| `_includes/portfolio_grid.html`, `_includes/modals.html` | Both iterate `site.posts`; each card targets its matching modal through `post.modal-id`. |
| `_posts/*.markdown` | Game metadata and descriptions, including embedded HTML links. Existing filenames retain old theme dates; front matter contains the actual configured dates. |
| `img/portfolio/`, `img/logo_burgum.png` | Game images and header branding. |
| `style.css`, `_layouts/style.css` | Jekyll entry point and layout assembling Bootstrap CSS followed by custom CSS. |
| `_includes/css/main.css` | Custom styling with Liquid values from `site.color`; edit this source for theme changes. |
| `_includes/head.html`, `_includes/js.html` | Metadata, fonts, styles, script ordering, and conditional contact script selection. |
| `js/freelancer.js`, `js/cbpAnimatedHeader.js` | Theme behavior: scrolling, scrollspy, responsive navigation, floating labels, and animated header. |
| `privacy-policy.md` | Explicit `/privacy-policy/` permalink with `layout: null`; this is the navigation target. |
| `_pages/2024-03-10-privacy.md`, `_layouts/page.html` | Separate privacy content in the output-enabled `pages` collection and its minimal page layout. |
| `feed.xml` | Handwritten Liquid Atom feed using post content and site metadata. |
| `ads.txt`, `app-ads.txt`, root verification `.txt`, `CNAME` | Advertising, domain, and verification files; preserve exact values unless a requested change requires them. |
| `Rakefile`, `.travis.yml` | Build/link validation task and legacy Travis configuration. |

## Working agreements

- Inspect the current templates and callers before proposing changes. `README.md` describes the original theme and is not a complete description of this customized site.
- Before large edits, briefly summarize the approach. Change project files other than `AGENTS.md` only after clear user approval of the design or implementation; plan-only requests do not authorize edits.
- Keep changes small and consistent with the existing HTML/Liquid/CSS/jQuery style. Preserve existing names, commented-out code, serialized content keys, anchors, and asset paths unless the requested change requires otherwise.
- Prefer existing includes and data flow over adding a framework, parallel rendering path, or new build system. Do not upgrade bundled libraries as incidental cleanup.
- Edit source files, not generated `_site/`, caches, vendored/minified libraries, or binary assets unless explicitly requested. Preserve third-party license headers and `LICENCE`.
- Do not stage, commit, push, deploy, open pull requests, or change remote services unless explicitly requested. Preserve unrelated user changes.
- For substantial approved work, read existing session memory first. Maintain `.agent/SESSION.md` if continuity is needed and authorized; keep it factual and concise.

## Common changes

- To add a game, follow an existing `_posts/*.markdown` entry. Supply `layout: default`, a unique `modal-id`, `date`, `img`, `alt`, `project-date`, `category`, `title`, and `description`; put the matching image in `img/portfolio/`. The grid and modals consume front matter, not the Markdown body. Preserve valid YAML when descriptions contain HTML or punctuation.
- Both game includes use Jekyll's `site.posts` ordering. Check front matter dates when ordering matters; do not infer ordering from the legacy filenames or display-only `project-date`.
- For colors, inspect both `_config.yml` and `_includes/css/main.css`. Root `style.css` is a Jekyll entry point, not the custom stylesheet body.
- For contact changes, inspect `_layouts/default.html`, `_includes/contact_static.html`, and `_includes/js.html` together. The active layout always includes static email/Discord links. Changing `site.contact` alone changes script selection, not the visible contact section.
- `_includes/contact.html`, `_includes/contact_disqus.html`, `_includes/about.html`, `js/contact_me.js`, and `mail/contact_me.php` are retained theme alternatives, not active homepage sections. The PHP handler still has placeholder addresses; a static host cannot execute it. Do not describe the current site as having a working mail form.
- Preserve both privacy sources unless consolidation is explicitly requested. Confirm the intended public route and content before changing policy wording; do not invent legal or data-collection claims.

## Build and verification

Run from the repository root with Ruby and compatible Bundler installed:

```sh
bundle install
bundle exec jekyll build
bundle exec jekyll serve
bundle exec rake test
```

- `jekyll serve` provides local preview, normally at `http://127.0.0.1:4000`; restart it after `_config.yml` changes.
- `rake test` builds the site and runs HTMLProofer over `_site` with `assume_extension`, `only_4xx`, and `allow_hash_href` enabled. External link checks can fail due to networking or remote sites; report the actual cause instead of suppressing failures.
- `.travis.yml` installs Jekyll/Bundler, installs dependencies, runs `rake test`, and builds again. It does not specify a Ruby version. `Gemfile.lock` is ignored, so dependency resolution is not reproducibly pinned.
- There are no checked-in application unit tests, JavaScript test runner, or formatting/lint configuration. Use the build and HTMLProofer for relevant changes; for visual/interaction changes, also inspect the local preview when available.
- Check mobile navigation, scrolling, game card/modal pairing, images, store links, contact links, and the privacy route as relevant. Do not initiate Windows app control for a smoke check unless explicitly requested.
- Before finishing, review the diff and nearby references, remove task-created scratch artifacts, and report changed files, behavior, checks, and any verification limitations. Never claim a build passed without its successful output.

## Existing pitfalls to inspect when relevant

- Many asset links are relative, while privacy navigation is root-relative. Nested pages and project-subpath hosting need explicit checks; inspect `site.url`, any `baseurl` change, canonical URLs, and feed URLs together.
- The privacy collection's `page` layout has a different structure from the homepage and omits its footer/scripts. Do not assume all pages share the homepage wiring.
- `js/freelancer.js` treats `.page-scroll a` targets as same-page selectors, while navigation also puts the privacy URL inside `.page-scroll`. Inspect this handler when changing navigation.
- `_config.yml` has `primary-rgb: "24,288,156"`, including an out-of-range RGB component. Treat any correction as an explicit visual change.
- The dependency and frontend versions are legacy. Assess compatibility before upgrades, and preserve the jQuery-before-Bootstrap script ordering and Bootstrap 3 modal attributes.
- Initial repository analysis found no Ruby, Bundler, or Jekyll executable on PATH in this Windows environment. Recheck availability for future work; installation and successful builds have not been established by this document.
