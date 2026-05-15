// ==UserScript==
// @name         Element Hider
// @namespace    qutebrowser
// @version      2.0
// @description  Hides ad containers, banners, sponsored content, and clutter
// @author       S1BGr0up
// @match        *://*/*
// @grant        none
// @run-at       document-end
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
        'archlinux.org',
        'stackoverflow.com',
        'developer.mozilla.org',
        'docs.rs'
    ];

    if (whitelistedDomains.includes(window.location.hostname)) {
        console.log('[Element Hider] Skipping whitelisted domain:', window.location.hostname);
        return;
    }

    // Element selectors to hide
    const hideSelectors = [
        // Sidebar ads and widgets
        '.sidebar-ad', '.side-ad', '.right-ad', '.left-ad',
        '.sidebar-widget', '.side-widget', '.widget-ad',
        '[class*="sidebar-ad"]', '[class*="side-ad"]',

        // Banner ads
        '.banner-ad', '.top-banner', '.bottom-banner', '.leaderboard',
        '.skyscraper', '.mpu', '.rectangle-ad', '.half-page',
        '[class*="banner-ad"]', '[class*="top-banner"]',

        // Sponsored content
        '.sponsored', '.sponsored-content', '.sponsored-post',
        '.promoted', '.promoted-content', '.ad-feature',
        '.partner-content', '.paid-content', '.native-ad',
        '[class*="sponsored"]', '[class*="promoted"]',

        // Social media widgets
        '.social-share', '.share-buttons', '.social-widget',
        '.facebook-like', '.twitter-follow', '.instagram-widget',
        '.pinterest-pin', '.linkedin-share',

        // Newsletter/signup forms
        '.newsletter', '.subscribe-form', '.signup-form',
        '.email-signup', '.newsletter-box', '.subscribe-box',

        // Comments and related posts
        '.comments-section', '.related-posts', '.recommended-posts',
        '.trending-posts', '.popular-posts', '.more-from',

        // Footer ads and links
        '.footer-ad', '.footer-links', '.footer-widget',
        '.bottom-ad', '.site-footer',

        // Header ads
        '.header-ad', '.top-ad', '.masthead-ad',
        '.header-banner', '.top-banner',

        // In-article ads
        '.in-article-ad', '.article-ad', '.post-ad',
        '.content-ad', '.inline-ad', '.native-ad',

        // Video ads and players
        '.video-ad', '.video-player-ad', '.pre-roll-ad',
        '.mid-roll-ad', '.post-roll-ad',

        // Specific ad networks
        '.google-ad', '.adsense-ad', '.doubleclick-ad',
        '.amazon-ad', '.taboola-ad', '.outbrain-ad',

        // General ad containers
        '[class*="ad-container"]', '[class*="ad-wrapper"]',
        '[class*="ad-slot"]', '[class*="ad-unit"]',
        '[id*="ad-container"]', '[id*="ad-wrapper"]',
        '[id*="ad-slot"]', '[id*="ad-unit"]',

        // Clutter elements
        '.cookie-banner', '.cookie-notice', '.gdpr-banner',
        '.promo-banner', '.promo-box', '.offer-banner',
        '.notification-banner', '.alert-banner', '.warning-banner',

        // Floating elements
        '.floating-ad', '.sticky-ad', '.fixed-ad',
        '.floating-widget', '.sticky-widget',

        // Sidebar clutter
        '.sidebar-clutter', '.side-clutter', '.widget-clutter',

        // Recommended/related content
        '.recommended', '.related-content', '.you-may-like',
        '.more-to-read', '.trending-now', '.popular-now',

        // Data attributes
        '[data-ad]', '[data-ad-unit]', '[data-ads]',
        '[data-sponsored]', '[data-promoted]',
    ];

    // Function to hide elements
    function hideElements() {
        hideSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    // Check if element is visible
                    const style = window.getComputedStyle(el);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        el.style.display = 'none';
                        el.setAttribute('data-hidden-by-element-hider', 'true');
                    }
                });
            } catch (e) {
                // Ignore errors
            }
        });
    }

    // Function to hide elements by text content
    function hideByTextContent() {
        const textPatterns = [
            'advertisement', 'sponsored', 'promoted content',
            'recommended for you', 'you may also like',
            'trending now', 'popular stories',
            'subscribe to our newsletter', 'sign up now',
        ];

        document.querySelectorAll('*').forEach(el => {
            if (el.children.length === 0) {
                const text = el.textContent.toLowerCase().trim();
                textPatterns.forEach(pattern => {
                    if (text === pattern) {
                        const parent = el.parentElement;
                        if (parent && parent.style) {
                            parent.style.display = 'none';
                            parent.setAttribute('data-hidden-by-element-hider', 'true');
                        }
                    }
                });
            }
        });
    }

    // Function to hide social media widgets
    function hideSocialWidgets() {
        const socialSelectors = [
            'iframe[src*="facebook.com/plugins"]',
            'iframe[src*="twitter.com/widgets"]',
            'iframe[src*="instagram.com"]',
            'iframe[src*="pinterest.com"]',
            'iframe[src*="linkedin.com"]',
        ];

        socialSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-hidden-by-element-hider', 'true');
            });
        });
    }

    // Function to hide cookie banners
    function hideCookieBanners() {
        const cookieSelectors = [
            '.cookie-banner', '.cookie-notice', '.cookie-consent',
            '.gdpr-banner', '.privacy-notice', '.consent-banner',
            '[class*="cookie"]', '[class*="gdpr"]',
        ];

        cookieSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky') {
                    el.style.display = 'none';
                    el.setAttribute('data-hidden-by-element-hider', 'true');
                }
            });
        });
    }

    // Function to hide newsletter forms
    function hideNewsletterForms() {
        const newsletterSelectors = [
            '.newsletter', '.subscribe-form', '.signup-form',
            '.email-signup', '.newsletter-box', '.subscribe-box',
        ];

        newsletterSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-hidden-by-element-hider', 'true');
            });
        });
    }

    // Run immediately
    hideElements();
    hideByTextContent();
    hideSocialWidgets();
    hideCookieBanners();
    hideNewsletterForms();

    // Continuous monitoring
    let observer = new MutationObserver(() => {
        hideElements();
        hideByTextContent();
        hideSocialWidgets();
        hideCookieBanners();
        hideNewsletterForms();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    // Periodic cleanup
    setInterval(() => {
        hideElements();
        hideByTextContent();
        hideSocialWidgets();
        hideCookieBanners();
        hideNewsletterForms();
    }, 3000);

    console.log('[Element Hider] Loaded - Hiding clutter and unwanted elements');
})();
