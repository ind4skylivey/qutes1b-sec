/**
 * System Stats Module for Dashboard
 * Simulates CPU and RAM usage with realistic patterns
 */

/**
 * System statistics state
 */
const systemStats = {
    cpu: {
        value: 0,
        history: [],
        maxHistory: 50,
        currentLoad: 0,
        previousLoad: 0,
        loadInterval: 0
    },
    ram: {
        total: 0,
        used: 0,
        free: 0,
        percentage: 0,
        history: [],
        maxHistory: 50
    },
    uptime: {
        totalSeconds: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }
};

/**
 * DOM elements for system stats
 */
const statsElements = {
    cpuValue: null,
    cpuBar: null,
    cpuHistory: null,
    ramTotal: null,
    ramUsed: null,
    ramFree: null,
    ramPercentage: null,
    ramBar: null,
    uptime: null
};

/**
 * Initialize system stats
 */
export function initSystemStats() {
    // Initialize CPU
    systemStats.cpu.currentLoad = randomInt(20, 60);

    // Initialize RAM
    updateRAMStats();

    // Initialize uptime
    updateUptime();

    // Create DOM elements if they don't exist
    createStatsElements();

    // Start update loops
    setInterval(updateCPU, 1000); // CPU every second
    setInterval(updateRAM, 2000); // RAM every 2 seconds
    setInterval(updateUptime, 1000); // Uptime every second
    setInterval(updateCPUHistory, 100); // CPU history every 100ms
}

/**
 * Create DOM elements for system stats
 */
function createStatsElements() {
    // CPU elements
    statsElements.cpuValue = document.getElementById('cpu-value');
    statsElements.cpuBar = document.getElementById('cpu-bar');
    statsElements.cpuHistory = document.getElementById('cpu-history');

    // RAM elements
    statsElements.ramTotal = document.getElementById('ram-total');
    statsElements.ramUsed = document.getElementById('ram-used');
    statsElements.ramFree = document.getElementById('ram-free');
    statsElements.ramPercentage = document.getElementById('ram-percentage');
    statsElements.ramBar = document.getElementById('ram-bar');

    // Uptime element
    statsElements.uptime = document.getElementById('uptime');
}

/**
 * Update CPU statistics with realistic pattern
 */
function updateCPU() {
    // Simulate realistic CPU load with some randomness
    const time = Date.now();
    const pattern = Math.sin(time / 5000) * 0.3 + 0.7; // Sine wave pattern
    const noise = (Math.random() - 0.5) * 0.2; // Random noise

    systemStats.cpu.previousLoad = systemStats.cpu.currentLoad;
    systemStats.cpu.currentLoad = Math.max(5, Math.min(95, pattern + noise));

    // Update load interval (average over last 5 seconds)
    systemStats.cpu.loadInterval = (systemStats.cpu.loadInterval * 4 + systemStats.cpu.currentLoad) / 5;

    // Update DOM
    if (statsElements.cpuValue) {
        statsElements.cpuValue.textContent = Math.round(systemStats.cpu.loadInterval) + '%';
    }
    if (statsElements.cpuBar) {
        statsElements.cpuBar.style.width = Math.round(systemStats.cpu.loadInterval) + '%';
    }
}

/**
 * Update CPU history for visualization
 */
function updateCPUHistory() {
    systemStats.cpu.history.push(systemStats.cpu.currentLoad);
    if (systemStats.cpu.history.length > systemStats.cpu.maxHistory) {
        systemStats.cpu.history.shift();
    }

    // Update history visualization
    if (statsElements.cpuHistory) {
        const historyHTML = systemStats.cpu.history.map(value => {
            const height = value + '%';
            const color = value > 80 ? 'bg-red-500' : value > 50 ? 'bg-yellow-500' : 'bg-green-500';
            return `<div class="w-1 bg-green-500 rounded-t" style="height: ${height}"></div>`;
        }).join('');
        statsElements.cpuHistory.innerHTML = historyHTML;
    }
}

/**
 * Update RAM statistics
 */
function updateRAMStats() {
    try {
        // Try to get actual system stats
        if (navigator.deviceMemory) {
            // Browser-reported RAM (approximate)
            systemStats.ram.total = navigator.deviceMemory * 1024;
            systemStats.ram.free = systemStats.ram.total * 0.7;
        } else if (window.performance && window.performance.memory) {
            // Chrome memory API
            const memory = window.performance.memory;
            systemStats.ram.total = Math.round(memory.jsHeapSizeLimit / (1024 * 1024 * 1024));
            systemStats.ram.used = Math.round(memory.usedJSHeapSize / (1024 * 1024 * 1024));
            systemStats.ram.free = systemStats.ram.total - systemStats.ram.used;
        } else {
            // Simulation if no API available
            systemStats.ram.total = 16; // 16GB typical
            systemStats.ram.used = randomInt(4, 12);
            systemStats.ram.free = systemStats.ram.total - systemStats.ram.used;
        }
    } catch (error) {
        // Fallback to simulation
        systemStats.ram.total = 16;
        systemStats.ram.used = randomInt(4, 12);
        systemStats.ram.free = systemStats.ram.total - systemStats.ram.used;
    }

    systemStats.ram.percentage = Math.round((systemStats.ram.used / systemStats.ram.total) * 100);

    // Update RAM history
    systemStats.ram.history.push(systemStats.ram.percentage);
    if (systemStats.ram.history.length > systemStats.ram.maxHistory) {
        systemStats.ram.history.shift();
    }

    // Update DOM
    if (statsElements.ramTotal) {
        statsElements.ramTotal.textContent = systemStats.ram.total + ' GB';
    }
    if (statsElements.ramUsed) {
        statsElements.ramUsed.textContent = systemStats.ram.used + ' GB';
    }
    if (statsElements.ramFree) {
        statsElements.ramFree.textContent = systemStats.ram.free + ' GB';
    }
    if (statsElements.ramPercentage) {
        statsElements.ramPercentage.textContent = systemStats.ram.percentage + '%';
    }
    if (statsElements.ramBar) {
        statsElements.ramBar.style.width = systemStats.ram.percentage + '%';
    }
}

/**
 * Update uptime statistics
 */
function updateUptime() {
    systemStats.uptime.totalSeconds += 1;

    const days = Math.floor(systemStats.uptime.totalSeconds / 86400);
    const hours = Math.floor((systemStats.uptime.totalSeconds % 86400) / 3600);
    const minutes = Math.floor((systemStats.uptime.totalSeconds % 3600) / 60);
    const seconds = systemStats.uptime.totalSeconds % 60;

    systemStats.uptime.days = days;
    systemStats.uptime.hours = hours;
    systemStats.uptime.minutes = minutes;
    systemStats.uptime.seconds = seconds;

    // Update DOM
    if (statsElements.uptime) {
        const dayStr = days > 0 ? `${days}d ` : '';
        const hourStr = hours > 0 ? `${hours}h ` : '';
        statsElements.uptime.textContent = `${dayStr}${hourStr}${minutes}m ${seconds}s`;
    }
}

/**
 * Get current CPU load percentage
 * @returns {number} CPU load percentage
 */
export function getCPULoad() {
    return Math.round(systemStats.cpu.loadInterval);
}

/**
 * Get CPU history data
 * @returns {Array} CPU history array
 */
export function getCPUHistory() {
    return [...systemStats.cpu.history];
}

/**
 * Get current RAM statistics
 * @returns {Object} RAM statistics object
 */
export function getRAMStats() {
    return {
        total: systemStats.ram.total,
        used: systemStats.ram.used,
        free: systemStats.ram.free,
        percentage: systemStats.ram.percentage,
        history: [...systemStats.ram.history]
    };
}

/**
 * Get uptime statistics
 * @returns {Object} Uptime statistics object
 */
export function getUptimeStats() {
    return {
        days: systemStats.uptime.days,
        hours: systemStats.uptime.hours,
        minutes: systemStats.uptime.minutes,
        seconds: systemStats.uptime.seconds,
        totalSeconds: systemStats.uptime.totalSeconds
    };
}

/**
 * Get all system statistics
 * @returns {Object} Complete system statistics
 */
export function getAllStats() {
    return {
        cpu: {
            current: Math.round(systemStats.cpu.currentLoad),
            loadInterval: Math.round(systemStats.cpu.loadInterval),
            history: [...systemStats.cpu.history]
        },
        ram: getRAMStats(),
        uptime: getUptimeStats()
    };
}

/**
 * Reset CPU history
 */
export function resetCPUHistory() {
    systemStats.cpu.history = [];
    if (statsElements.cpuHistory) {
        statsElements.cpuHistory.innerHTML = '';
    }
}

/**
 * Reset RAM history
 */
export function resetRAMHistory() {
    systemStats.ram.history = [];
    if (statsElements.ramBar) {
        statsElements.ramBar.style.width = systemStats.ram.percentage + '%';
    }
}

/**
 * Force update all statistics immediately
 */
export function forceUpdate() {
    updateCPU();
    updateRAMStats();
    updateUptime();
}

/**
 * Get CPU usage trend (up/down)
 * @returns {string} 'up', 'down', or 'stable'
 */
export function getCPUSignal() {
    if (systemStats.cpu.currentLoad > systemStats.cpu.previousLoad + 5) {
        return 'up';
    } else if (systemStats.cpu.currentLoad < systemStats.cpu.previousLoad - 5) {
        return 'down';
    } else {
        return 'stable';
    }
}

/**
 * Get memory warning level
 * @returns {string} 'low', 'medium', 'high', or 'critical'
 */
export function getMemoryLevel() {
    const percentage = systemStats.ram.percentage;

    if (percentage >= 90) {
        return 'critical';
    } else if (percentage >= 75) {
        return 'high';
    } else if (percentage >= 50) {
        return 'medium';
    } else {
        return 'low';
    }
}

/**
 * Check if system is under heavy load
 * @returns {boolean} True if under heavy load
 */
export function isUnderHeavyLoad() {
    return systemStats.cpu.loadInterval > 80 || systemStats.ram.percentage > 80;
}

// Initialize system stats when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSystemStats);
} else {
    initSystemStats();
}
