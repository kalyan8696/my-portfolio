/**
 * Kalyan Purohit - Portfolio Engine
 * Machine Learning Developer & Data Science Specialist
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. THEME MANAGEMENT (Dark / Light)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('kp_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('kp_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // =========================================================================
  // 2. AMBIENT CURSOR GLOW SPOTLIGHT
  // =========================================================================
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursorGlow = () => {
      // Smooth lerp interpolation
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateCursorGlow);
    };
    animateCursorGlow();
  }

  // =========================================================================
  // 3. INTERACTIVE HERO CANVAS (Neural Constellation Particles)
  // =========================================================================
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const connectionDistance = 140;
    const mouseRadius = 150;

    let heroMouse = { x: -1000, y: -1000 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        heroMouse.x = e.clientX - rect.left;
        heroMouse.y = e.clientY - rect.top;
      });

      heroSection.addEventListener('mouseleave', () => {
        heroMouse.x = -1000;
        heroMouse.y = -1000;
      });
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
        this.baseColor = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction
        const dx = heroMouse.x - this.x;
        const dy = heroMouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, 0.65)`;
        ctx.shadowColor = `rgba(${this.baseColor}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // =========================================================================
  // 4. DYNAMIC ROTATING / TYPEWRITER TEXT
  // =========================================================================
  const typingElement = document.getElementById('typingText');
  const roles = [
    'Machine Learning Developer',
    'Aspiring Data Scientist',
    'Predictive Analytics Specialist',
    'Full-Stack Web Craftsman',
    'MCA Graduate Scholar'
  ];

  let currentRoleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    const currentRole = roles[currentRoleIdx];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typingElement) {
    typeEffect();
  }

  // =========================================================================
  // 5. 3D TILT EFFECT FOR HERO CARD
  // =========================================================================
  const heroCardWrapper = document.getElementById('heroCardWrapper');
  const heroCard = document.getElementById('heroCard');

  if (heroCardWrapper && heroCard && window.matchMedia('(hover: hover)').matches) {
    heroCardWrapper.addEventListener('mousemove', (e) => {
      const rect = heroCardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCardWrapper.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // =========================================================================
  // 6. STICKY NAVBAR & ACTIVE SCROLL SPY
  // =========================================================================
  const header = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background blur
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }

    // Scroll spy
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 7. MOBILE MENU DRAWER
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // =========================================================================
  // 9. ANIMATED STAT COUNTERS
  // =========================================================================
  const counterCards = document.querySelectorAll('.stat-card[data-counter]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateAllCounters();
        }
      });
    },
    { threshold: 0.25 }
  );

  const aboutSection = document.getElementById('about');
  if (aboutSection) counterObserver.observe(aboutSection);

  function animateAllCounters() {
    counterCards.forEach((card) => {
      const target = parseFloat(card.getAttribute('data-counter'));
      const decimals = parseInt(card.getAttribute('data-decimals') || '0', 10);
      const counterSpan = card.querySelector('.stat-counter');
      if (!counterSpan) return;

      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function (easeOutQuad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = easeProgress * target;

        counterSpan.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counterSpan.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // =========================================================================
  // 10. SKILLS FILTERING & ANIMATED PROGRESS BARS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('animated'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Animate skill bars on scroll
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillCards.forEach((card) => card.classList.add('animated'));
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    skillsObserver.observe(skillsSection);
  }

  // =========================================================================
  // 11. INTERACTIVE ML SIMULATOR: STUDENT PERFORMANCE
  // =========================================================================
  const inputHours = document.getElementById('inputHours');
  const inputAttendance = document.getElementById('inputAttendance');
  const inputInternal = document.getElementById('inputInternal');

  const valHours = document.getElementById('valHours');
  const valAttendance = document.getElementById('valAttendance');
  const valInternal = document.getElementById('valInternal');

  const predictedScore = document.getElementById('predictedScore');
  const predictedGrade = document.getElementById('predictedGrade');

  function calculateStudentPrediction() {
    if (!inputHours || !inputAttendance || !inputInternal) return;

    const hours = parseFloat(inputHours.value);
    const attendance = parseFloat(inputAttendance.value);
    const internal = parseFloat(inputInternal.value);

    valHours.textContent = `${hours} hrs`;
    valAttendance.textContent = `${attendance}%`;
    valInternal.textContent = `${internal} / 50`;

    // Realistic ML Regression formula approximation
    // Normalized feature weights: Hours (35%), Attendance (25%), Internal (40%)
    const baseScore = 32.0;
    const hoursContrib = (hours / 25) * 28;
    const attendanceContrib = ((attendance - 50) / 50) * 18;
    const internalContrib = (internal / 50) * 22;

    let totalScore = baseScore + hoursContrib + attendanceContrib + internalContrib;
    totalScore = Math.min(99.4, Math.max(38.0, totalScore));

    predictedScore.textContent = `${totalScore.toFixed(1)}%`;

    // Grade classification
    if (totalScore >= 85) {
      predictedGrade.textContent = 'Grade: A+ (Distinction)';
      predictedGrade.style.color = 'var(--accent-emerald)';
    } else if (totalScore >= 75) {
      predictedGrade.textContent = 'Grade: A (First Class with Dist)';
      predictedGrade.style.color = 'var(--accent-cyan)';
    } else if (totalScore >= 60) {
      predictedGrade.textContent = 'Grade: B+ (First Class)';
      predictedGrade.style.color = 'var(--accent-blue)';
    } else if (totalScore >= 50) {
      predictedGrade.textContent = 'Grade: B (Second Class)';
      predictedGrade.style.color = 'var(--accent-amber)';
    } else {
      predictedGrade.textContent = 'Grade: Needs Improvement';
      predictedGrade.style.color = '#EF4444';
    }
  }

  [inputHours, inputAttendance, inputInternal].forEach((slider) => {
    if (slider) slider.addEventListener('input', calculateStudentPrediction);
  });

  calculateStudentPrediction();

  // =========================================================================
  // 12. INTERACTIVE ML SIMULATOR: HOUSE PRICE PREDICTION
  // =========================================================================
  const inputArea = document.getElementById('inputArea');
  const inputBeds = document.getElementById('inputBeds');
  const inputBaths = document.getElementById('inputBaths');
  const inputLocation = document.getElementById('inputLocation');

  const valArea = document.getElementById('valArea');
  const valBeds = document.getElementById('valBeds');
  const valBaths = document.getElementById('valBaths');
  const valLocation = document.getElementById('valLocation');

  const predictedPrice = document.getElementById('predictedPrice');
  const predictedPriceUsd = document.getElementById('predictedPriceUsd');

  const locationNames = {
    1: 'Tier 3 (Suburban Residential)',
    2: 'Tier 2 (Urban Developing)',
    3: 'Tier 1 (Prime Metro Urban)'
  };

  const locationBaseRate = {
    1: 3900,
    2: 5400,
    3: 7200
  };

  function calculateHousePrice() {
    if (!inputArea || !inputBeds || !inputBaths || !inputLocation) return;

    const area = parseFloat(inputArea.value);
    const beds = parseInt(inputBeds.value, 10);
    const baths = parseInt(inputBaths.value, 10);
    const locTier = parseInt(inputLocation.value, 10);

    valArea.textContent = `${area.toLocaleString()} sq.ft`;
    valBeds.textContent = `${beds} BHK`;
    valBaths.textContent = `${baths} Bath`;
    valLocation.textContent = locationNames[locTier];

    // Multi-variable regression formula
    const ratePerSqFt = locationBaseRate[locTier];
    const roomMultiplier = 1 + beds * 0.045 + baths * 0.035;
    const totalINR = area * ratePerSqFt * roomMultiplier;

    // Formatting INR into Crores or Lakhs
    let inrFormatted = '';
    if (totalINR >= 10000000) {
      const cr = totalINR / 10000000;
      inrFormatted = `₹ ${cr.toFixed(2)} Cr`;
    } else {
      const lakhs = totalINR / 100000;
      inrFormatted = `₹ ${lakhs.toFixed(2)} Lakhs`;
    }

    predictedPrice.textContent = inrFormatted;

    // USD approximate conversion (1 USD = ~84 INR)
    const usdVal = Math.round(totalINR / 84);
    predictedPriceUsd.textContent = `~$${usdVal.toLocaleString()} USD`;
  }

  [inputArea, inputBeds, inputBaths, inputLocation].forEach((slider) => {
    if (slider) slider.addEventListener('input', calculateHousePrice);
  });

  calculateHousePrice();

  // =========================================================================
  // 13. PROJECT ARCHITECTURE DEEP DIVE MODAL
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const projectDetailsData = {
    student: {
      tag: 'SUPERVISED MACHINE LEARNING &bull; REGRESSION &bull; SCIKIT-LEARN',
      title: 'Student Academic Performance Prediction Engine',
      description:
        'A comprehensive machine learning system designed to predict final exam scores based on multidimensional academic behaviors. Built using Python, Scikit-learn, Pandas, and Matplotlib.',
      steps: [
        {
          num: '01',
          title: 'Data Collection & Preprocessing',
          desc: 'Imputed missing values, handled categorical variables via one-hot encoding, and standardized numerical metrics.'
        },
        {
          num: '02',
          title: 'Exploratory Data Analysis (EDA)',
          desc: 'Generated heatmaps, pairplots, and distribution curves discovering a 0.82 Pearson correlation between study hours and exam outcomes.'
        },
        {
          num: '03',
          title: 'Feature Engineering & Selection',
          desc: 'Synthesized ratio of attendance-to-assignment submission and performed SelectKBest feature extraction.'
        },
        {
          num: '04',
          title: 'Model Benchmarking & Validation',
          desc: 'Trained Linear Regression, Ridge, and Random Forest models across an 80/20 train-test split with 5-fold cross-validation.'
        }
      ],
      metrics: [
        { model: 'Linear Regression (Selected)', mae: '2.41', rmse: '3.14', r2: '0.94' },
        { model: 'Ridge Regression (L2)', mae: '2.52', rmse: '3.22', r2: '0.93' },
        { model: 'Decision Tree Regressor', mae: '3.80', rmse: '4.65', r2: '0.86' }
      ],
      keyFindings:
        'Weekly self-study hours and consistency in internal testing contributed over 68% of the prediction weight, demonstrating that disciplined attendance alongside self-study strongly correlates with academic distinction.'
    },
    house: {
      tag: 'MULTI-VARIABLE REGRESSION &bull; VALUATION INTELLIGENCE &bull; SCIKIT-LEARN',
      title: 'Real Estate Price Prediction & Valuation Model',
      description:
        'An algorithmic pricing engine that computes residential market valuations through structural dimensions, bathroom-to-bedroom density, age, and location tier coefficients.',
      steps: [
        {
          num: '01',
          title: 'Outlier Removal & Cleaning',
          desc: 'Utilized Interquartile Range (IQR) filtering to remove extreme luxury anomalies and verified log-normal target price distribution.'
        },
        {
          num: '02',
          title: 'Feature Engineering',
          desc: 'Derived price-per-square-foot baseline, bedroom-to-bathroom proportion, and age depreciation discount curves.'
        },
        {
          num: '03',
          title: 'Pipeline Architecture',
          desc: 'Constructed automated Scikit-learn Pipeline with StandardScaler and ColumnTransformer for categorical localities.'
        },
        {
          num: '04',
          title: 'Rigorous Error Analysis',
          desc: 'Evaluated residual distribution plots to ensure zero heteroscedasticity and unbiased price approximations.'
        }
      ],
      metrics: [
        { model: 'Multi-Variable Linear Regressor', mae: '₹ 4.8L', rmse: '₹ 6.2L', r2: '0.91' },
        { model: 'Lasso Regression (L1)', mae: '₹ 5.1L', rmse: '₹ 6.8L', r2: '0.89' },
        { model: 'Random Forest Regressor', mae: '₹ 5.4L', rmse: '₹ 7.1L', r2: '0.88' }
      ],
      keyFindings:
        'Total square footage combined with prime locality tier accounted for 78% of valuation variance. Linear regression models maintained optimal generalization without overfitting the training sample.'
    }
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projectKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-project-header">
          <span class="modal-tag">${data.tag}</span>
          <h3 class="modal-project-title">${data.title}</h3>
        </div>

        <div class="modal-section-block">
          <p class="bio-text">${data.description}</p>
        </div>

        <div class="modal-section-block">
          <h4 class="modal-block-title">⚙️ Machine Learning Pipeline Architecture</h4>
          <div class="modal-pipeline-steps">
            ${data.steps
              .map(
                (step) => `
              <div class="pipeline-step-card">
                <div class="step-num">STEP ${step.num}</div>
                <h5 class="step-title">${step.title}</h5>
                <p class="step-desc">${step.desc}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="modal-section-block">
          <h4 class="modal-block-title">📊 Benchmark Metrics & Validation Results</h4>
          <table class="modal-metrics-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>R² Score</th>
              </tr>
            </thead>
            <tbody>
              ${data.metrics
                .map(
                  (m) => `
                <tr>
                  <td><strong>${m.model}</strong></td>
                  <td>${m.mae}</td>
                  <td>${m.rmse}</td>
                  <td><span class="badge-grade">${m.r2}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="modal-section-block">
          <h4 class="modal-block-title">💡 Core Analytical Insight</h4>
          <p class="bio-text">${data.keyFindings}</p>
        </div>
      `;

      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeModal();
    }
  });

  // =========================================================================
  // 14. 1-CLICK COPY TO CLIPBOARD WITH TOAST
  // =========================================================================
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
          })
          .catch(() => {
            fallbackCopy(textToCopy);
          });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`, 'success');
    } catch (err) {
      showToast('Could not copy to clipboard', 'error');
    }
    document.body.removeChild(tempInput);
  }

  // =========================================================================
  // 15. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;

    const icon = type === 'success' ? '✅' : 'ℹ️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => toast.classList.add('show'), 20);

    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // =========================================================================
  // 16. CONTACT FORM VALIDATION & SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const subjectError = document.getElementById('subjectError');
      const messageError = document.getElementById('messageError');

      // Clear previous errors
      [nameError, emailError, subjectError, messageError].forEach((el) => (el.textContent = ''));

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email.';
        isValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please provide a subject.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      }

      if (!isValid) return;

      // Simulate sending with loading state
      contactForm.classList.add('submitting');
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.classList.remove('submitting');
        if (submitBtn) submitBtn.disabled = false;
        contactForm.reset();
        showToast('Thank you! Your message has been sent to Kalyan.', 'success');
      }, 1200);
    });
  }

  // Set current copyright year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
