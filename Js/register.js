// Authentication related JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Password visibility toggle
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
  
  // Password strength meter
  const passwordInput = document.getElementById('password');
  const strengthMeter = document.querySelector('.strength-meter-fill');
  
  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      
      strengthMeter.setAttribute('data-strength', strength);
      
      // Update strength text
      const strengthText = document.querySelector('.strength-text');
      if (strengthText) {
        const strengthLabels = ['Vide', 'Faible', 'Moyen', 'Fort', 'Très fort'];
        strengthText.textContent = `Force du mot de passe: ${strengthLabels[strength]}`;
      }
    });
  }
  
  // Registration form validation
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const firstName = document.getElementById('firstname').value.trim();
      const lastName = document.getElementById('lastname').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const farmType = document.getElementById('farm-type').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const termsChecked = document.getElementById('terms').checked;
      
      let isValid = true;
      const errors = [];
      
      // Validate name
      if (firstName.length < 2) {
        errors.push('Le prénom doit contenir au moins 2 caractères');
        isValid = false;
      }
      
      if (lastName.length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
        isValid = false;
      }
      
      // Validate email
      if (!validateEmail(email)) {
        errors.push('Veuillez entrer une adresse email valide');
        isValid = false;
      }
      
      // Validate phone
      if (!validatePhone(phone)) {
        errors.push('Veuillez entrer un numéro de téléphone valide');
        isValid = false;
      }
      
      // Validate farm type
      if (!farmType) {
        errors.push('Veuillez sélectionner un type d\'exploitation');
        isValid = false;
      }
      
      // Validate password
      if (calculatePasswordStrength(password) < 3) {
        errors.push('Le mot de passe doit être plus fort (au moins 8 caractères, incluant des majuscules, minuscules, chiffres et caractères spéciaux)');
        isValid = false;
      }
      
      // Validate password confirmation
      if (password !== confirmPassword) {
        errors.push('Les mots de passe ne correspondent pas');
        isValid = false;
      }
      
      // Validate terms
      if (!termsChecked) {
        errors.push('Vous devez accepter les conditions d\'utilisation');
        isValid = false;
      }
      
      if (isValid) {
        // Simulate successful registration
        showNotification('success', 'Votre compte a été créé avec succès! Redirection...');
        
        // In a real application, you would send this data to the server
        // For demo purposes, we'll just redirect after a delay
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else {
        // Show the first error
        showNotification('error', errors[0]);
      }
    });
  }
  
  // Login form validation
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      let isValid = true;
      const errors = [];
      
      // Validate email
      if (!validateEmail(email)) {
        errors.push('Veuillez entrer une adresse email valide');
        isValid = false;
      }
      
      // Validate password (basic check for demo)
      if (password.length < 6) {
        errors.push('Le mot de passe doit contenir au moins 6 caractères');
        isValid = false;
      }
      
      if (isValid) {
        // Simulate successful login
        showNotification('success', 'Connexion réussie! Redirection...');
        
        // For demo purposes, redirect after a delay
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else {
        // Show the first error
        showNotification('error', errors[0]);
      }
    });
  }
});

// Calculate password strength (0-4)
function calculatePasswordStrength(password) {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Complexity checks
  if (/[a-z]/.test(password)) strength += 0.5;
  if (/[A-Z]/.test(password)) strength += 0.5;
  if (/[0-9]/.test(password)) strength += 0.5;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 0.5;
  
  // Bonus for length and complexity combination
  if (password.length >= 12 && strength >= 2) strength += 1;
  
  return Math.floor(strength);
}

// Email validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone validation (basic)
function validatePhone(phone) {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone) || phone.length >= 10;
}

// Notification system (reused from main.js)
function showNotification(type, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = document.createElement('span');
  icon.className = 'notification-icon';
  icon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
  
  const text = document.createElement('span');
  text.className = 'notification-text';
  text.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.addEventListener('click', () => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  notification.appendChild(icon);
  notification.appendChild(text);
  notification.appendChild(closeBtn);
  
  // Add to the DOM
  if (!document.querySelector('.notifications-container')) {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
  }
  
  const container = document.querySelector('.notifications-container');
  container.appendChild(notification);
  
  // Add the visible class after a small delay to trigger animation
  setTimeout(() => {
    notification.classList.add('notification-visible');
  }, 10);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}