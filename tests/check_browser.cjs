// Optional visual/interaction checks: requires Playwright and an installed Chrome.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async function () {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        const root = process.env.SITE_URL || 'http://127.0.0.1:4000';
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(root, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.game-card').count(), 6);
        const sizes = await page.locator('.game-card-media').evaluateAll(nodes => nodes.map(node => [node.offsetWidth, node.offsetHeight]));
        assert.equal(new Set(sizes.map(JSON.stringify)).size, 1, 'Card media dimensions differ');
        const paths = await page.locator('.game-card-link').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
        assert.deepEqual(paths, [
            '/games/rogue-curling/',
            '/games/tidy-backpack-in-the-faraway-lands/',
            '/games/alien-morgue/',
            '/games/birdfull/',
            '/games/tidy-backpack/',
            '/games/fall-words/'
        ], 'Catalog must be ordered by release date with no English Tap');
        assert.equal(await page.locator('.game-card .game-metadata').count(), 0);
        assert.equal(await page.locator('.game-card-description').count(), 6);
        assert.match(await page.locator('.game-card-description').first().innerText(), /^Balatro-like roguelike curling/);
        assert.equal(await page.locator('.site-brand img').count(), 1);
        for (const path of paths) {
            const response = await page.goto(root + path, { waitUntil: 'networkidle' });
            assert.equal(response.status(), 200, path);
            assert.equal(await page.locator('.game-facts').count(), 0);
            assert.equal(await page.locator('.game-page > .game-metadata').count(), 1);
            assert.equal(await page.locator('.game-summary').count(), 0);
            if (['/games/alien-morgue/', '/games/birdfull/', '/games/tidy-backpack/'].includes(path)) {
                assert.equal(await page.locator('.game-description a').filter({ hasText: 'Press kit' }).count(), 1);
            }
            const broken = await page.locator('img').evaluateAll(nodes => nodes.filter(node => node.complete && !node.naturalWidth).map(node => node.src));
            assert.deepEqual(broken, [], 'Broken game images');
            if (await page.locator('[data-gallery]').count()) {
                const image = page.locator('[data-gallery-image]');
                const first = await image.getAttribute('src');
                await page.locator('[data-gallery-next]').click();
                assert.notEqual(await image.getAttribute('src'), first);
                await page.locator('[data-gallery-prev]').click();
                assert.equal(await image.getAttribute('src'), first);
                await page.locator('[data-gallery-thumb]').first().focus();
                await page.keyboard.press('End');
                assert.notEqual(await image.getAttribute('src'), first);
                await page.keyboard.press('Home');
                assert.equal(await image.getAttribute('src'), first);
            }
        }
        for (const width of [320, 375, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            for (const path of ['/', ...paths]) {
                await page.goto(root + path, { waitUntil: 'networkidle' });
                assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Horizontal overflow: ${width}px ${path}`);
            }
        }
        assert.deepEqual(errors, [], 'Browser JavaScript errors');
        console.log('PASS: six uniform cards, all game pages/images, gallery click and keyboard controls, 320/375/768/1440px layouts.');
    } finally {
        await browser.close();
    }
}()).catch(error => { console.error(error); process.exitCode = 1; });
