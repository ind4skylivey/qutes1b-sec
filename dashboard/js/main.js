/**
 * Main Dashboard Module
 * Initializes all components and sets up event listeners
 */

import { initClocks } from './clocks.js';
import { initSystemStats } from './system-stats.js';
import { initTerminal } from './terminal.js';
import { initTodoList } from './todo.js';
import { initNetworkViz } from './widgets.js';
import { initEffects } from './effects.js';

/**
 * Dashboard state
 */
const dashboardState = {
    initialized: false,
    version: '2.0.0',
    lastUpdate: null
};

/**
 * Initialize dashboard
 */
export function initDashboard() {
    if (dashboardState.initialized) {
        console.log('Dashboard already initialized');
        return;
    }

    console.log('Initializing Qutebrowser Dashboard v2.0...');

    // Initialize all modules
    initEffects();
    initClocks();
    initSystemStats();
    initNetworkViz();
    initTerminal();
    initTodoList();

    // Set initialization state
    dashboardState.initialized = true;
    dashboardState.lastUpdate = new Date();

    console.log('Dashboard initialized successfully!');
    console.log('Qutebrowser Dashboard v' + dashboardState.version);
}

/**
 * Reload dashboard
 */
export function reloadDashboard() {
    console.log('Reloading dashboard...');

    // Reload all modules
    initEffects();
    initClocks();
    initSystemStats();
    initNetworkViz();
    initTerminal();
    initTodoList();

    dashboardState.lastUpdate = new Date();

    console.log('Dashboard reloaded successfully!');
}

/**
 * Get dashboard version
 */
export function getVersion() {
    return dashboardState.version;
}

/**
 * Get dashboard state
 */
export function getState() {
    return {
        version: dashboardState.version,
        initialized: dashboardState.initialized,
        lastUpdate: dashboardState.lastUpdate,
        modules: {
            effects: true,
            clocks: true,
            systemStats: true,
            networkViz: true,
            terminal: true,
            todoList: true
        }
    };
}

/**
 * Handle keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+R - Reload dashboard
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            reloadDashboard();
            showNotification('Dashboard reloaded!');
        }

        // Ctrl+Shift+H - Show help
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            showHelp();
        }

        // Ctrl+Shift+T - Toggle terminal
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTerminal();
        }

        // Escape - Close modals/panels
        if (e.key === 'Escape') {
            closeModals();
        }
    });
}

/**
 * Show notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Show help modal
 */
function showHelp() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.id = 'help-modal';

    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 border border-gray-700 shadow-2xl">
            <div class="p-6 border-b border-gray-700">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-yellow-400">Dashboard Shortcuts</h2>
                    <button class="close-modal text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span class="text-gray-300">Reload Dashboard</span>
                        <kbd class="bg-gray-700 px-2 py-1 rounded text-sm">Ctrl + Shift + R</kbd>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span class="text-gray-300">Show Help</span>
                        <kbd class="bg-gray-700 px-2 py-1 rounded text-sm">Ctrl + Shift + H</kbd>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span class="text-gray-300">Toggle Terminal</span>
                        <kbd class="bg-gray-700 px-2 py-1 rounded text-sm">Ctrl + Shift + T</kbd>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span class="text-gray-300">Close Panel</span>
                        <kbd class="bg-gray-700 px-2 py-1 rounded text-sm">Escape</kbd>
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-gray-700 text-center text-gray-400">
                <p>Qutebrowser Dashboard v${getVersion()}</p>
            </div>
        </div>
    `;

    // Add close button listener
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}

/**
 * Toggle terminal visibility
 */
function toggleTerminal() {
    const terminal = document.getElementById('terminal');
    if (terminal) {
        terminal.classList.toggle('hidden');
        if (!terminal.classList.contains('hidden')) {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) {
                terminalInput.focus();
            }
        }
    }
}

/**
 * Close all modals
 */
function closeModals() {
    const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/50');
    modals.forEach(modal => modal.remove());
}

/**
 * Setup responsive menu (if needed)
 */
function setupResponsiveMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        // Filter search results on input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            if (query.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }

            const results = Array.from(searchResults.querySelectorAll('.search-result'))
                .filter(result => {
                    const text = result.textContent.toLowerCase();
                    return text.includes(query);
                })
                .slice(0, 10);

            if (results.length > 0) {
                searchResults.classList.remove('hidden');
                searchResults.innerHTML = results.map(result => `
                    <div class="search-result p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0">
                        ${escapeHtml(result.textContent)}
                    </div>
                `).join('');
            } else {
                searchResults.classList.add('hidden');
            }
        });

        // Hide results on click outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize dashboard on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

// Run initialization if already ready
if (document.readyState === 'complete') {
    initDashboard();
}
