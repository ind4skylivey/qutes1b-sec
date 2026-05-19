// ==UserScript==
// @name         YouTube Ad Skipper
// @namespace    qutebrowser
// @version      1.0
// @description  Skip YouTube visual ads, detect .ad-showing, advance/accelerate during ads
// @author       S1BGr0up
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let savedPlaybackRate = 1.0;
    let adActive = false;

    // --- Core ad-skip logic ---

    function skipAdButton() {
        // Click skip button if present
        const skipBtn = document.querySelector(
            '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-overlay-close-button, .videoAdUiSkipButton, .ytp-ad-skip-ad-modern-button'
        );
        if (skipBtn) {
            skipBtn.click();
            console.log('[YT-AdSkip] Clicked skip button');
        }
    }

    function hideAdOverlays() {
        const selectors = [
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-container',
            '.ytp-ad-module',
            '.ytp-ad-text-overlay',
            '.ytp-ad-image-overlay',
            '.ytp-ad-progress-list',
            'ytd-ad-slot-renderer',
            'ytd-display-ad-renderer',
            'ytd-promoted-sparkles-web-renderer',
            'tp-yt-iron-overlay-backdrop.opened',
            '.ytp-ad-message-container',
            '.ytp-ad-player-activity',
            '#player-ads',
            'yt-mealbar-promo-renderer',
            'ytd-statement-banner-renderer',
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.overflow = 'hidden';
            });
        });
    }

    function handleAdShowing() {
        const video = document.querySelector('video');
        if (!video) return;

        // YouTube adds .ad-showing on the player during ads
        const adShowing = document.querySelector('.ad-showing, ytd-ad-slot-renderer');

        if (adShowing && !adActive) {
            // Ad started — save rate and accelerate
            savedPlaybackRate = video.playbackRate || 1.0;
            video.playbackRate = 16; // max acceleration
            adActive = true;
            console.log('[YT-AdSkip] Ad detected, accelerated to 16x');
        } else if (!adShowing && adActive) {
            // Ad ended — restore rate
            video.playbackRate = savedPlaybackRate;
            adActive = false;
            console.log('[YT-AdSkip] Ad ended, restored playback rate');
        }

        // Fallback: if ad is showing and video is short (likely an ad), skip ahead
        if (adShowing && video.duration < 60 && video.duration > 0) {
            video.currentTime = video.duration - 0.5;
        }
    }

    // --- SPA navigation detection ---

    let lastUrl = location.href;
    function onUrlChange() {
        // Reset state on navigation
        adActive = false;
        savedPlaybackRate = 1.0;
    }

    // --- MutationObserver (primary) ---

    const observer = new MutationObserver(() => {
        skipAdButton();
        hideAdOverlays();
        handleAdShowing();
    });

    // Observe as soon as body exists
    function startObserving() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObserving, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

    // --- Interval fallback (moderate: 500ms) ---

    setInterval(() => {
        skipAdButton();
        hideAdOverlays();
        handleAdShowing();

        // SPA URL change detection
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            onUrlChange();
        }
    }, 500);

    console.log('[YT-AdSkip] YouTube Ad Skipper loaded');
})();
