// ==UserScript==
// @name         YouTube SponsorBlock
// @namespace    qutebrowser
// @version      1.0
// @description  Skip sponsored segments using SponsorBlock public API
// @author       S1BGr0up
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE = 'https://sponsor.ajay.app/api/skipSegments';
    // Categories to skip: sponsor, selfpromo, interaction
    const CATEGORIES = ['sponsor', 'selfpromo', 'interaction'];

    // Cache: videoId -> segments array
    const segmentCache = {};
    let currentVideoId = null;
    let skipInterval = null;

    // --- Extract videoId from URL ---

    function getVideoId() {
        // ?v= parameter (standard watch URLs)
        const urlParams = new URLSearchParams(window.location.search);
        const v = urlParams.get('v');
        if (v) return v;

        // /shorts/<id>
        const shortsMatch = window.location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (shortsMatch) return shortsMatch[1];

        return null;
    }

    // --- Fetch segments from SponsorBlock API ---

    async function fetchSegments(videoId) {
        if (segmentCache[videoId]) return segmentCache[videoId];

        try {
            // SponsorBlock API uses "categories" (plural) with a JSON array
            const url = `${API_BASE}?videoID=${videoId}&categories=${encodeURIComponent(JSON.stringify(CATEGORIES))}`;
            const resp = await fetch(url);
            if (!resp.ok) return [];

            const data = await resp.json();
            const segments = data
                .filter(s => s.segment && s.segment.length === 2)
                .map(s => ({
                    start: s.segment[0],
                    end: s.segment[1],
                    category: s.category,
                }));

            segmentCache[videoId] = segments;
            console.log(`[YT-SponsorBlock] Cached ${segments.length} segments for ${videoId}`);
            return segments;
        } catch (e) {
            console.warn('[YT-SponsorBlock] Failed to fetch segments:', e);
            return [];
        }
    }

    // --- Skip logic ---

    function checkAndSkip(video, segments) {
        if (!segments.length) return;
        const time = video.currentTime;
        for (const seg of segments) {
            if (time >= seg.start && time < seg.end - 0.3) {
                video.currentTime = seg.end;
                console.log(`[YT-SponsorBlock] Skipped ${seg.category} (${seg.start.toFixed(1)}s → ${seg.end.toFixed(1)}s)`);
                return;
            }
        }
    }

    // --- SPA video change detection ---

    function detectVideoChange() {
        const videoId = getVideoId();
        if (!videoId || videoId === currentVideoId) return;

        currentVideoId = videoId;
        console.log(`[YT-SponsorBlock] New video detected: ${videoId}`);

        // Clear old interval
        if (skipInterval) clearInterval(skipInterval);

        // Fetch segments and start monitoring
        fetchSegments(videoId).then(segments => {
            if (!segments.length) return;

            const video = document.querySelector('video');
            if (!video) return;

            skipInterval = setInterval(() => {
                const v = document.querySelector('video');
                if (v) checkAndSkip(v, segments);
            }, 250);
        });
    }

    // --- MutationObserver for SPA navigation ---

    const observer = new MutationObserver(() => {
        detectVideoChange();
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

    // Fallback interval for SPA detection
    setInterval(detectVideoChange, 1000);

    console.log('[YT-SponsorBlock] SponsorBlock loaded — skipping sponsor, selfpromo, interaction');
})();
