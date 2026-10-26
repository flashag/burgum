const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function gallery() {
  function element(dataset = {}) {
    return {
      dataset, hidden: true, attributes: {}, handlers: {}, textContent: '',
      addEventListener(type, fn) { this.handlers[type] = fn; },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      scrollIntoView() {},
      closest(selector) { return selector === '[data-gallery-thumb]' ? this : null; }
    };
  }
  const thumbs = [1, 2, 3].map(n => element({ src: `/shot-${n}.jpg`, alt: `Screenshot ${n}` }));
  const image = element();
  const link = element();
  const previous = element();
  const next = element();
  const status = element();
  const root = element();
  const nodes = {
    '[data-gallery-image]': image, '[data-gallery-link]': link,
    '[data-gallery-prev]': previous, '[data-gallery-next]': next,
    '[data-gallery-status]': status
  };
  root.querySelector = selector => nodes[selector];
  root.querySelectorAll = () => thumbs;
  const document = { querySelectorAll: () => [root] };
  vm.runInNewContext(fs.readFileSync('js/gallery.js', 'utf8'), { document });
  return { root, thumbs, image, link, previous, next, status };
}

test('next and previous wrap through real images and update current thumbnail and status', () => {
  const g = gallery();
  assert.equal(g.next.hidden, false);
  g.previous.handlers.click();
  assert.equal(g.image.src, '/shot-3.jpg');
  assert.equal(g.link.href, '/shot-3.jpg');
  assert.equal(g.image.alt, 'Screenshot 3');
  assert.equal(g.thumbs[2].attributes['aria-current'], 'true');
  assert.equal(g.status.textContent, 'Screenshot 3 of 3');
  g.next.handlers.click();
  assert.equal(g.image.src, '/shot-1.jpg');
  assert.equal(g.thumbs[2].attributes['aria-current'], undefined);
});

test('thumbnail activation and arrow/Home/End keys choose the corresponding screenshot', () => {
  const g = gallery();
  let prevented = false;
  g.thumbs[1].handlers.click({ preventDefault() { prevented = true; }, button: 0 });
  assert.equal(prevented, true);
  assert.equal(g.image.src, '/shot-2.jpg');
  const key = value => g.root.handlers.keydown({ key: value, target: g.thumbs[1], preventDefault() {} });
  key('End');
  assert.equal(g.image.src, '/shot-3.jpg');
  key('ArrowRight');
  assert.equal(g.image.src, '/shot-1.jpg');
  key('ArrowLeft');
  assert.equal(g.image.src, '/shot-3.jpg');
  key('Home');
  assert.equal(g.image.src, '/shot-1.jpg');
});

test('modified thumbnail clicks retain native open-in-new-tab behavior', () => {
  const g = gallery();
  g.thumbs[1].handlers.click({ ctrlKey: true, preventDefault() { assert.fail('Native link click was intercepted'); } });
  assert.notEqual(g.image.src, '/shot-2.jpg');
});
