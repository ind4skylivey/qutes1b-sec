/**
 * Clocks Module for Dashboard
 * Displays multiple time zones with real-time updates
 */

/**
 * Clock configuration with timezone info
 */
const CLOCK_CONFIG = [
    {
        id: 'local-clock',
        label: 'Local Time',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        element: null
    },
    {
        id: 'london-clock',
        label: 'London',
        timezone: 'Europe/London',
        element: null
    },
    {
        id: 'thailand-clock',
        label: 'Thailand',
        timezone: 'Asia/Bangkok',
        element: null
    }
];

/**
 * Current time display elements
 */
const timeElements = {
    local: { hour: null, minute: null, second: null, ms: null },
    london: { hour: null, minute: null, second: null },
    thailand: { hour: null, minute: null, second: null }
};

/**
 * Format time based on timezone
 * @param {string} timezone - Timezone to format for
 * @returns {string} Formatted time string
 */
export function getTimeInTimezone(timezone) {
    const now = new Date();
    const options = {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return now.toLocaleTimeString('en-US', options);
}

/**
 * Get formatted date with timezone info
 * @param {string} timezone - Timezone to format for
 * @returns {string} Formatted date string
 */
export function getDateInTimezone(timezone) {
    const now = new Date();
    const options = {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
}

/**
 * Initialize clock elements
 */
export function initClocks() {
    // Initialize time display elements
    timeElements.local.hour = document.getElementById('local-hour');
    timeElements.local.minute = document.getElementById('local-minute');
    timeElements.local.second = document.getElementById('local-second');
    timeElements.local.ms = document.getElementById('local-ms');

    timeElements.london.hour = document.getElementById('london-hour');
    timeElements.london.minute = document.getElementById('london-minute');
    timeElements.london.second = document.getElementById('london-second');

    timeElements.thailand.hour = document.getElementById('thailand-hour');
    timeElements.thailand.minute = document.getElementById('thailand-minute');
    timeElements.thailand.second = document.getElementById('thailand-second');

    // Initialize configuration elements
    CLOCK_CONFIG.forEach(clock => {
        const element = document.getElementById(clock.id);
        if (element) {
            clock.element = element;
        }
    });

    // Start clock update loop
    updateClocks();
    setInterval(updateClocks, 100); // Update every 100ms for smooth millisecond display
}

/**
 * Update all clocks
 */
function updateClocks() {
    const now = new Date();

    // Update local time with milliseconds
    if (timeElements.local.hour && timeElements.local.minute && timeElements.local.second && timeElements.local.ms) {
        timeElements.local.hour.textContent = String(now.getHours()).padStart(2, '0');
        timeElements.local.minute.textContent = String(now.getMinutes()).padStart(2, '0');
        timeElements.local.second.textContent = String(now.getSeconds()).padStart(2, '0');
        timeElements.local.ms.textContent = String(now.getMilliseconds()).padStart(3, '0');
    }

    // Update London time
    if (timeElements.london.hour && timeElements.london.minute && timeElements.london.second) {
        const londonTime = getTimeInTimezone('Europe/London');
        const [hour, minute, second] = londonTime.split(':').map(Number);
        timeElements.london.hour.textContent = String(hour).padStart(2, '0');
        timeElements.london.minute.textContent = String(minute).padStart(2, '0');
        timeElements.london.second.textContent = String(second).padStart(2, '0');
    }

    // Update Thailand time
    if (timeElements.thailand.hour && timeElements.thailand.minute && timeElements.thailand.second) {
        const thailandTime = getTimeInTimezone('Asia/Bangkok');
        const [hour, minute, second] = thailandTime.split(':').map(Number);
        timeElements.thailand.hour.textContent = String(hour).padStart(2, '0');
        timeElements.thailand.minute.textContent = String(minute).padStart(2, '0');
        timeElements.thailand.second.textContent = String(second).padStart(2, '0');
    }
}

/**
 * Get current local time as HH:MM:SS string
 * @returns {string} Local time string
 */
export function getLocalTime() {
    return getTimeInTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
}

/**
 * Get current London time as HH:MM:SS string
 * @returns {string} London time string
 */
export function getLondonTime() {
    return getTimeInTimezone('Europe/London');
}

/**
 * Get current Thailand time as HH:MM:SS string
 * @returns {string} Thailand time string
 */
export function getThailandTime() {
    return getTimeInTimezone('Asia/Bangkok');
}

/**
 * Get all clocks data
 * @returns {Object} Clock data object
 */
export function getClocksData() {
    return {
        local: {
            time: getLocalTime(),
            date: getDateInTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        },
        london: {
            time: getLondonTime(),
            date: getDateInTimezone('Europe/London')
        },
        thailand: {
            time: getThailandTime(),
            date: getDateInTimezone('Asia/Bangkok')
        }
    };
}

/**
 * Get difference in hours between two timezones
 * @param {string} timezone1 - First timezone
 * @param {string} timezone2 - Second timezone
 * @returns {number} Difference in hours
 */
export function getTimezoneDifference(timezone1, timezone2) {
    const time1 = new Date().toLocaleString('en-US', { timeZone: timezone1 });
    const time2 = new Date().toLocaleString('en-US', { timeZone: timezone2 });
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
}

/**
 * Check if a timezone is in daylight saving time
 * @param {string} timezone - Timezone to check
 * @returns {boolean} True if in DST
 */
export function isInDST(timezone) {
    const date = new Date();
    const options = {
        timeZone,
        timeZoneName: 'short'
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const dstPart = parts.find(part => part.type === 'timeZoneName');
    return dstPart && dstPart.value.includes('DST');
}

/**
 * Format time for display with timezone
 * @param {Date} date - Date object
 * @param {string} timezone - Timezone to format for
 * @returns {Object} Formatted time object
 */
export function formatTimeWithTimezone(date, timezone) {
    const time = getTimeInTimezone(timezone);
    const dateStr = getDateInTimezone(timezone);
    const isDST = isInDST(timezone);

    return {
        time: time,
        date: dateStr,
        isDST: isDST,
        timestamp: date.getTime()
    };
}

/**
 * Get next timezone transition for a given timezone
 * @param {string} timezone - Timezone to check
 * @returns {Object|null} Next transition data or null
 */
export function getNextTimezoneTransition(timezone) {
    const date = new Date();
    const options = {
        timeZone,
        timeZoneName: 'short'
    };

    // Get current offset
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const dstPart = parts.find(part => part.type === 'timeZoneName');

    return {
        currentOffset: dstPart ? dstPart.value : 'Unknown',
        nextChange: 'Automatic transition scheduled',
        timezone: timezone
    };
}

/**
 * Refresh all clock elements (useful for re-initialization)
 */
export function refreshClocks() {
    updateClocks();
}

// Initialize clocks when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClocks);
} else {
    initClocks();
}
