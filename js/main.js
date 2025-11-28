// ===== GLOBAL VARIABLES =====
let lenis;
let isLoading = true;
let currentSection = 'home';
let player;
let isVideoPlaying = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize icons
  lucide.createIcons();
  
  // Start loading sequence
  initLoading();
  
  // Initialize smooth scrolling after loading
  setTimeout(() => {
    initSmoothScroll();
    initNavigation();
    initInteractions();
    initYouTubePlayer();
  }, 100);
});

// ===== YOUTUBE PLAYER =====
function initYouTubePlayer() {
  // YouTube video will be loaded by the API
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('hero-video', {
    videoId: 'Urb3BswP7VI',
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'loop': 1,
      'modestbranding': 1,
      'playlist': 'Urb3BswP7VI',
      'rel': 0,
      'showinfo': 0,
      'mute': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  isVideoPlaying = true;
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    player.playVideo(); // Loop the video
  }
}

function playTrailer() {
  if (player) {
    player.seekTo(0);
    player.playVideo();
    
    // Show notification
    showNotification('Trailer wordt afgespeeld', 'info');
  } else {
    window.open('https://www.youtube.com/watch?v=Urb3BswP7VI', '_blank');
  }
}

function connectToServer() {
  // Copy connection info to clipboard
  navigator.clipboard.writeText('connect 217.154.169.87:40120').then(() => {
    showNotification('Server IP gekopieerd naar klembord!', 'success');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showNotification('Kon server IP niet kopiëren', 'error');
  });
}

// ===== LOADING ANIMATION =====
function initLoading() {
  const loadingScreen = document.getElementById('loading');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  const logoLines = document.querySelectorAll('.line');
  
  // Enhanced logo lines animation with opacity fade-in
  anime({
    targets: logoLines,
    opacity: [0, 1],
    delay: anime.stagger(150),
    duration: 400,
    easing: 'easeOutCubic'
  });
  
  // Fast and smooth loading progress
  let progress = 0;
  
  function updateProgress() {
    progress += Math.random() * 8 + 4; // Faster increment
    if (progress >= 100) {
      progress = 100;
      setTimeout(() => completeLoading(), 200);
      return;
    }
    
    // Smooth number counting
    progressText.textContent = `${Math.round(progress)}%`;
    
    // Update progress bar with smooth animation
    anime({
      targets: progressFill,
      width: `${progress}%`,
      duration: 150,
      easing: 'easeOutQuad'
    });
    
    // Continue updating
    setTimeout(updateProgress, 60); // Much faster interval
  }
  
  // Start progress after a short delay
  setTimeout(updateProgress, 300);
}

function completeLoading() {
  const loadingScreen = document.getElementById('loading');
  const nav = document.getElementById('nav');
  
  // Hide loading screen
  anime({
    targets: loadingScreen,
    opacity: 0,
    duration: 400,
    easing: 'easeOutQuad',
    complete: () => {
      loadingScreen.style.display = 'none';
      isLoading = false;
      startMainAnimations();
    }
  });
  
  // Show navigation
  anime({
    targets: nav,
    opacity: 1,
    translateY: ['-100%', '0%'],
    duration: 600,
    delay: 150,
    easing: 'easeOutCubic'
  });
}

function startMainAnimations() {
  // Animate hero content
  anime({
    targets: '.hero-content',
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    delay: 200,
    easing: 'easeOutCubic'
  });
  
  // Animate hero visual
  anime({
    targets: '.hero-visual',
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    delay: 400,
    easing: 'easeOutCubic'
  });
  
  // Animate grid items
  anime({
    targets: '.grid-item',
    opacity: [0, 1],
    scale: [0.8, 1],
    delay: anime.stagger(80, {start: 600}),
    duration: 500,
    easing: 'easeOutBack'
  });
  
  // Initialize scroll-triggered animations
  initScrollAnimations();
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// ===== NAVIGATION =====
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        lenis.scrollTo(targetSection, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        
        updateActiveNav(targetId);
      }
    });
  });
  
  // Update active navigation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        updateActiveNav(entry.target.id);
      }
    });
  }, {
    threshold: [0.5],
    rootMargin: '-20% 0px -20% 0px'
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

function updateActiveNav(sectionId) {
  if (currentSection === sectionId) return;
  
  currentSection = sectionId;
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -10% 0px'
  });
  
  sectionHeaders.forEach(header => {
    sectionObserver.observe(header);
  });
  
  // Feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll('.feature-card');
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(100),
          duration: 600,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (featureCards.length > 0) {
    featureObserver.observe(featureCards[0].parentElement);
  }
  
  // Application cards
  const applicationCards = document.querySelectorAll('.application-card');
  const applicationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll('.application-card');
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(100),
          duration: 600,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (applicationCards.length > 0) {
    applicationObserver.observe(applicationCards[0].parentElement);
  }
  
  // Team cards
  const teamCards = document.querySelectorAll('.team-card');
  const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll('.team-card');
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(150),
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (teamCards.length > 0) {
    teamObserver.observe(teamCards[0].parentElement);
  }
  
  // Join section
  const joinContent = document.querySelector('.join-content');
  const joinObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.3
  });
  
  if (joinContent) {
    joinObserver.observe(joinContent);
  }
  
  // Rules cards
  const ruleCards = document.querySelectorAll('.rule-card');
  const rulesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll('.rule-card');
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(100),
          duration: 600,
          easing: 'easeOutCubic'
        });
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (ruleCards.length > 0) {
    rulesObserver.observe(ruleCards[0].parentElement);
  }
}

// ===== INTERACTIONS =====
function initInteractions() {
  // Button hover animations
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      anime({
        targets: this,
        scale: 1.02,
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
    
    btn.addEventListener('mouseleave', function() {
      anime({
        targets: this,
        scale: 1,
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
  });
  
  // Card hover animations
  const cards = document.querySelectorAll('.feature-card, .team-card, .application-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      anime({
        targets: this,
        translateY: -8,
        duration: 300,
        easing: 'easeOutCubic'
      });
    });
    
    card.addEventListener('mouseleave', function() {
      anime({
        targets: this,
        translateY: 0,
        duration: 300,
        easing: 'easeOutCubic'
      });
    });
  });
  
  // Copy button functionality
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const textToCopy = this.dataset.copy;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        anime({
          targets: this,
          scale: [1, 1.1, 1],
          duration: 300,
          easing: 'easeOutBack'
        });
        
        // Change icon temporarily
        const icon = this.querySelector('i');
        const originalIcon = icon.getAttribute('data-lucide');
        icon.setAttribute('data-lucide', 'check');
        lucide.createIcons();
        
        setTimeout(() => {
          icon.setAttribute('data-lucide', originalIcon);
          lucide.createIcons();
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
  
  // Application buttons
  const applicationBtns = document.querySelectorAll('.application-btn');
  applicationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.application-card');
      const department = card.dataset.department;
      const departmentName = card.querySelector('h3').textContent;
      
      openApplicationModal(department, departmentName);
    });
  });
  
  // Modal functionality
  const modal = document.getElementById('application-modal');
  const closeBtn = document.querySelector('.modal-close');
  
  closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });
  
  // Application form submission
  const applicationForm = document.getElementById('application-form');
  applicationForm.addEventListener('submit', handleApplicationSubmit);
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.contains('open');
      
      if (isOpen) {
        navLinks.classList.remove('open');
        anime({
          targets: navLinks,
          opacity: 0,
          translateY: -20,
          duration: 200,
          easing: 'easeOutQuad',
          complete: () => {
            navLinks.style.display = 'none';
          }
        });
      } else {
        navLinks.classList.add('open');
        navLinks.style.display = 'flex';
        anime({
          targets: navLinks,
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
      
      // Animate hamburger
      const spans = this.querySelectorAll('span');
      if (isOpen) {
        anime({
          targets: spans[0],
          rotate: 0,
          translateY: 0,
          duration: 200
        });
        anime({
          targets: spans[1],
          opacity: 1,
          duration: 200
        });
        anime({
          targets: spans[2],
          rotate: 0,
          translateY: 0,
          duration: 200
        });
      } else {
        anime({
          targets: spans[0],
          rotate: 45,
          translateY: 6,
          duration: 200
        });
        anime({
          targets: spans[1],
          opacity: 0,
          duration: 200
        });
        anime({
          targets: spans[2],
          rotate: -45,
          translateY: -6,
          duration: 200
        });
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

// ===== MODERN APPLICATION SYSTEM =====
function openApplicationModal(department, departmentName) {
  const modal = document.getElementById('application-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const departmentInput = document.getElementById('application-department');
  
  modalTitle.textContent = `Sollicitatie: ${departmentName}`;
  modalSubtitle.textContent = `Vul het formulier in om te solliciteren voor ${departmentName}`;
  departmentInput.value = department;
  
  // Reset form
  document.getElementById('application-form').reset();
  
  // Show modal
  modal.style.display = 'block';
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Animate modal in with backdrop
  anime({
    targets: '.modal-backdrop',
    opacity: [0, 1],
    duration: 300,
    easing: 'easeOutQuad'
  });
  
  anime({
    targets: '.modal-content',
    opacity: [0, 1],
    scale: [0.9, 1],
    translateY: [20, 0],
    duration: 400,
    easing: 'easeOutBack',
    delay: 100
  });
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('applicant-name').focus();
  }, 500);
}

function closeModal() {
  const modal = document.getElementById('application-modal');
  
  anime({
    targets: '.modal-content',
    opacity: [1, 0],
    scale: [1, 0.9],
    translateY: [0, 20],
    duration: 300,
    easing: 'easeInQuad'
  });
  
  anime({
    targets: '.modal-backdrop',
    opacity: [1, 0],
    duration: 300,
    easing: 'easeInQuad',
    complete: () => {
      modal.style.display = 'none';
      // Restore body scroll
      document.body.style.overflow = '';
    }
  });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Enhanced form validation
function validateApplication(data) {
  const errors = [];
  
  if (!data.name.trim()) {
    errors.push('Vul uw volledige naam in');
  }
  
  if (!data.age || data.age < 16) {
    errors.push('Je moet minimaal 16 jaar oud zijn om te solliciteren');
  }
  
  if (!data.discord.trim() || !data.discord.includes('#')) {
    errors.push('Vul een geldige Discord gebruikersnaam in (inclusief tag)');
  }
  
  if (!data.experience.trim()) {
    errors.push('Beschrijf uw eerdere roleplay ervaring');
  }
  
  if (!data.motivation.trim()) {
    errors.push('Vul uw motivatie in');
  }
  
  if (!data.availability || data.availability < 1) {
    errors.push('Geef aan hoeveel uur per week u beschikbaar bent');
  }
  
  if (errors.length > 0) {
    showNotification(errors.join('<br>'), 'error');
    return false;
  }
  
  return true;
}

// Enhanced form submission
function handleApplicationSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const applicationData = Object.fromEntries(formData.entries());
  
  // Validate form
  if (!validateApplication(applicationData)) {
    return;
  }
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Verzenden...</span><i data-lucide="loader"></i>';
  submitBtn.disabled = true;
  lucide.createIcons();
  
  // Add loading animation to icon
  const loaderIcon = submitBtn.querySelector('i');
  anime({
    targets: loaderIcon,
    rotate: 360,
    duration: 1000,
    loop: true,
    easing: 'linear'
  });
  
  // Send to Discord webhook
  sendToDiscordWebhook(applicationData)
    .then((response) => {
      if (response.ok) {
        showNotification('✅ Sollicitatie succesvol verzonden! We nemen binnenkort contact met je op.', 'success');
        form.reset();
        closeModal();
        
        // Add success animation
        anime({
          targets: '.modal-content',
          scale: [1, 0.9],
          opacity: [1, 0],
          duration: 300,
          easing: 'easeInQuad'
        });
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('Error sending application:', error);
      showNotification('❌ Er ging iets mis bij het verzenden. Probeer het opnieuw of neem contact op via Discord.', 'error');
    })
    .finally(() => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      lucide.createIcons();
    });
}

function sendToDiscordWebhook(data) {
  // VERVANG DIT MET JE EIGEN DISCORD WEBHOOK URL
  const webhookUrl = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';
  
  const embed = {
    title: `📝 Nieuwe Sollicitatie - ${data.department}`,
    color: 0x5b5bd6,
    thumbnail: {
      url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    fields: [
      {
        name: '👤 Naam',
        value: data.name,
        inline: true
      },
      {
        name: '🎂 Leeftijd',
        value: data.age,
        inline: true
      },
      {
        name: '💬 Discord',
        value: data.discord,
        inline: true
      },
      {
        name: '⏰ Beschikbaarheid',
        value: `${data.availability} uur per week`,
        inline: true
      },
      {
        name: '🏆 Ervaring',
        value: data.experience.substring(0, 1024) // Discord limit
      },
      {
        name: '🎯 Motivatie',
        value: data.motivation.substring(0, 1024) // Discord limit
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Zilverdam Roleplay - Sollicitatie Systeem'
    }
  };
  
  return fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [embed],
      username: 'Zilverdam Sollicitaties',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    })
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i data-lucide="${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  lucide.createIcons();
  
  // Animate in
  anime({
    targets: notification,
    opacity: [0, 1],
    translateX: [100, 0],
    duration: 400,
    easing: 'easeOutCubic'
  });
  
  // Remove after delay
  setTimeout(() => {
    anime({
      targets: notification,
      opacity: [1, 0],
      translateX: [0, 100],
      duration: 300,
      easing: 'easeInCubic',
      complete: () => {
        notification.remove();
      }
    });
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'check-circle';
    case 'error': return 'x-circle';
    case 'warning': return 'alert-triangle';
    default: return 'info';
  }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizeForDevice() {
  // Reduce animations on low-end devices
  const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                        navigator.deviceMemory < 4 ||
                        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isLowEndDevice) {
    // Disable complex animations
    anime.speed = 2; // Make animations faster
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--transition-normal', '150ms');
    document.documentElement.style.setProperty('--transition-slow', '300ms');
  }
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    anime.speed = 10; // Make animations very fast
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Skip to main content
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '6px';
  skipLink.style.background = 'var(--color-black)';
  skipLink.style.color = 'var(--color-white)';
  skipLink.style.padding = '8px';
  skipLink.style.textDecoration = 'none';
  skipLink.style.borderRadius = '4px';
  skipLink.style.zIndex = '10000';
  
  skipLink.addEventListener('focus', function() {
    this.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===== RESIZE HANDLER =====
const handleResize = debounce(() => {
  // Update any size-dependent calculations
  if (lenis) {
    lenis.resize();
  }
}, 250);

window.addEventListener('resize', handleResize);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
  console.error('Template Error:', e.error);
  
  // Fallback for critical failures
  if (isLoading) {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.opacity = '1';
      nav.style.transform = 'translateY(0)';
    }
    
    // Show content without animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }
    
    if (heroVisual) {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateY(0)';
    }
  }
});

// ===== INITIALIZATION SEQUENCE =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize performance optimizations
  optimizeForDevice();
  
  // Initialize accessibility features
  initAccessibility();
});

// ===== EXPORT FOR DEBUGGING =====
if (typeof window !== 'undefined') {
  window.templateDebug = {
    lenis,
    currentSection,
    updateActiveNav,
    anime
  };
}
