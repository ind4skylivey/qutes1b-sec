/**
 * Effects Module for Dashboard
 * Particle effects integration and management
 */

import { utils } from './utils.js';

/**
 * Effects state
 */
const effectsState = {
    particlesEnabled: true,
    matrixEnabled: true,
    cursorTrailEnabled: true,
    particleSpeed: 2,
    particleColor: 'rgba(34, 211, 238, 0.8)',
    matrixChars: 'S1BGr0upQUTEBROWSER0123456789ABCDEF',
    cursorTrail: [],
    maxTrailLength: 50
};

/**
 * Particle class
 */
class Particle {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = (Math.random() - 0.5) * effectsState.particleSpeed * 2;
        this.vy = (Math.random() - 0.5) * effectsState.particleSpeed * 2;
        this.size = Math.random() * 3 + 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = effectsState.particleColor;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        // Bounce off edges
        if (this.x < 0 || this.x > window.innerWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(window.innerHeight, this.y));
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('0.8', (this.life * 0.8).toFixed(2));
        ctx.fill();
    }
}

/**
 * Matrix character class
 */
class MatrixChar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.char = effectsState.matrixChars[Math.floor(Math.random() * effectsState.matrixChars.length)];
        this.speed = Math.random() * 2 + 1;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
    }

    update() {
        this.y += this.speed;
        this.opacity -= this.fadeSpeed;

        if (this.y > window.innerHeight) {
            this.y = -20;
            this.x = Math.random() * window.innerWidth;
            this.opacity = 1;
        }
    }

    draw(ctx) {
        ctx.font = '14px monospace';
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
        ctx.fillText(this.char, this.x, this.y);
    }
}

/**
 * Particle system
 */
const particleSystem = {
    particles: [],
    canvas: null,
    ctx: null,
    animationId: null
};

/**
 * Matrix rain system
 */
const matrixSystem = {
    chars: [],
    canvas: null,
    ctx: null,
    animationId: null,
    columnWidth: 20
};

/**
 * Initialize effects
 */
export function initEffects() {
    // Initialize particle system
    initParticleSystem();

    // Initialize matrix rain
    initMatrixRain();

    // Initialize cursor trail
    initCursorTrail();

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Update effects state
    updateEffectsState();
}

/**
 * Initialize particle system
 */
function initParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    particleSystem.canvas = canvas;
    particleSystem.ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas(canvas);

    // Create initial particles
    for (let i = 0; i < 100; i++) {
        particleSystem.particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    // Start animation
    animateParticles();
}

/**
 * Initialize matrix rain
 */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain-canvas');
    if (!canvas) return;

    matrixSystem.canvas = canvas;
    matrixSystem.ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas(canvas);

    // Create initial characters
    const columns = Math.ceil(canvas.width / matrixSystem.columnWidth);
    for (let i = 0; i < columns; i++) {
        matrixSystem.chars.push(new MatrixChar(i * matrixSystem.columnWidth, Math.random() * canvas.height));
    }

    // Start animation
    animateMatrixRain();
}

/**
 * Initialize cursor trail
 */
function initCursorTrail() {
    document.addEventListener('mousemove', handleMouseMove);

    // Remove trail on mouse leave
    document.addEventListener('mouseleave', () => {
        effectsState.cursorTrail = [];
    });
}

/**
 * Handle mouse movement
 */
function handleMouseMove(e) {
    if (!effectsState.cursorTrailEnabled) return;

    effectsState.cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1.0,
        size: Math.random() * 5 + 3
    });

    // Limit trail length
    if (effectsState.cursorTrail.length > effectsState.maxTrailLength) {
        effectsState.cursorTrail.shift();
    }
}

/**
 * Resize canvas
 */
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Handle window resize
 */
function handleResize() {
    if (particleSystem.canvas) {
        resizeCanvas(particleSystem.canvas);
    }
    if (matrixSystem.canvas) {
        resizeCanvas(matrixSystem.canvas);
    }
}

/**
 * Update effects state from CSS variables
 */
function updateEffectsState() {
    const particleSpeed = getComputedStyle(document.documentElement).getPropertyValue('--particle-speed') || '2';
    const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color') || 'rgba(34, 211, 238, 0.8)';

    effectsState.particleSpeed = parseFloat(particleSpeed);
    effectsState.particleColor = particleColor.trim();
}

/**
 * Animate particles
 */
function animateParticles() {
    if (!effectsState.particlesEnabled || !particleSystem.ctx) return;

    const ctx = particleSystem.ctx;
    ctx.clearRect(0, 0, particleSystem.canvas.width, particleSystem.canvas.height);

    // Update and draw particles
    particleSystem.particles = particleSystem.particles.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return particle.life > 0;
    });

    // Add new particles
    while (particleSystem.particles.length < 100) {
        particleSystem.particles.push(new Particle(
            Math.random() * particleSystem.canvas.width,
            Math.random() * particleSystem.canvas.height
        ));
    }

    particleSystem.animationId = requestAnimationFrame(animateParticles);
}

/**
 * Animate matrix rain
 */
function animateMatrixRain() {
    if (!effectsState.matrixEnabled || !matrixSystem.ctx) return;

    const ctx = matrixSystem.ctx;

    // Fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, matrixSystem.canvas.width, matrixSystem.canvas.height);

    // Update and draw characters
    matrixSystem.chars.forEach(char => {
        char.update();
        char.draw(ctx);
    });

    matrixSystem.animationId = requestAnimationFrame(animateMatrixRain);
}

/**
 * Draw cursor trail
 */
function drawCursorTrail() {
    if (!effectsState.cursorTrailEnabled || effectsState.cursorTrail.length === 0) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    effectsState.cursorTrail.forEach((point, index) => {
        point.life -= 0.02;
        point.size *= 0.98;

        if (point.life > 0) {
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size);
            gradient.addColorStop(0, `rgba(34, 211, 238, ${point.life * 0.8})`);
            gradient.addColorStop(1, `rgba(34, 211, 238, 0)`);

            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    });

    // Remove dead trail points
    effectsState.cursorTrail = effectsState.cursorTrail.filter(p => p.life > 0);

    requestAnimationFrame(drawCursorTrail);
}

/**
 * Toggle particles
 */
export function toggleParticles(enabled) {
    effectsState.particlesEnabled = enabled;
    if (!enabled && particleSystem.ctx) {
        particleSystem.ctx.clearRect(0, 0, particleSystem.canvas.width, particleSystem.canvas.height);
    }
}

/**
 * Toggle matrix rain
 */
export function toggleMatrix(enabled) {
    effectsState.matrixEnabled = enabled;
    if (!enabled && matrixSystem.ctx) {
        matrixSystem.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        matrixSystem.ctx.fillRect(0, 0, matrixSystem.canvas.width, matrixSystem.canvas.height);
    }
}

/**
 * Toggle cursor trail
 */
export function toggleCursorTrail(enabled) {
    effectsState.cursorTrailEnabled = enabled;
    if (!enabled) {
        effectsState.cursorTrail = [];
        const trailCanvas = document.getElementById('cursor-trail-canvas');
        if (trailCanvas) {
            trailCanvas.remove();
        }
    }
}

/**
 * Get particle count
 */
export function getParticleCount() {
    return particleSystem.particles.length;
}

/**
 * Get matrix char count
 */
export function getMatrixCharCount() {
    return matrixSystem.chars.length;
}

/**
 * Get cursor trail length
 */
export function getCursorTrailLength() {
    return effectsState.cursorTrail.length;
}

/**
 * Clear all effects
 */
export function clearEffects() {
    if (particleSystem.ctx) {
        particleSystem.ctx.clearRect(0, 0, particleSystem.canvas.width, particleSystem.canvas.height);
    }
    if (matrixSystem.ctx) {
        matrixSystem.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        matrixSystem.ctx.fillRect(0, 0, matrixSystem.canvas.width, matrixSystem.canvas.height);
    }
    effectsState.cursorTrail = [];
}

// Initialize effects when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
} else {
    initEffects();
}
