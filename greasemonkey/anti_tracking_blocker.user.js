// ==UserScript==
// @name         Anti-Tracking Blocker
// @namespace    qutebrowser
// @version      2.0
// @description  Blocks Google Analytics, tracking scripts, and browser fingerprinting
// @author       S1BGr0up
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Skip execution on localhost/dashboard
    if (window.location.hostname === '127.0.0.1' || 
        window.location.hostname === 'localhost' ||
        window.location.port === '9999' ||
        window.location.href.includes('dashboard')) {
        return;
    }

    // Whitelist for search engines and essential services
    const whitelistedDomains = [
        'duckduckgo.com',
        'google.com',
        'bing.com',
        'github.com',
        'gitlab.com',
        'archlinux.org'
    ];

    if (whitelistedDomains.includes(window.location.hostname)) {
        console.log('[Anti-Tracking] Skipping whitelisted domain:', window.location.hostname);
        return;
    }

    // Block Google Analytics
    const originalGa = window.ga;
    const originalGtag = window.gtag;
    const originalDataLayer = window.dataLayer;

    window.ga = function() {
        console.log('[Anti-Tracking] Blocked Google Analytics call');
        return;
    };

    window.gtag = function() {
        console.log('[Anti-Tracking] Blocked gtag call');
        return;
    };

    window.dataLayer = [];

    // Block tracking beacons
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function() {
        const url = arguments[0];
        if (url.includes('analytics') || url.includes('tracking') || url.includes('beacon')) {
            console.log('[Anti-Tracking] Blocked beacon:', url);
            return false;
        }
        return originalSendBeacon.apply(this, arguments);
    };

    // Block tracking pixels
    function blockTrackingPixels() {
        const trackingPatterns = [
            'google-analytics.com/analytics.js',
            'googletagmanager.com/gtag',
            'facebook.com/tr',
            'connect.facebook.net/en_US/fbevents.js',
            'bat.bing.com/bat.js',
            'stats.g.doubleclick.net',
            'pixel.advertising.com',
            'pixel.wp.com',
            'pixel.quantserve.com',
        ];

        // Block tracking scripts
        document.querySelectorAll('script').forEach(script => {
            trackingPatterns.forEach(pattern => {
                if (script.src.includes(pattern)) {
                    script.remove();
                    console.log('[Anti-Tracking] Blocked tracking script:', pattern);
                }
            });
        });

        // Block tracking iframes
        document.querySelectorAll('iframe').forEach(iframe => {
            trackingPatterns.forEach(pattern => {
                if (iframe.src.includes(pattern)) {
                    iframe.remove();
                    console.log('[Anti-Tracking] Blocked tracking iframe:', pattern);
                }
            });
        });

        // Block tracking images (1x1 pixels)
        document.querySelectorAll('img').forEach(img => {
            if (img.width === 1 && img.height === 1) {
                img.remove();
                console.log('[Anti-Tracking] Blocked tracking pixel');
            }
        });
    }

    // Block fingerprinting
    function blockFingerprinting() {
        // Canvas fingerprinting protection
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
            const context = this.getContext('2d');
            if (context) {
                context.fillStyle = 'rgba(0,0,0,0)';
                context.fillRect(0, 0, this.width, this.height);
            }
            return originalToDataURL.apply(this, arguments);
        };

        const originalGetImageData = HTMLCanvasElement.prototype.getImageData;
        HTMLCanvasElement.prototype.getImageData = function() {
            const context = this.getContext('2d');
            if (context) {
                context.fillStyle = 'rgba(0,0,0,0)';
                context.fillRect(0, 0, this.width, this.height);
            }
            return originalGetImageData.apply(this, arguments);
        };

        // WebGL fingerprinting protection
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37445) return 'Intel Inc.';
            if (parameter === 37446) return 'Intel Iris OpenGL Engine';
            return originalGetParameter.apply(this, arguments);
        };

        // Audio fingerprinting protection
        const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
        AudioContext.prototype.createAnalyser = function() {
            const analyser = originalCreateAnalyser.apply(this, arguments);
            analyser.fftSize = 2048;
            return analyser;
        };

        // Font fingerprinting protection
        const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
        CanvasRenderingContext2D.prototype.measureText = function() {
            const result = originalMeasureText.apply(this, arguments);
            result.width = Math.floor(result.width);
            return result;
        };
    }

    // Block localStorage tracking
    function blockLocalStorageTracking() {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            const trackingKeys = [
                'ga_', 'gtm_', 'fb_', 'fbp_', '_fbp', '_fbc',
                '_ga', '_gid', '_gat', 'amplitude_', 'mixpanel_',
            ];
            const isTracking = trackingKeys.some(k => key.startsWith(k));
            if (isTracking) {
                console.log('[Anti-Tracking] Blocked localStorage tracking:', key);
                return;
            }
            return originalSetItem.apply(this, arguments);
        };
    }

    // Block sessionStorage tracking
    function blockSessionStorageTracking() {
        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function(key, value) {
            const trackingKeys = ['ga_', 'gtm_', 'fb_'];
            const isTracking = trackingKeys.some(k => key.startsWith(k));
            if (isTracking) {
                console.log('[Anti-Tracking] Blocked sessionStorage tracking:', key);
                return;
            }
            return originalSetItem.apply(this, arguments);
        };
    }

    // Initialize
    blockFingerprinting();
    blockLocalStorageTracking();
    blockSessionStorageTracking();

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', blockTrackingPixels);
    } else {
        blockTrackingPixels();
    }

    // Continuous monitoring
    let observer = new MutationObserver(() => {
        blockTrackingPixels();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    // Periodic cleanup
    setInterval(blockTrackingPixels, 5000);

    console.log('[Anti-Tracking] Loaded - Blocking all tracking scripts');
})();
