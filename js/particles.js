/**
 * Mythic Quest - Constellation Background System
 * Renders a starry sky with glowing, interactive constellations on a canvas.
 */

class ConstellationSky {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 60;
        this.connectionDistance = 120;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.particles = [];
        
        // Adjust particle count based on screen size
        const density = (this.canvas.width * this.canvas.height) / 15000;
        const count = Math.min(Math.floor(density), this.maxParticles);
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.5 + 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulseDirection: Math.random() > 0.5 ? 1 : -1
        };
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first (constellation lines)
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            // Connect to other particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const alpha = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`; // Gold lines
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Connect to mouse
            if (this.mouse.x !== null) {
                const dx = p1.x - this.mouse.x;
                const dy = p1.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const alpha = (1 - dist / this.mouse.radius) * 0.25;
                    this.ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`; // Purple connection to hero's cursor
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw star nodes
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Pulse effect
            p.alpha += p.pulseSpeed * p.pulseDirection;
            if (p.alpha > 0.8 || p.alpha < 0.2) {
                p.pulseDirection *= -1;
            }

            // Draw glowing star
            this.ctx.shadowBlur = p.size * 3;
            this.ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reset shadow
            this.ctx.shadowBlur = 0;

            // Move particle
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    // Trigger visual blast of particles on level up or quest complete
    triggerBurst(x, y, color = '#d4af37') {
        const burstCount = 15;
        for (let i = 0; i < burstCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 3 + 1;
            const size = Math.random() * 3 + 1;
            
            const tempParticle = {
                x: x,
                y: y,
                size: size,
                speedX: Math.cos(angle) * velocity,
                speedY: Math.sin(angle) * velocity,
                alpha: 1,
                pulseSpeed: 0.05,
                pulseDirection: -1
            };
            
            // Override create/update process locally or temporarily inject into particles
            this.particles.push(tempParticle);
            
            // Remove after fading
            setTimeout(() => {
                const idx = this.particles.indexOf(tempParticle);
                if (idx > -1) {
                    this.particles.splice(idx, 1);
                }
            }, 1000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.constellationSky = new ConstellationSky('particles-canvas');
});
