/* Profile Card 
  Handles real-time clock updates and keyboard accessibility
 */

//CLOCK UPDATE FUNCTION

function updateClock() {
    const timeElement = document.querySelector('[data-testid="test-user-time"]');
    if (timeElement) {
      const currentTime = Date.now();
      timeElement.textContent = currentTime;
      // Update datetime attribute for semantic accuracy
      timeElement.dateTime = new Date(currentTime).toISOString();
    }
  }
  
  // Initialize clock on page load
  document.addEventListener('DOMContentLoaded', () => {
    // Set initial time
    updateClock();
    
    // Update clock every 500ms
    setInterval(updateClock, 500);
    
    // Setup keyboard navigation helpers
    setupAccessibility();
  });
  
  
  // ACCESSIBILITY ENHANCEMENTS
  
  
  function setupAccessibility() {
    const profileCard = document.querySelector('[data-testid="test-profile-card"]');
    
    if (!profileCard) return;
  
    // Add skip to main link if not present
    addSkipLink();
    
    // Ensure all interactive elements are keyboard accessible
    ensureKeyboardAccessibility();
    
    // Add focus visible class for browsers that don't support :focus-visible
    addFocusVisiblePolyfill();
  }
  
  // Skip to main link
  function addSkipLink() {
    if (document.querySelector('.skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('id', 'skip-link');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add CSS for skip link
    if (!document.querySelector('style[data-skip-link]')) {
      const style = document.createElement('style');
      style.setAttribute('data-skip-link', 'true');
      style.textContent = `
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 0 0 4px 0;
          text-decoration: none;
          z-index: 100;
        }
        .skip-link:focus {
          top: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Ensure keyboard accessibility for all interactive elements
  function ensureKeyboardAccessibility() {
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea'
    );
    
    interactiveElements.forEach((element) => {
      // Ensure elements are in tab order if not already
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A') {
        if (element.tabIndex < 0) {
          element.tabIndex = 0;
        }
      }
    });
  }
  
  // Polyfill for :focus-visible
  function addFocusVisiblePolyfill() {
    const isKeyboardEvent = (e) => {
      return e instanceof KeyboardEvent;
    };
  
    const focusableElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, [tabindex]'
    );
  
    focusableElements.forEach((element) => {
      // Track if focus was from keyboard
      let isKeyboardFocused = false;
  
      element.addEventListener('mousedown', () => {
        isKeyboardFocused = false;
      });
  
      element.addEventListener('keydown', () => {
        isKeyboardFocused = true;
      });
  
      element.addEventListener('focus', () => {
        if (isKeyboardFocused) {
          element.classList.add('focus-visible');
        }
      });
  
      element.addEventListener('blur', () => {
        element.classList.remove('focus-visible');
        isKeyboardFocused = false;
      });
    });
  }
  
  
  // UTILITY FUNCTIONS
  
  /*
    Get all profile data from the page (for testing)
   */
  function getProfileData() {
    return {
      card: document.querySelector('[data-testid="test-profile-card"]'),
      name: document.querySelector('[data-testid="test-user-name"]')?.textContent,
      bio: document.querySelector('[data-testid="test-user-bio"]')?.textContent,
      time: document.querySelector('[data-testid="test-user-time"]')?.textContent,
      avatar: document.querySelector('[data-testid="test-user-avatar"]')?.src,
      socialLinks: Array.from(
        document.querySelectorAll('[data-testid="test-user-social-links"] a')
      ).map((link) => ({
        name: link.textContent,
        url: link.href,
        testid: link.getAttribute('data-testid'),
      })),
      hobbies: Array.from(
        document.querySelectorAll('[data-testid="test-user-hobbies"] li')
      ).map((li) => li.textContent),
      dislikes: Array.from(
        document.querySelectorAll('[data-testid="test-user-dislikes"] li')
      ).map((li) => li.textContent),
    };
  }
  
  /* Validate that all required elements exist
   */
  function validateProfileCard() {
    const requiredTestIds = [
      'test-profile-card',
      'test-user-name',
      'test-user-bio',
      'test-user-time',
      'test-user-avatar',
      'test-user-social-links',
      'test-user-hobbies',
      'test-user-dislikes',
    ];
  
    const results = {};
    requiredTestIds.forEach((testId) => {
      const element = document.querySelector(`[data-testid="${testId}"]`);
      results[testId] = {
        exists: !!element,
        element: element,
      };
    });
  
    return results;
  }
  
  /* Log validation results to console
   */
  function logValidation() {
    console.log('Profile Card Validation Results:');
    console.table(validateProfileCard());
    console.log('Profile Data:', getProfileData());
  }
  
  // Export for testing/debugging
  window.profileCard = {
    getProfileData,
    validateProfileCard,
    logValidation,
    updateClock,
  };
  
  // Log validation results when dev tools are opened (optional)
 if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
console.log('Profile Card ready. Run profileCard.logValidation() to test.');
   }
