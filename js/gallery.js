(function () {
    'use strict';

    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
        var image = gallery.querySelector('[data-gallery-image]');
        var link = gallery.querySelector('[data-gallery-link]');
        var thumbnails = Array.from(gallery.querySelectorAll('[data-gallery-thumb]'));
        var previous = gallery.querySelector('[data-gallery-prev]');
        var next = gallery.querySelector('[data-gallery-next]');
        var status = gallery.querySelector('[data-gallery-status]');
        var index = 0;

        function showScreenshot(position) {
            index = (position + thumbnails.length) % thumbnails.length;
            image.src = thumbnails[index].dataset.src;
            image.alt = thumbnails[index].dataset.alt;
            link.href = thumbnails[index].dataset.src;
            thumbnails.forEach(function (thumbnail, i) {
                if (i === index) {
                    thumbnail.setAttribute('aria-current', 'true');
                } else {
                    thumbnail.removeAttribute('aria-current');
                }
            });
            status.textContent = 'Screenshot ' + (index + 1) + ' of ' + thumbnails.length;
            thumbnails[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }

        thumbnails.forEach(function (thumbnail, i) {
            thumbnail.addEventListener('click', function (event) {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) {
                    return;
                }
                event.preventDefault();
                showScreenshot(i);
            });
        });
        previous.hidden = thumbnails.length < 2;
        next.hidden = thumbnails.length < 2;
        previous.addEventListener('click', function () { showScreenshot(index - 1); });
        next.addEventListener('click', function () { showScreenshot(index + 1); });
        gallery.addEventListener('keydown', function (event) {
            if (!event.target.closest('[data-gallery-thumb]') && event.target !== previous && event.target !== next) {
                return;
            }
            var position;
            switch (event.key) {
                case 'ArrowLeft': position = index - 1; break;
                case 'ArrowRight': position = index + 1; break;
                case 'Home': position = 0; break;
                case 'End': position = thumbnails.length - 1; break;
                default: return;
            }
            event.preventDefault();
            showScreenshot(position);
        });
    });
}());
