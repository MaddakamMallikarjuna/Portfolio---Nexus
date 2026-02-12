// ============================================
// Salesforce Developer Portfolio JavaScript
// Professional Edition - 2026
// ============================================

// Configuration
const CONFIG = {
  githubUsername: 'MaddakamMallikarjuna',
  trailheadProfile: 'https://www.salesforce.com/trailblazer/maddakam-mallikarjuna',
  typingRoles: [
    'Salesforce Developer',
    'Lightning Web Components Expert',
    'Apex Programming Specialist',
    'Salesforce Cloud Architect',
    'Full Stack Developer',
    '2★ Ranger on Trailhead',
    'Agentblazer Champion'
  ],
  googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLScMp-3dV8ogTGkZd3MyPvBIrdjiRcP9nkIhfZU5gudhX3MlZQ/formResponse',
  formFields: {
    name: 'entry.1100096532',
    email: 'entry.1723152443',
    message: 'entry.758623599'
  }
};

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ============================================
// Animated Background - Particle Canvas
// ============================================

class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.connectionDistance = 150;
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', debounce(() => this.resize(), 200));

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 161, 224, 0.6)';
      this.ctx.fill();
    });
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = 1 - (distance / this.connectionDistance);
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 161, 224, ${opacity * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.1;
          particle.vy -= Math.sin(angle) * force * 0.1;
        }
      }

      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawParticles();
    this.connectParticles();
    this.updateParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// Navigation - Scroll & Active State
// ============================================

class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.navLinksContainer = document.querySelector('.nav-links');
    this.sections = document.querySelectorAll('section[id]');

    this.init();
  }

  init() {
    // Scroll event for navbar background
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

    // Active section highlighting
    window.addEventListener('scroll', throttle(() => this.highlightActiveSection(), 100));

    // Smooth scroll to section
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.smoothScroll(e));
    });

    // Mobile menu toggle
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.navLinksContainer.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  highlightActiveSection() {
    let current = '';

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  toggleMobileMenu() {
    this.navLinksContainer.classList.toggle('active');
    this.mobileMenuBtn.classList.toggle('active');
  }

  closeMobileMenu() {
    this.navLinksContainer.classList.remove('active');
    this.mobileMenuBtn.classList.remove('active');
  }
}

// ============================================
// Typing Animation for Hero Subtitle
// ============================================

class TypingAnimation {
  constructor(element, roles, typingSpeed = 100, deletingSpeed = 50, delay = 2000) {
    this.element = element;
    this.roles = roles;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.delay = delay;
    this.roleIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const currentRole = this.roles[this.roleIndex];

    if (this.isDeleting) {
      this.element.textContent = currentRole.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentRole.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentRole.length) {
      typeSpeed = this.delay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optional: unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    // Observe individual elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
      observer.observe(element);
    });
  }
}

// ============================================
// GitHub Projects Loader
// ============================================

class GitHubProjects {
  constructor(username, containerSelector) {
    this.username = username;
    this.container = document.querySelector(containerSelector);
    this.apiUrl = `https://api.github.com/users/${username}/repos`;

    if (this.container) {
      this.init();
    }
  }

  async init() {
    try {
      await this.fetchAndDisplayProjects();
    } catch (error) {
      this.showError(error);
    }
  }

  async fetchAndDisplayProjects() {
    const response = await fetch(this.apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repositories');
    }

    const repos = await response.json();
    const nexusRepos = repos.filter(repo => repo.name.endsWith('---Nexus'));

    if (nexusRepos.length === 0) {
      this.container.innerHTML = '<p class="no-projects">No Salesforce projects found on GitHub.</p>';
      return;
    }

    this.container.innerHTML = '';

    for (const repo of nexusRepos) {
      await this.createProjectCard(repo);
    }
  }

  async createProjectCard(repo) {
    const projectName = repo.name.replace('---Nexus', '').replace(/-/g, ' ');
    const repoUrl = repo.html_url;
    const description = repo.description || 'No description provided';

    // Try to fetch README for more details
    let additionalInfo = '';
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/readme`);
      if (readmeResponse.ok) {
        additionalInfo = ' • Has documentation';
      }
    } catch (e) {
      // Silently fail
    }

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </div>
      <div class="project-content">
        <h3>${projectName}</h3>
        <p>${description}${additionalInfo}</p>
        <div class="project-tech">
          <span>GitHub</span>
          ${repo.language ? `<span>${repo.language}</span>` : ''}
          ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ''}
        </div>
        <a href="${repoUrl}" target="_blank" class="btn btn-secondary" style="margin-top: 1rem; display: inline-flex; text-decoration: none;">
          <span>View Repository</span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style="margin-left: 0.5rem;">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    `;

    this.container.appendChild(card);
  }

  showError(error) {
    this.container.innerHTML = `
      <div class="project-error" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <p>⚠️ Unable to load GitHub projects</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
      </div>
    `;
  }
}

// ============================================
// Contact Form Handler
// ============================================

class ContactForm {
  constructor(formSelector, responseSelector) {
    this.form = document.querySelector(formSelector);
    this.response = document.querySelector(responseSelector);

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = this.form.querySelector('.btn-submit');
    const formData = new FormData();

    // Get form values
    const name = this.form.querySelector('#name').value;
    const email = this.form.querySelector('#email').value;
    const message = this.form.querySelector('#message').value;

    // Map to Google Form fields
    formData.append(CONFIG.formFields.name, name);
    formData.append(CONFIG.formFields.email, email);
    formData.append(CONFIG.formFields.message, message);

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      await fetch(CONFIG.googleFormURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      this.showResponse('success', `✅ Message sent successfully! I'll get back to you soon.`);
      this.form.reset();
    } catch (error) {
      this.showResponse('error', '❌ Failed to send message. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  showResponse(type, message) {
    this.response.textContent = message;
    this.response.className = `form-response ${type} show`;

    setTimeout(() => {
      this.response.classList.remove('show');
    }, 5000);
  }
}

// ============================================
// Back to Top Button
// ============================================

class BackToTop {
  constructor(buttonSelector) {
    this.button = document.querySelector(buttonSelector);

    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', throttle(() => this.toggleVisibility(), 100));
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  toggleVisibility() {
    if (window.scrollY > 500) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ============================================
// Skill Progress Animation
// ============================================

class SkillProgressAnimation {
  constructor() {
    this.skillCards = document.querySelectorAll('.skill-card');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector('.skill-progress');
          if (progressBar && !progressBar.classList.contains('animated')) {
            progressBar.classList.add('animated');
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });

    this.skillCards.forEach(card => observer.observe(card));
  }
}

// ============================================
// Initialize Everything on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Salesforce Developer Portfolio Initialized');

  // Initialize particle background
  new ParticleBackground();

  // Initialize navigation
  new Navigation();

  // Initialize typing animation for hero subtitle
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    new TypingAnimation(typingElement, CONFIG.typingRoles);
  }

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize GitHub projects
  new GitHubProjects(CONFIG.githubUsername, '#githubProjects');

  // Initialize contact form
  new ContactForm('#contactForm', '#formResponse');

  // Initialize back to top button
  new BackToTop('#backToTop');

  // Initialize skill progress animations
  new SkillProgressAnimation();

  // Add stagger animation to cards
  const cards = document.querySelectorAll('.info-card, .skill-card, .project-card, .cert-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  console.log('✅ All components loaded successfully');
});

// ============================================
// Performance Optimization
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Preload critical resources
window.addEventListener('load', () => {
  // Mark as fully loaded
  document.body.classList.add('loaded');

  // Log performance metrics
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
  }
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('👋 Page hidden - pausing animations');
  } else {
    console.log('👀 Page visible - resuming animations');
  }
});

// Export for debugging (optional)
if (typeof window !== 'undefined') {
  window.PortfolioDebug = {
    config: CONFIG,
    version: '2.0.0',
    author: 'Maddakam Mallikarjuna'
  };
}
