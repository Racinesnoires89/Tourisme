// Configuration et initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeTabSystem();
    initializeCalculator();
    initializeAnimations();
    initializeVideoPlaceholders();
    initializeScrollEffects();
    initializeInteractiveElements();
});

// Système d'onglets pour les espèces
function initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Retirer la classe active de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et au contenu correspondant
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Animation d'apparition
            const activeContent = document.getElementById(targetTab);
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeContent.style.transition = 'all 0.3s ease';
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
            }, 50);
        });
    });
}

// Calculateur de rations
function initializeCalculator() {
    const calculatorForm = document.getElementById('ration-calculator');
    const resultsContainer = document.getElementById('ration-results');

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateRation();
        });
    }
}

function calculateRation() {
    const formData = new FormData(document.getElementById('ration-calculator'));
    const espece = formData.get('espece');
    const nombre = parseInt(formData.get('nombre'));
    const age = parseInt(formData.get('age'));
    const saison = formData.get('saison');

    // Données nutritionnelles par espèce
    const nutritionData = {
        'poules-pondeuses': {
            proteines: 16,
            energie: 2750,
            calcium: 3.5,
            consommation: 120,
            ingredients: {
                'Blé concassé': 50,
                'Maïs': 25,
                'Légumineuses': 10,
                'Verdure fraîche': 10,
                'Coquilles d\'huîtres': 3,
                'Graines de tournesol': 2
            }
        },
        'poulets-chair': {
            proteines: age < 3 ? 24 : age < 6 ? 22 : 20,
            energie: age < 3 ? 3000 : age < 6 ? 3100 : 3200,
            calcium: 1.0,
            consommation: age < 3 ? 50 : age < 6 ? 100 : 150,
            ingredients: {
                'Blé concassé': 45,
                'Maïs': 30,
                'Légumineuses': 15,
                'Verdure fraîche': 8,
                'Graines de tournesol': 2
            }
        },
        'canards': {
            proteines: 18,
            energie: 2800,
            calcium: 2.5,
            consommation: 150,
            ingredients: {
                'Blé concassé': 40,
                'Maïs': 25,
                'Légumineuses': 10,
                'Plantes aquatiques': 15,
                'Verdure fraîche': 8,
                'Graines de tournesol': 2
            }
        },
        'oies': {
            proteines: 16,
            energie: 2600,
            calcium: 2.0,
            consommation: 200,
            ingredients: {
                'Avoine': 40,
                'Blé': 30,
                'Orge': 20,
                'Légumineuses': 10
            }
        },
        'dindes': {
            proteines: age < 4 ? 28 : age < 8 ? 24 : age < 16 ? 20 : 16,
            energie: 2900,
            calcium: 2.5,
            consommation: age < 4 ? 80 : age < 8 ? 120 : age < 16 ? 160 : 200,
            ingredients: {
                'Blé concassé': 45,
                'Maïs': 25,
                'Légumineuses': 15,
                'Verdure fraîche': 10,
                'Graines de tournesol': 3,
                'Coquilles d\'huîtres': 2
            }
        }
    };

    const data = nutritionData[espece];
    if (!data) return;

    // Ajustements saisonniers
    let adjustmentFactor = 1;
    if (saison === 'hiver') {
        adjustmentFactor = 1.1; // +10% en hiver
    } else if (saison === 'ete') {
        adjustmentFactor = 0.95; // -5% en été
    }

    const consommationTotale = data.consommation * nombre * adjustmentFactor;
    
    // Calcul des ingrédients
    const ingredients = {};
    for (const [ingredient, pourcentage] of Object.entries(data.ingredients)) {
        ingredients[ingredient] = Math.round((consommationTotale * pourcentage / 100) * 10) / 10;
    }

    // Affichage des résultats
    displayResults(espece, nombre, age, saison, data, consommationTotale, ingredients);
}

function displayResults(espece, nombre, age, saison, data, consommationTotale, ingredients) {
    const resultsContainer = document.getElementById('ration-results');
    
    const especeNames = {
        'poules-pondeuses': 'Poules Pondeuses',
        'poulets-chair': 'Poulets de Chair',
        'canards': 'Canards',
        'oies': 'Oies',
        'dindes': 'Dindes'
    };

    const saisonNames = {
        'printemps': 'Printemps',
        'ete': 'Été',
        'automne': 'Automne',
        'hiver': 'Hiver'
    };

    resultsContainer.innerHTML = `
        <h3>Ration Calculée</h3>
        <div class="results-summary">
            <div class="summary-item">
                <strong>Espèce :</strong> ${especeNames[espece]}
            </div>
            <div class="summary-item">
                <strong>Nombre d'animaux :</strong> ${nombre}
            </div>
            <div class="summary-item">
                <strong>Âge :</strong> ${age} semaines
            </div>
            <div class="summary-item">
                <strong>Saison :</strong> ${saisonNames[saison]}
            </div>
        </div>

        <div class="nutrition-requirements">
            <h4>Besoins Nutritionnels</h4>
            <div class="nutrition-grid">
                <div class="nutrition-item">
                    <span class="nutrition-label">Protéines :</span>
                    <span class="nutrition-value">${data.proteines}%</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Énergie :</span>
                    <span class="nutrition-value">${data.energie} kcal/kg</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Calcium :</span>
                    <span class="nutrition-value">${data.calcium}%</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Consommation totale :</span>
                    <span class="nutrition-value">${Math.round(consommationTotale)}g/jour</span>
                </div>
            </div>
        </div>

        <div class="ration-composition">
            <h4>Composition de la Ration Quotidienne</h4>
            <div class="ingredients-list">
                ${Object.entries(ingredients).map(([ingredient, quantite]) => `
                    <div class="ingredient-item">
                        <span class="ingredient-name">${ingredient}</span>
                        <span class="ingredient-quantity">${quantite}g</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="cost-estimation">
            <h4>Estimation des Coûts</h4>
            <div class="cost-breakdown">
                <div class="cost-item">
                    <span>Coût quotidien estimé :</span>
                    <span>${(consommationTotale * 0.0008).toFixed(2)}€</span>
                </div>
                <div class="cost-item">
                    <span>Coût mensuel estimé :</span>
                    <span>${(consommationTotale * 0.0008 * 30).toFixed(2)}€</span>
                </div>
                <div class="cost-item">
                    <span>Coût annuel estimé :</span>
                    <span>${(consommationTotale * 0.0008 * 365).toFixed(2)}€</span>
                </div>
            </div>
        </div>

        <div class="recommendations">
            <h4>Recommandations</h4>
            <ul class="recommendations-list">
                ${getRecommendations(espece, age, saison).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="results-actions">
            <button onclick="printResults()" class="btn btn-outline">
                <i class="fas fa-print"></i> Imprimer
            </button>
            <button onclick="saveResults()" class="btn btn-secondary">
                <i class="fas fa-save"></i> Sauvegarder
            </button>
            <button onclick="shareResults()" class="btn btn-primary">
                <i class="fas fa-share"></i> Partager
            </button>
        </div>
    `;

    // Ajouter les styles CSS pour les résultats
    addResultsStyles();
}

function getRecommendations(espece, age, saison) {
    const recommendations = [];
    
    if (espece === 'poules-pondeuses') {
        recommendations.push('Assurez-vous d\'un accès permanent à l\'eau fraîche');
        recommendations.push('Distribuez les coquilles d\'huîtres séparément');
        recommendations.push('Augmentez la verdure fraîche au printemps');
    }
    
    if (espece === 'poulets-chair' && age < 6) {
        recommendations.push('Surveillez la croissance et ajustez si nécessaire');
        recommendations.push('Broyez finement les aliments pour les jeunes');
    }
    
    if (saison === 'hiver') {
        recommendations.push('Augmentez légèrement la ration énergétique');
        recommendations.push('Protégez l\'eau du gel');
        recommendations.push('Utilisez plus de graines germées');
    }
    
    if (saison === 'ete') {
        recommendations.push('Distribuez aux heures fraîches');
        recommendations.push('Augmentez l\'ombrage et la ventilation');
        recommendations.push('Surveillez la consommation d\'eau');
    }
    
    recommendations.push('Observez quotidiennement le comportement des animaux');
    recommendations.push('Adaptez la ration selon les performances observées');
    
    return recommendations;
}

function addResultsStyles() {
    if (document.getElementById('results-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'results-styles';
    style.textContent = `
        .results-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .summary-item {
            padding: 0.5rem;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #2d5016;
        }
        
        .nutrition-requirements,
        .ration-composition,
        .cost-estimation,
        .recommendations {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2d5016;
        }
        
        .nutrition-requirements h4,
        .ration-composition h4,
        .cost-estimation h4,
        .recommendations h4 {
            color: #2d5016;
            margin-bottom: 1rem;
        }
        
        .nutrition-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .nutrition-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
        }
        
        .nutrition-label {
            color: #64748b;
        }
        
        .nutrition-value {
            font-weight: 700;
            color: #2d5016;
        }
        
        .ingredients-list {
            display: grid;
            gap: 0.5rem;
        }
        
        .ingredient-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
        }
        
        .ingredient-name {
            color: #475569;
        }
        
        .ingredient-quantity {
            font-weight: 700;
            color: #2d5016;
        }
        
        .cost-breakdown {
            display: grid;
            gap: 0.5rem;
        }
        
        .cost-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
        }
        
        .cost-item span:last-child {
            font-weight: 700;
            color: #2d5016;
        }
        
        .recommendations-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .recommendations-list li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: #475569;
        }
        
        .recommendations-list li::before {
            content: '💡';
            position: absolute;
            left: 0;
        }
        
        .results-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
            .results-summary {
                grid-template-columns: 1fr;
            }
            
            .nutrition-grid {
                grid-template-columns: 1fr;
            }
            
            .results-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

// Fonctions d'action pour les résultats
function printResults() {
    const resultsContent = document.getElementById('ration-results').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ration Calculée - AgroEleVision</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h3, h4 { color: #2d5016; }
                    .results-actions { display: none; }
                </style>
            </head>
            <body>
                <h1>Ration Calculée - AgroEleVision</h1>
                ${resultsContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function saveResults() {
    const resultsData = {
        timestamp: new Date().toISOString(),
        results: document.getElementById('ration-results').innerHTML
    };
    
    localStorage.setItem('ration-results', JSON.stringify(resultsData));
    showNotification('Résultats sauvegardés avec succès !', 'success');
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Ration Calculée - AgroEleVision',
            text: 'Découvrez ma ration personnalisée pour l\'alimentation naturelle en aviculture',
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié dans le presse-papiers !', 'success');
        });
    }
}

// Animations et effets visuels
function initializeAnimations() {
    // Animation des barres de progression
    const progressBars = document.querySelectorAll('.besoin-fill, .autonomy-fill, .footprint-fill');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease-out';
                    bar.style.width = width;
                }, 200);
                
                progressObserver.unobserve(bar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Animation des compteurs
    const counters = document.querySelectorAll('.stat-number, .nutrition-value');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const step = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        const suffix = text.replace(/[\d,]/g, '');
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Gestion des vidéos
function initializeVideoPlaceholders() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        const playBtn = placeholder.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                loadVideoContent(placeholder);
            });
        }
    });
}

function loadVideo(videoId) {
    const placeholder = document.querySelector(`[data-video="${videoId}"]`) || 
                      document.querySelector('.video-placeholder');
    
    if (placeholder) {
        loadVideoContent(placeholder);
    }
}

function loadVideoContent(placeholder) {
    // Simulation du chargement d'une vidéo
    placeholder.innerHTML = `
        <div class="video-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Chargement de la vidéo...</p>
        </div>
    `;
    
    setTimeout(() => {
        placeholder.innerHTML = `
            <div class="video-content">
                <div class="video-frame">
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
                <p class="video-description">
                    Vidéo explicative sur l'alimentation naturelle en aviculture
                </p>
            </div>
        `;
    }, 1500);
}

// Effets de scroll
function initializeScrollEffects() {
    // Parallax pour le hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.3;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes et éléments
    const animatedElements = document.querySelectorAll(`
        .principe-card, .aliment-card, .supplement-card, .pratique-card,
        .avantage-item, .defi-card, .temoignage-card, .stat-card
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });

    // Progress bar de lecture
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #90ee90, #2d5016);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Éléments interactifs
function initializeInteractiveElements() {
    // Bouton retour en haut
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(45, 80, 22, 0.3);
    `;
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Tooltips pour les termes techniques
    const technicalTerms = document.querySelectorAll('[data-tooltip]');
    
    technicalTerms.forEach(term => {
        term.addEventListener('mouseenter', function() {
            showTooltip(this, this.dataset.tooltip);
        });
        
        term.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });

    // Modal pour les images
    const modalImages = document.querySelectorAll('.aliment-image img, .supplement-image img, .espece-image img');
    
    modalImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            showImageModal(this);
        });
    });
}

// Fonctions utilitaires
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #2d5016;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        z-index: 1500;
        max-width: 200px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function showImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="position: relative; max-width: 90%; max-height: 90%; text-align: center;">
            <span class="modal-close" style="position: absolute; top: -40px; right: 0; color: white; font-size: 2rem; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.2); border-radius: 50%; transition: background 0.3s ease;">&times;</span>
            <img src="${img.src}" alt="${img.alt}" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
            <div class="modal-caption" style="color: white; margin-top: 1rem; font-size: 1.1rem; opacity: 0.9;">${img.alt}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

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
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
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
    
    .back-to-top:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Fonctions globales pour l'interaction
window.loadVideo = loadVideo;
window.printResults = printResults;
window.saveResults = saveResults;
window.shareResults = shareResults;

console.log('🐔 Alimentation Naturelle en Aviculture - Page chargée avec succès!');
console.log('📊 Fonctionnalités activées: Calculateur, animations, vidéos, interactivité');