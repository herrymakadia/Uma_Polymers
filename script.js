/**
 * UMA POLYMERS - Interactive JavaScript
 * Handles navigation, active link states, quote modal, form validations, and toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  const quoteModal = document.getElementById('quoteModal');
  const openQuoteBtns = document.querySelectorAll('.open-quote-btn, .open-quote-modal-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const quoteForm = document.getElementById('quoteForm');
  const quoteProductSelect = document.getElementById('quoteProduct');
  
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const viewAllProductsBtn = document.getElementById('viewAllProductsBtn');

  // --- 1. Sticky Navigation & Scroll Effects ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // --- 3. Active Link Highlighting on Scroll ---
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- 4. Quote Modal Logic ---
  function openModal(preselectedProduct = '') {
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (preselectedProduct && quoteProductSelect) {
        for (let i = 0; i < quoteProductSelect.options.length; i++) {
          if (quoteProductSelect.options[i].text.toLowerCase().includes(preselectedProduct.toLowerCase())) {
            quoteProductSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  function closeModal() {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product-name') || '';
      openModal(product);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Handle Quote Form Submit
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        closeModal();
        quoteForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showToast('Quote request submitted! Our sales team will contact you shortly.');
      }, 700);
    });
  }

  // --- 5. Contact Form Validation & Submit ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const message = document.getElementById('contactMessage');

      // Clear previous error classes
      [name, email, phone, message].forEach(input => {
        if (input && input.parentElement) {
          input.parentElement.classList.remove('has-error');
        }
      });

      // Name validation
      if (!name.value.trim()) {
        name.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        email.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Phone validation
      if (!phone.value.trim() || phone.value.trim().length < 8) {
        phone.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Message validation
      if (!message.value.trim()) {
        message.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        const sendBtn = document.getElementById('sendMessageBtn');
        const originalText = sendBtn.textContent;
        sendBtn.textContent = 'Sending Message...';
        sendBtn.disabled = true;

        setTimeout(() => {
          sendBtn.textContent = originalText;
          sendBtn.disabled = false;
          showToast(`Thank you, ${name.value.trim()}! Your message has been received.`);
          contactForm.reset();
        }, 800);
      }
    });

    // Remove error on input change
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        if (input.parentElement) {
          input.parentElement.classList.remove('has-error');
        }
      });
    });
  }

  // --- 6. View All Products Button ---
  if (viewAllProductsBtn) {
    viewAllProductsBtn.addEventListener('click', () => {
      openModal('Custom Polymer Strapping');
    });
  }

  // --- 7. Toast Notification Utility ---
  let toastTimer;
  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
