// 3D Background Scene
class ThreeJSBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.init();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;

        // Renderer setup
        const canvas = document.getElementById('bg-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create particle system
        this.createParticles();
        this.createGeometry();

        // Event listeners
        document.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        // Adjust particle count based on device performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 500 : 1000;

        for (let i = 0; i < particleCount; i++) {
            vertices.push(
                Math.random() * 2000 - 1000, // x
                Math.random() * 2000 - 1000, // y
                Math.random() * 2000 - 1000  // z
            );

            // Create gradient colors from cyan to magenta
            const color = new THREE.Color();
            color.setHSL(0.5 + Math.random() * 0.3, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometry() {
        // Add some floating geometric shapes (reduce on mobile)
        const geometries = [
            new THREE.TetrahedronGeometry(50, 0),
            new THREE.OctahedronGeometry(40, 0),
            new THREE.IcosahedronGeometry(45, 0)
        ];

        const isMobile = window.innerWidth < 768;
        const shapeCount = isMobile ? 3 : 5;
        for (let i = 0; i < shapeCount; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                Math.random() * 1000 - 500,
                Math.random() * 1000 - 500,
                Math.random() * 1000 - 500
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.scene.add(mesh);
        }
    }

    onMouseMove(event) {
        this.mouseX = event.clientX - this.windowHalfX;
        this.mouseY = event.clientY - this.windowHalfY;
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.001;

        // Mouse interaction
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        // Animate geometric shapes
        this.scene.children.forEach((child, index) => {
            if (child instanceof THREE.Mesh) {
                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
                child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.5;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
         // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }

                    // Animate counters in about section
                    if (entry.target.classList.contains('about')) {
                        this.animateCounters();
                    }
                }
            });
        }, this.observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            section {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .project-card, .cert-card, .timeline-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            .animate-in .project-card,
            .animate-in .cert-card,
            .animate-in .timeline-item {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-in .project-card:nth-child(1) { transition-delay: 0.1s; }
            .animate-in .project-card:nth-child(2) { transition-delay: 0.2s; }
            .animate-in .project-card:nth-child(3) { transition-delay: 0.3s; }
            .animate-in .project-card:nth-child(4) { transition-delay: 0.4s; }
            
            .animate-in .cert-card:nth-child(1) { transition-delay: 0.1s; }
            .animate-in .cert-card:nth-child(2) { transition-delay: 0.2s; }
            .animate-in .cert-card:nth-child(3) { transition-delay: 0.3s; }
            
            .animate-in .timeline-item:nth-child(1) { transition-delay: 0.1s; }
            .animate-in .timeline-item:nth-child(2) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    // Add % for satisfaction, + for others except internships
                    let suffix = '';
                    if (target === 97) {
                        suffix = '%';
                    } else if (target > 2) {
                        suffix = '+';
                    }
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    // Add % for satisfaction, + for others except internships
                    let suffix = '';
                    if (target === 97) {
                        suffix = '%';
                    } else if (target > 2) {
                        suffix = '+';
                    }
                    counter.textContent = target + suffix;
                }
            };

            setTimeout(updateCounter, 500);
        });
    }
}

// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        // Let the form submit naturally to Formspree, but show a loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Show sending message
        this.showMessage('Sending your message...', 'info');
        
        // Re-enable button after a delay (in case of errors)
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 5000);
    }

    showMessage(text, type) {
        // Remove any existing messages
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 10px;
            background: ${type === 'success' ? 'rgba(0, 245, 255, 0.2)' : 
                        type === 'error' ? 'rgba(255, 0, 128, 0.2)' : 
                        'rgba(255, 165, 0, 0.2)'};
            color: ${type === 'success' ? '#00f5ff' : 
                    type === 'error' ? '#ff0080' : 
                    '#ffa500'};
            border: 1px solid ${type === 'success' ? 'rgba(0, 245, 255, 0.3)' : 
                               type === 'error' ? 'rgba(255, 0, 128, 0.3)' : 
                               'rgba(255, 165, 0, 0.3)'};
        `;

        this.form.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Particle cursor effect
class ParticleCursor {
    constructor() {
        this.particles = [];
        this.cursor = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
            this.createParticle();
        });

        this.animate();
    }

    createParticle() {
        const particle = {
            x: this.cursor.x,
            y: this.cursor.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            decay: 0.02
        };

        this.particles.push(particle);

        // Limit particles
        if (this.particles.length > 50) {
            this.particles.shift();
        }
    }

    animate() {
        // Create canvas for particles if it doesn't exist
        let canvas = document.getElementById('cursor-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'cursor-canvas';
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
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = '#00f5ff';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2 * particle.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Typing animation for hero section
class TypingAnimation {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        if (this.element) {
            this.start();
        }
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Project filter functionality
class ProjectFilter {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        // Add filter buttons
        this.createFilterButtons();
    }

    createFilterButtons() {
        const projectsSection = document.querySelector('.projects .container');
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        `;

        const technologies = new Set();
        this.projects.forEach(project => {
            const tech = project.getAttribute('data-tech');
            if (tech) {
                tech.split(',').forEach(t => technologies.add(t.trim()));
            }
        });

        // Add 'All' button
        const allButton = this.createFilterButton('All', true);
        filterContainer.appendChild(allButton);

        // Add technology buttons
        technologies.forEach(tech => {
            const button = this.createFilterButton(tech);
            filterContainer.appendChild(button);
        });

        projectsSection.insertBefore(filterContainer, document.querySelector('.projects-grid'));
    }

    createFilterButton(text, active = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `filter-btn ${active ? 'active' : ''}`;
        button.style.cssText = `
            padding: 0.5rem 1rem;
            background: ${active ? 'linear-gradient(135deg, #00f5ff, #ff0080)' : 'rgba(255, 255, 255, 0.1)'};
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        `;

        button.addEventListener('click', () => this.filterProjects(text, button));
        
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                button.style.background = 'rgba(0, 245, 255, 0.2)';
                button.style.borderColor = 'rgba(0, 245, 255, 0.3)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.background = 'rgba(255, 255, 255, 0.1)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });

        return button;
    }

    filterProjects(filterTech, activeButton) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        activeButton.classList.add('active');
        activeButton.style.background = 'linear-gradient(135deg, #00f5ff, #ff0080)';

        // Filter projects
        this.projects.forEach(project => {
            const projectTech = project.getAttribute('data-tech');
            
            if (filterTech === 'All' || (projectTech && projectTech.includes(filterTech))) {
                project.style.display = 'block';
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 100);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    new ThreeJSBackground();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize particle cursor effect
    new ParticleCursor();
    
    // Initialize typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        new TypingAnimation(heroSubtitle, [
            'Cybersecurity Specialist & Ethical Hacker',
            'Penetration Testing Expert',
            'Digital Forensics Analyst',
            'Quantum Security Researcher'
        ]);
    }
    
    // Initialize project filter
    new ProjectFilter();
    
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const loader = document.createElement('div');
    loader.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 245, 255, 0.3);
        border-top: 3px solid #00f5ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    // Add spin animation
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    loadingScreen.appendChild(loader);
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after a delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
});

// Add some easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.keyCode === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            // Easter egg: Matrix rain effect
            createMatrixRain();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f5ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const interval = setInterval(draw, 35);
    
    // Remove after 10 seconds
    setTimeout(() => {
        clearInterval(interval);
        canvas.remove();
    }, 10000);
}
