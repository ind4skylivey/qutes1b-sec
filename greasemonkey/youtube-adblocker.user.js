// ==UserScript==
// @name         YouTube Adblocker + SponsorBlock
// @namespace    qutebrowser
// @version      1.2
// @description  Skip YouTube ads + Sponsored segments
// @author       S1BGr0up
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://yewtu.be/*
// @match        https://invidious.io.lol/*
// @match        https://piped.video/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Skip button clicker
    function skipAd() {
        const skipBtn = document.querySelector('.ytp-skip-ad-button, .ytp-skip-ad-modern, .videoAdUiSkipButton');
        if (skipBtn) {
            skipBtn.click();
            console.log('[AdBlock] Skipped ad');
        }
    }

    // Remove ad elements
    function removeAds() {
        // Ad overlays
        document.querySelectorAll('.ytp-ad-player-overlay, .ytp-ad-overlay-container, .ytp-ad-module').forEach(el => {
            el.style.display = 'none';
        });

        // Sponsored cards
        document.querySelectorAll('ytd-display-ad-renderer, ytd-ad-slot-renderer').forEach(el => {
            el.style.display = 'none';
        });

        // Homepage ads
        document.querySelectorAll('ytd-ad-slot-renderer, ytd-banner-promo-renderer').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Run interval
    let observer = new MutationObserver(() => {
        skipAd();
        removeAds();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    skipAd();
    removeAds();

    console.log('[AdBlock] YouTube Adblocker loaded');
})();
