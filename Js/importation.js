// Agriculture d'Importation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling pour la navigation rapide
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight + 
                                   document.querySelector('.quick-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gestion des onglets de produits
    const tabButtons = document.querySelectorAll('.tab-btn');
    const categoryPanels = document.querySelectorAll('.category-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Retirer la classe active de tous les boutons et panneaux
            tabButtons.forEach(btn => btn.classList.remove('active'));
            categoryPanels.forEach(panel => panel.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et au panneau correspondant
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
        });
    });

    // Animation des cartes continents au survol
    const continents = document.querySelectorAll('.continent');
    continents.forEach(continent => {
        continent.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.15)';
        });
        
        continent.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Animation des statistiques au scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number, .impact-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });
            }
        });
    }, observerOptions);

    // Observer les sections avec des statistiques
    const statsElements = document.querySelectorAll('.economic-impact, .flux-statistics, .hero-stats');
    statsElements.forEach(element => {
        statsObserver.observe(element);
    });

    // Fonction d'animation des nombres
    function animateNumber(element) {
        const finalValue = element.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        const suffix = finalValue.replace(/[\d.]/g, '');
        
        if (isNaN(numericValue)) return;
        
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            if (numericValue >= 1000) {
                element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            } else {
                element.textContent = currentValue.toFixed(1) + suffix;
            }
        }, 30);
    }

    // Effet parallaxe pour les routes commerciales
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const tradeRoutes = document.querySelectorAll('.trade-route');
        
        tradeRoutes.forEach((route, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            route.style.transform = `translateY(${yPos}px) rotate(${route.style.transform.match(/rotate\([^)]+\)/)?.[0] || '0deg'})`;
        });
    });

    // Tooltip pour les éléments interactifs
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }
        });
    });

    // Filtrage et recherche des produits
    function addSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            text-align: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher un produit...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            padding: 1rem 1.5rem;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 1rem;
            width: 100%;
            max-width: 400px;
            transition: all 0.3s ease;
        `;
        
        searchContainer.appendChild(searchInput);
        
        const categoryTabs = document.querySelector('.category-tabs');
        if (categoryTabs) {
            categoryTabs.parentNode.insertBefore(searchContainer, categoryTabs);
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const content = card.textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || content.includes(searchTerm)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            
            searchInput.addEventListener('focus', function() {
                this.style.borderColor = '#2563eb';
                this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            });
            
            searchInput.addEventListener('blur', function() {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            });
        }
    }

    // Ajouter la fonctionnalité de recherche
    addSearchFunctionality();

    // Gestion du scroll pour la navigation sticky
    let lastScrollTop = 0;
    const quickNav = document.querySelector('.quick-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scroll vers le bas
            quickNav.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut
            quickNav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animation des cartes au scroll
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer toutes les cartes
    const cards = document.querySelectorAll('.product-card, .enjeu-card, .institution-card, .tendance-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });

    // Gestion des clics sur les continents pour afficher plus d'infos
    continents.forEach(continent => {
        continent.addEventListener('click', function() {
            const continentName = this.getAttribute('data-continent');
            showContinentDetails(continentName);
        });
    });

    function showContinentDetails(continentName) {
        // Créer une modal avec plus de détails
        const modal = document.createElement('div');
        modal.className = 'continent-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Détails - ${continentName.replace('-', ' ')}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
            <p style="color: #6b7280; line-height: 1.6;">
                Informations détaillées sur les échanges commerciaux, les principales cultures, 
                les défis spécifiques et les opportunités de développement pour cette région.
            </p>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Animation d'apparition
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Fermeture de la modal
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // Mise à jour des prix en temps réel (simulation)
    function updatePrices() {
        const priceElements = document.querySelectorAll('.stat-value');
        priceElements.forEach(element => {
            if (element.textContent.includes('€')) {
                const currentPrice = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
                const variation = (Math.random() - 0.5) * 0.1; // ±5% de variation
                const newPrice = currentPrice * (1 + variation);
                const suffix = element.textContent.replace(/[\d.]/g, '');
                element.textContent = newPrice.toFixed(currentPrice >= 100 ? 0 : 1) + suffix;
                
                // Animation de changement de couleur
                element.style.color = variation > 0 ? '#10b981' : '#ef4444';
                setTimeout(() => {
                    element.style.color = '';
                }, 1000);
            }
        });
    }

    // Mettre à jour les prix toutes les 30 secondes (simulation)
    setInterval(updatePrices, 30000);

    console.log('Agriculture d\'Importation - Page chargée avec succès');
});