// ==UserScript==
// @name         Popup Blocker
// @namespace    qutebrowser
// @version      2.0
// @description  Blocks all popups, modals, overlays, and cookie consent dialogs
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
        console.log('[Popup Blocker] Skipping whitelisted domain:', window.location.hostname);
        return;
    }

    // Block window.open popups
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        console.log('[Popup Blocker] Blocked popup:', url);
        return null;
    };

    // Block window.showModalDialog
    if (window.showModalDialog) {
        const originalShowModal = window.showModalDialog;
        window.showModalDialog = function() {
            console.log('[Popup Blocker] Blocked modal dialog');
            return null;
        };
    }

    // Popup/Modal selectors
    const popupSelectors = [
        // Cookie consent dialogs
        '.cookie-banner', '.cookie-notice', '.cookie-consent', '.cookie-alert',
        '[class*="cookie"]', '[id*="cookie"]', '.gdpr-banner', '.gdpr-notice',
        '.consent-banner', '.consent-popup', '.privacy-notice', '.privacy-banner',

        // Newsletter popups
        '.newsletter-popup', '.subscribe-popup', '.email-popup', '.signup-modal',
        '.newsletter-modal', '.subscribe-modal', '.email-modal', '.signup-popup',

        // Survey/feedback popups
        '.survey-popup', '.feedback-popup', '.rating-popup', '.review-popup',
        '.survey-modal', '.feedback-modal', '.rating-modal', '.review-modal',

        // Promotional popups
        '.promo-popup', '.promo-modal', '.offer-popup', '.deal-popup',
        '.promo-banner', '.offer-banner', '.discount-banner', '.sale-banner',

        // Exit intent popups
        '.exit-intent', '.exit-popup', '.exit-modal', '.abandon-popup',

        // General modal overlays
        '.modal-overlay', '.overlay', '.popup-overlay', '.modal-backdrop',
        '[class*="overlay"]', '[class*="backdrop"]', '[class*="modal-overlay"]',

        // Lightbox/Video popups
        '.lightbox', '.video-popup', '.image-popup', '.media-popup',

        // Age verification
        '.age-gate', '.age-verification', '.age-check', '.age-popup',

        // App download prompts
        '.app-download', '.download-prompt', '.app-banner', '.install-banner',

        // Push notifications
        '.push-notification', '.notification-prompt', '.subscribe-prompt',

        // Social share popups
        '.share-popup', '.social-popup', '.social-share-modal',

        // Chat widgets
        '.chat-widget', '.live-chat', '.support-widget', '.help-widget',
    ];

    // Function to remove popups
    function removePopups() {
        popupSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    // Check if element is visible
                    const style = window.getComputedStyle(el);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        // Check if it's actually a popup (fixed position, high z-index)
                        if (style.position === 'fixed' || style.position === 'absolute') {
                            const zIndex = parseInt(style.zIndex) || 0;
                            if (zIndex > 100) {
                                el.style.display = 'none';
                                el.remove();
                                console.log('[Popup Blocker] Removed popup:', selector);
                            }
                        } else {
                            el.style.display = 'none';
                            el.remove();
                            console.log('[Popup Blocker] Removed popup:', selector);
                        }
                    }
                });
            } catch (e) {
                // Ignore errors
            }
        });

        // Remove elements with specific text content
        const textPatterns = [
            'accept cookies', 'accept all cookies', 'cookie settings',
            'privacy policy', 'terms of service', 'gdpr consent',
            'subscribe to newsletter', 'sign up', 'join now',
            'get discount', 'limited offer', 'exclusive deal',
            'rate us', 'leave a review', 'give feedback',
        ];

        document.querySelectorAll('*').forEach(el => {
            if (el.children.length === 0) {
                const text = el.textContent.toLowerCase();
                textPatterns.forEach(pattern => {
                    if (text.includes(pattern)) {
                        const parent = el.parentElement;
                        if (parent && parent.style) {
                            const style = window.getComputedStyle(parent);
                            if (style.position === 'fixed' || style.zIndex > 100) {
                                parent.style.display = 'none';
                                parent.remove();
                                console.log('[Popup Blocker] Removed text-based popup:', pattern);
                            }
                        }
                    }
                });
            }
        });
    }

    // Block auto-generated popups
    function blockAutoPopups() {
        // Mutation observer for dynamically added popups
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Check if added node is a popup
                        const style = window.getComputedStyle(node);
                        if (style.position === 'fixed' || style.zIndex > 100) {
                            const className = node.className || '';
                            const id = node.id || '';
                            const isPopup = popupSelectors.some(selector => {
                                if (selector.startsWith('.')) {
                                    return className.includes(selector.substring(1));
                                } else if (selector.startsWith('[')) {
                                    return className.includes(selector) || id.includes(selector);
                                }
                                return false;
                            });
                            if (isPopup) {
                                node.style.display = 'none';
                                node.remove();
                                console.log('[Popup Blocker] Blocked dynamic popup');
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    }

    // Block notification requests
    if ('Notification' in window) {
        const originalRequestPermission = Notification.requestPermission;
        Notification.requestPermission = function() {
            console.log('[Popup Blocker] Blocked notification request');
            return Promise.resolve('denied');
        };
    }

    // Block geolocation requests
    if ('geolocation' in navigator) {
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
        navigator.geolocation.getCurrentPosition = function() {
            console.log('[Popup Blocker] Blocked geolocation request');
            return;
        };
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removePopups();
            blockAutoPopups();
        });
    } else {
        removePopups();
        blockAutoPopups();
    }

    // Periodic cleanup
    setInterval(removePopups, 3000);

    console.log('[Popup Blocker] Loaded - Blocking all popups and modals');
})();
