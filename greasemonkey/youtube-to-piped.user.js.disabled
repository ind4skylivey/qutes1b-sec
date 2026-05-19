// ==UserScript==
// @name         YouTube to Piped Redirect
// @namespace    qutebrowser
// @version      1.0
// @description  Redirect YouTube to Piped (privacy-friendly frontend). Disable by removing this file.
// @author       S1BGr0up
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Change this to your preferred Piped instance
    const PIPED_INSTANCE = 'https://piped.video';

    // Only redirect on actual video/watch pages, not homepage
    const shouldRedirect =
        window.location.pathname.startsWith('/watch') ||
        window.location.pathname.startsWith('/shorts') ||
        window.location.pathname.startsWith('/embed') ||
        (new URLSearchParams(window.location.search).has('v'));

    if (!shouldRedirect) return;

    // Build Piped URL
    let pipedUrl = PIPED_INSTANCE;
    const videoId =
        new URLSearchParams(window.location.search).get('v') ||
        window.location.pathname.match(/\/(?:watch|shorts|embed)\/([a-zA-Z0-9_-]{11})/)?.[1];

    if (videoId) {
        pipedUrl = `${PIPED_INSTANCE}/watch?v=${videoId}`;
    }

    console.log(`[YT→Piped] Redirecting to ${pipedUrl}`);
    window.location.replace(pipedUrl);
})();
