// ==UserScript==
// @name         Twitch Ad Mitigation
// @namespace    qutebrowser
// @version      1.0
// @description  Partial Twitch ad mitigation — hides ad UI, mutes during ads, restores after. NOT a perfect adblock.
// @author       S1BGr0up
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // NOTE: This is a PARTIAL mitigation. Twitch actively fights ad blockers.
    // This script hides visible ad indicators and mutes the player during ads.
    // It does NOT guarantee ad-free viewing.

    let wasMuted = false;
    let savedVolume = 1.0;
    let adActive = false;

    // --- Hide ad-related UI elements ---

    function hideAdUI() {
        const selectors = [
            // Ad player overlays
            '.video-player__overlay[data-a-target="video-ad-label"]',
            '.video-player__overlay[data-a-target="video-ad-countdown"]',
            '.player-overlay-ad-content',
            '.ad-banner',
            '.home-header__ad',
            '.top-nav__ad-banner',
            // Sidebar ads
            '.side-nav__ad',
            '.channel-root__ad',
            // Recommendation ads
            '.recommended-video-ad',
            // Carousel ads
            '.carousel-item--ad',
            // Homepage promoted content
            '.tw-ad-banner',
            '.ad-container',
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        });
    }

    // --- Detect ad state and moderate playback ---

    function handleAdState() {
        const video = document.querySelector('video');
        if (!video) return;

        // Twitch ad indicators
        const adLabel = document.querySelector('[data-a-target="video-ad-label"]');
        const adCountdown = document.querySelector('[data-a-target="video-ad-countdown"]');
        const isAd = !!(adLabel || adCountdown);

        if (isAd && !adActive) {
            // Ad started — save state and mute as mitigation
            wasMuted = video.muted;
            savedVolume = video.volume;
            video.muted = true;
            adActive = true;
            console.log('[Twitch-Ads] Ad detected, muted player');
        } else if (!isAd && adActive) {
            // Ad ended — restore original audio state
            video.muted = wasMuted;
            video.volume = savedVolume;
            adActive = false;
            console.log('[Twitch-Ads] Ad ended, restored audio state');
        }
    }

    // --- MutationObserver (primary) ---

    const observer = new MutationObserver(() => {
        hideAdUI();
        handleAdState();
    });

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

    // --- Interval fallback (moderate: 1s) ---

    setInterval(() => {
        hideAdUI();
        handleAdState();
    }, 1000);

    console.log('[Twitch-Ads] Twitch Ad Mitigation loaded — PARTIAL, not perfect');
})();
