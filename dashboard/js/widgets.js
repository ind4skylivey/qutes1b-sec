/**
 * Network Visualization Module for Dashboard
 * Interactive network traffic visualization
 */

import { utils } from './utils.js';

/**
 * Network visualization state
 */
const networkState = {
    activeConnections: 0,
    totalBytes: 0,
    incomingBytes: 0,
    outgoingBytes: 0,
    history: [],
    maxHistory: 100,
    simulationActive: true,
    nodes: [],
    edges: [],
    packetSpeed: 0,
    connectionSpeed: 0
};

/**
 * Node types for visualization
 */
const NODE_TYPES = [
    { icon: '🌐', color: 'bg-blue-500', name: 'External' },
    { icon: '🔒', color: 'bg-green-500', name: 'Secure' },
    { icon: '⚠️', color: 'bg-yellow-500', name: 'Warning' },
    { icon: '❌', color: 'bg-red-500', name: 'Blocked' }
];

/**
 * Initialize network visualization
 */
export function initNetworkViz() {
    // Initialize nodes
    initNodes();

    // Initialize edges
    initEdges();

    // Start simulation
    startSimulation();

    // Render visualization
    renderNetworkViz();

    // Setup interactions
    setupInteractions();
}

/**
 * Initialize network nodes
 */
function initNodes() {
    const centerX = 300; // Will be updated dynamically
    const centerY = 150; // Will be updated dynamically
    const nodeCount = 15;

    networkState.nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 80 + Math.random() * 40;

        networkState.nodes.push({
            id: i,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            type: NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)],
            traffic: Math.random(),
            label: `node_${i}`,
            connections: []
        });
    }
}

/**
 * Initialize network edges
 */
function initEdges() {
    const nodes = networkState.nodes;
    networkState.edges = [];

    // Create random connections between nodes
    nodes.forEach((node, index) => {
        const connectionCount = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < connectionCount; i++) {
            const targetIndex = Math.floor(Math.random() * nodes.length);
            if (targetIndex !== index) {
                // Check if edge already exists
                const exists = networkState.edges.some(edge =>
                    (edge.from === index && edge.to === targetIndex) ||
                    (edge.from === targetIndex && edge.to === index)
                );

                if (!exists) {
                    networkState.edges.push({
                        from: index,
                        to: targetIndex,
                        traffic: Math.random(),
                        active: Math.random() > 0.3,
                        packets: 0
                    });
                    node.connections.push(targetIndex);
                }
            }
        }
    });
}

/**
 * Start network simulation
 */
function startSimulation() {
    setInterval(updateNetworkSimulation, 500); // Update every 500ms
    setInterval(updatePacketFlow, 100); // Packet flow every 100ms
}

/**
 * Update network simulation data
 */
function updateNetworkSimulation() {
    if (!networkState.simulationActive) return;

    // Update traffic levels
    networkState.nodes.forEach(node => {
        node.traffic = Math.max(0, Math.min(1, node.traffic + (Math.random() - 0.5) * 0.2));
    });

    networkState.edges.forEach(edge => {
        edge.traffic = Math.max(0, Math.min(1, edge.traffic + (Math.random() - 0.5) * 0.3));
        edge.active = Math.random() > 0.3;
    });

    // Update statistics
    networkState.activeConnections = Math.floor(networkState.edges.filter(e => e.active).length);
    networkState.connectionSpeed = Math.floor(networkState.activeConnections * 120);

    // Update bytes
    networkState.incomingBytes += Math.floor(Math.random() * 1024);
    networkState.outgoingBytes += Math.floor(Math.random() * 512);

    // Update history
    const currentTraffic = networkState.edges.reduce((sum, edge) => sum + edge.traffic, 0) / networkState.edges.length;
    networkState.history.push(currentTraffic);
    if (networkState.history.length > networkState.maxHistory) {
        networkState.history.shift();
    }

    // Update total bytes
    networkState.totalBytes += networkState.incomingBytes + networkState.outgoingBytes;
}

/**
 * Update packet flow animation
 */
function updatePacketFlow() {
    if (!networkState.simulationActive) return;

    networkState.edges.forEach(edge => {
        if (edge.active && Math.random() > 0.8) {
            edge.packets = Math.min(5, edge.packets + 1);
            setTimeout(() => {
                edge.packets = Math.max(0, edge.packets - 1);
            }, 300);
        }
    });
}

/**
 * Render network visualization
 */
function renderNetworkViz() {
    const container = document.getElementById('network-container');
    const statsContainer = document.getElementById('network-stats');

    if (!container || !statsContainer) return;

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Center nodes
    networkState.nodes.forEach(node => {
        node.x = centerX + (node.x - centerX) * 0.9;
        node.y = centerY + (node.y - centerY) * 0.9;
    });

    // Render network diagram
    let html = '';

    // Draw edges first
    networkState.edges.forEach(edge => {
        const fromNode = networkState.nodes[edge.from];
        const toNode = networkState.nodes[edge.to];

        html += `
            <svg class="absolute inset-0 pointer-events-none w-full h-full">
                <line
                    x1="${fromNode.x}"
                    y1="${fromNode.y}"
                    x2="${toNode.x}"
                    y2="${toNode.y}"
                    stroke="${edge.active ? 'rgba(34, 211, 238, 0.3)' : 'rgba(75, 85, 99, 0.2)'}"
                    stroke-width="${2 + edge.traffic * 2}"
                    stroke-linecap="round"
                />
                ${Array(edge.packets).fill().map((_, i) => {
                    const progress = (Date.now() % 1000) / 1000;
                    const px = fromNode.x + (toNode.x - fromNode.x) * progress;
                    const py = fromNode.y + (toNode.y - fromNode.y) * progress;
                    return `<circle
                        cx="${px}"
                        cy="${py}"
                        r="3"
                        fill="#22d3ee"
                        class="animate-pulse"
                    />`;
                }).join('')}
            </svg>
        `;
    });

    // Draw nodes
    networkState.nodes.forEach(node => {
        html += `
            <div
                class="absolute rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                style="left: ${node.x}px; top: ${node.y}px; width: 50px; height: 50px; background: ${node.type.color}20; border: 2px solid ${node.type.color};"
                title="${node.type.name}: ${node.label}"
            >
                <span class="text-xl">${node.type.icon}</span>
            </div>
            <div class="absolute left-[calc(${node.x}px+30px)] top-[calc(${node.y}px+25px)] text-xs text-gray-300 whitespace-nowrap">
                ${node.label}
            </div>
        `;
    });

    container.innerHTML = html;

    // Render statistics
    renderStats(statsContainer);
}

/**
 * Render statistics
 */
function renderStats(container) {
    const speed = utils.formatBytes(networkState.connectionSpeed, 0) + '/s';
    const incoming = utils.formatBytes(networkState.incomingBytes, 0);
    const outgoing = utils.formatBytes(networkState.outgoingBytes, 0);
    const total = utils.formatBytes(networkState.totalBytes, 0);

    container.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div class="text-xs text-gray-400 mb-1">Active Connections</div>
                <div class="text-2xl font-bold text-yellow-400">${networkState.activeConnections}</div>
            </div>
            <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div class="text-xs text-gray-400 mb-1">Connection Speed</div>
                <div class="text-2xl font-bold text-cyan-400">${speed}</div>
            </div>
            <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div class="text-xs text-gray-400 mb-1">Incoming</div>
                <div class="text-xl font-bold text-green-400">${incoming}</div>
            </div>
            <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div class="text-xs text-gray-400 mb-1">Outgoing</div>
                <div class="text-xl font-bold text-blue-400">${outgoing}</div>
            </div>
        </div>
        <div class="mt-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div class="text-xs text-gray-400 mb-2">Total Traffic</div>
            <div class="text-2xl font-bold text-purple-400">${total}</div>
            <div class="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style="width: ${networkState.history.length > 0 ? Math.min(100, networkState.history[networkState.history.length - 1] * 100) : 0}%"
                ></div>
            </div>
        </div>
    `;
}

/**
 * Setup interactions
 */
function setupInteractions() {
    const container = document.getElementById('network-container');

    if (container) {
        // Pan on drag
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            container.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        // Zoom with scroll
        let scale = 1;
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.max(0.5, Math.min(2, scale + delta));
            container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        });
    }
}

/**
 * Toggle simulation
 */
export function toggleSimulation() {
    networkState.simulationActive = !networkState.simulationActive;
    return networkState.simulationActive;
}

/**
 * Get network statistics
 * @returns {Object} Network statistics
 */
export function getNetworkStats() {
    return {
        activeConnections: networkState.activeConnections,
        connectionSpeed: networkState.connectionSpeed,
        incomingBytes: networkState.incomingBytes,
        outgoingBytes: networkState.outgoingBytes,
        totalBytes: networkState.totalBytes,
        history: [...networkState.history]
    };
}

/**
 * Reset network statistics
 */
export function resetNetworkStats() {
    networkState.totalBytes = 0;
    networkState.incomingBytes = 0;
    networkState.outgoingBytes = 0;
    networkState.history = [];
}

/**
 * Get network traffic history
 * @returns {Array} Traffic history array
 */
export function getNetworkHistory() {
    return [...networkState.history];
}

/**
 * Get network topology
 * @returns {Object} Network topology
 */
export function getNetworkTopology() {
    return {
        nodes: networkState.nodes,
        edges: networkState.edges
    };
}

// Initialize network visualization when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNetworkViz);
} else {
    initNetworkViz();
}
