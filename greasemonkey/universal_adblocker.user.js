// ==UserScript==
// @name         Universal AdBlocker
// @namespace    qutebrowser
// @version      2.0
// @description  Removes all ads, sponsored content, and advertising elements
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
        'search.brave.com',
        'startpage.com',
        'kagi.com',
        'github.com',
        'gitlab.com',
        'stackoverflow.com',
        'reddit.com',
        'wikipedia.org',
        'archlinux.org',
        'docs.rs',
        'developer.mozilla.org'
    ];

    if (whitelistedDomains.includes(window.location.hostname)) {
        console.log('[Universal AdBlocker] Skipping whitelisted domain:', window.location.hostname);
        return;
    }

    // Ad detection patterns
    const adSelectors = [
        // Common ad containers
        '[id*="ad"]', '[class*="ad-"]', '[class*="ad_"]', '[id*="advertisement"]',
        '[class*="advertisement"]', '[class*="sponsored"]', '[class*="promo"]',
        
        // Specific ad networks
        '[class*="google-ad"]', '[id*="googlead"]', '[class*="adsense"]', '[id*="adsense"]',
        '[class*="doubleclick"]', '[id*="doubleclick"]', '[class*="amazon-ads"]',
        '[class*="taboola"]', '[id*="taboola"]', '[class*="outbrain"]', '[id*="outbrain"]',
        
        // Banner ads
        '.banner-ad', '.ad-banner', '.leaderboard-ad', '.skyscraper-ad', '.rectangle-ad',
        
        // Sidebar ads
        '.sidebar-ad', '.side-ad', '.right-ad', '.left-ad',
        
        // Video ads
        '.video-ad', '.preroll-ad', '.midroll-ad', '.overlay-ad',
        
        // Native ads
        '.native-ad', '.sponsored-post', '.promoted-content', '.recommended-ads',
        
        // Popunder/overlay
        '.popunder', '.ad-overlay', '.popup-ad', '.modal-ad',
        
        // Specific sites
        'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]',
        'iframe[src*="amazon-adsystem"]', 'iframe[src*="taboola"]',
        
        // Data attributes
        '[data-ad]', '[data-ad-unit]', '[data-ads]', '[data-ad-client]',
    ];

    // Function to remove elements
    function removeElements() {
        adSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    // Check if element is visible
                    const style = window.getComputedStyle(el);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        el.style.display = 'none';
                        el.remove();
                    }
                });
            } catch (e) {
                // Ignore errors
            }
        });
    }

    // Function to block ad scripts
    function blockAdScripts() {
        const adPatterns = [
            'doubleclick', 'googlesyndication', 'google-analytics',
            'facebook.net', 'twitter.com/widgets', 'amazon-adsystem',
            'taboola', 'outbrain', 'adnxs', 'adserver', 'adform',
        ];

        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const src = iframe.src.toLowerCase();
            if (adPatterns.some(pattern => src.includes(pattern))) {
                iframe.remove();
            }
        });

        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const src = script.src.toLowerCase();
            if (adPatterns.some(pattern => src.includes(pattern))) {
                script.remove();
            }
        });
    }

    // Run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeElements();
            blockAdScripts();
        });
    } else {
        removeElements();
        blockAdScripts();
    }

    // Continuous monitoring
    let observer = new MutationObserver(() => {
        removeElements();
        blockAdScripts();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    // Periodic cleanup
    setInterval(() => {
        removeElements();
        blockAdScripts();
    }, 3000);

    console.log('[Universal AdBlocker] Loaded - Removing all ads');
})();
