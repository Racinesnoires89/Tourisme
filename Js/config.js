// Configuration centralisée pour les services de notification

// IMPORTANT: Remplacez ces valeurs par vos vraies clés de configuration

const NOTIFICATION_CONFIG = {
    // Configuration EmailJS
    // 1. Créez un compte sur https://www.emailjs.com/
    // 2. Créez un service email (Gmail, Outlook, etc.)
    // 3. Créez un template d'email
    // 4. Remplacez les valeurs ci-dessous
    emailjs: {
        serviceId: 'service_xxxxxxx',        // Votre Service ID EmailJS
        templateId: 'template_xxxxxxx',      // Votre Template ID EmailJS
        publicKey: 'xxxxxxxxxxxxxxxx'       // Votre Public Key EmailJS
    },

    // Configuration Telegram Bot
    // 1. Créez un bot via @BotFather sur Telegram
    // 2. Obtenez le token du bot
    // 3. Obtenez votre Chat ID (envoyez un message à @userinfobot)
    // 4. Remplacez les valeurs ci-dessous
    telegram: {
        botToken: '1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ',  // Token de votre bot Telegram
        chatId: '123456789'                                   // Votre Chat ID Telegram
    },

    // Email de destination pour les notifications
    adminEmail: 'admin@agrovision.fr',

    // Configuration des notifications
    notifications: {
        enableEmail: true,      // Activer/désactiver les notifications email
        enableTelegram: true,   // Activer/désactiver les notifications Telegram
        enableConsoleLog: true  // Activer/désactiver les logs console
    }
};

// Template d'email pour EmailJS
// Créez ce template dans votre compte EmailJS avec ces variables :
/*
Template EmailJS suggéré :

Sujet: {{subject}}

Bonjour,

Une nouvelle {{action_type}} a eu lieu sur AgroEleVision :

👤 Utilisateur: {{user_name}}
📧 Email: {{user_email}}
📱 Téléphone: {{phone}}
🚜 Type d'exploitation: {{farm_type}}
📰 Newsletter: {{newsletter}}
💾 Se souvenir: {{remember_me}}

📊 Informations techniques:
⏰ Date: {{timestamp}}
🌐 Adresse IP: {{ip_address}}
💻 Navigateur: {{user_agent}}

Cordialement,
Système AgroEleVision
*/

// Export de la configuration (si vous utilisez des modules ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NOTIFICATION_CONFIG;
}

// Instructions de configuration :
console.log(`
🔧 CONFIGURATION REQUISE :

1. EmailJS :
   - Créez un compte sur https://www.emailjs.com/
   - Configurez un service email
   - Créez un template avec les variables mentionnées
   - Remplacez les valeurs dans emailjs{}

2. Telegram Bot :
   - Créez un bot via @BotFather
   - Obtenez le token du bot
   - Obtenez votre Chat ID via @userinfobot
   - Remplacez les valeurs dans telegram{}

3. Ajoutez EmailJS à vos pages HTML :
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

4. Testez la configuration en soumettant les formulaires
`);