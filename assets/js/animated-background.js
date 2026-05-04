/**
 * AnimatedBackground
 * A lightweight, smooth interactive background module.
 * Creates glowing blobs that move slightly based on mouse position.
 */
class AnimatedBackground {
    constructor(options = {}) {
        this.options = Object.assign({
            // Colors of the glowing blobs
            colors: ['rgba(59, 130, 246, 0.5)', 'rgba(249, 115, 22, 0.4)', 'rgba(168, 85, 247, 0.4)'],
            // Opacity of each blob
            blobOpacity: 0.8,
            // Base speed for automatic rotation
            baseSpeed: 0.01,
            // How much mouse movement affects blobs (higher = more reactive)
            mouseReactivity: 0.05,
            // z-index to stay behind content
            zIndex: -1
        }, options);

        this.blobs = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // Use media query and touch events to detect touch devices
        this.isTouchDevice = ('ontouchstart' in window) || 
                             (navigator.maxTouchPoints > 0) || 
                             window.matchMedia("(pointer: coarse)").matches;
        
        this.animationFrameId = null;

        this.init();
    }

    init() {
        // Create container for the blobs
        this.container = document.createElement('div');
        this.container.id = 'animated-bg-container';
        
        // Applying styles via JS to keep it modular and avoid requiring external CSS
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: this.options.zIndex,
            pointerEvents: 'none', // Critical: allows clicking through
            overflow: 'hidden',
            mixBlendMode: 'screen', // Creates a nice lighting effect over backgrounds
        });

        document.body.prepend(this.container);

        this.updateDimensions();

        // Create blobs
        this.options.colors.forEach((color, index) => {
            const blob = document.createElement('div');
            // Randomize size slightly for organic feel
            const size = this.blobSize * (0.8 + Math.random() * 0.4);
            
            Object.assign(blob.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                // Add huge blur for glowing effect
                filter: `blur(${size / 3}px)`,
                opacity: this.options.blobOpacity,
                // Center the transform origin
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
            });

            this.blobs.push({
                el: blob,
                x: this.width / 2,
                y: this.height / 2,
                angle: Math.random() * Math.PI * 2, // random starting angle
                speed: 0.5 + Math.random() * 0.5,   // varied rotation speed
                radius: this.width * 0.15 + Math.random() * this.width * 0.1, // orbital radius
                index: index,
                size: size
            });

            this.container.appendChild(blob);
        });

        this.bindEvents();
        this.animate();
    }

    updateDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // Scale blobs based on screen size, max 800px to avoid extreme rendering costs
        this.blobSize = Math.min(Math.max(this.width, this.height) * 0.5, 800);
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
    }

    bindEvents() {
        this.onMouseMove = (e) => {
            if (!this.isTouchDevice) {
                // Normalize mouse coordinates to -1 to +1 relative to center
                this.targetMouseX = (e.clientX / this.width) * 2 - 1;
                this.targetMouseY = (e.clientY / this.height) * 2 - 1;
            }
        };

        this.onResize = () => {
            this.updateDimensions();
            // Re-adjust blob sizes and radii on resize
            this.blobs.forEach(blob => {
                const newSize = this.blobSize * (0.8 + Math.random() * 0.4);
                blob.size = newSize;
                Object.assign(blob.el.style, {
                    width: `${newSize}px`,
                    height: `${newSize}px`,
                    filter: `blur(${newSize / 3}px)`,
                });
                blob.radius = this.width * 0.15 + Math.random() * this.width * 0.1;
            });
        };

        window.addEventListener('mousemove', this.onMouseMove, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });
    }

    animate() {
        // Smoothly interpolate current mouse to target mouse position (Easing)
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        this.blobs.forEach((blob) => {
            // Calculate automatic orbital movement
            blob.angle += this.options.baseSpeed * blob.speed;
            
            // Base circular movement around the center
            const autoX = Math.cos(blob.angle) * blob.radius;
            const autoY = Math.sin(blob.angle) * blob.radius * 0.8; // slightly elliptical

            // Base position is center of screen
            let targetX = this.width / 2 + autoX;
            let targetY = this.height / 2 + autoY;

            // Apply parallax effect based on mouse movement
            if (!this.isTouchDevice) {
                // Different depth/reactivity for each blob based on its index
                const depth = (blob.index + 1) * this.options.mouseReactivity;
                targetX += this.mouseX * this.width * depth * -1; // move opposite to mouse
                targetY += this.mouseY * this.height * depth * -1;
            }

            // Smooth follow towards the calculated target
            blob.x += (targetX - blob.x) * 0.05;
            blob.y += (targetY - blob.y) * 0.05;

            // Apply hardware-accelerated transform
            blob.el.style.transform = `translate(calc(-50% + ${blob.x}px), calc(-50% + ${blob.y}px))`;
        });

        // Request next frame
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        // Cleanup event listeners and DOM
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
