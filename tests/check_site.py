"""Check built game pages, local asset paths, and internal link fragments."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.links = []
        self.game_links = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for key in ("src", "href"):
            if key in attrs:
                self.links.append(attrs[key])
        if "game-card-link" in attrs.get("class", "").split():
            self.game_links.append(attrs["href"])


root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
pages = {path: Page(path) for path in root.rglob("*.html")}
errors = []
for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc or not url.path and not url.fragment:
            continue
        target = (root / unquote(url.path).lstrip("/")) if url.path.startswith("/") else path.parent / unquote(url.path)
        target = target.resolve()
        if target.is_dir():
            target /= "index.html"
        if not target.is_file():
            errors.append(f"{path.relative_to(root)}: missing {link}")
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f"{path.relative_to(root)}: missing fragment {link}")

home = pages[root / "index.html"]
if len(home.game_links) != 5 or len(set(home.game_links)) != 5:
    errors.append("Homepage must link to all five distinct game pages")
for link in home.game_links:
    path = root / link.lstrip("/") / "index.html"
    if path not in pages:
        errors.append(f"Missing game page: {link}")
    elif len(pages[path].game_links) != 2 or link in pages[path].game_links:
        errors.append(f"Related games must contain two other games: {link}")
for private in ("AGENTS.md", ".agent", "tests", "scripts"):
    if (root / private).exists():
        errors.append(f"Development files were published: {private}")

if errors:
    raise SystemExit("\n".join(errors))
print(f"PASS: {len(pages)} HTML pages; all local links, assets, fragments, five game routes, and related-game links.")
