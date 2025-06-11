// JavaScript for farming pages

document.addEventListener('DOMContentLoaded', function() {
  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Toggle active class
      item.classList.toggle('active');
      
      // Update icon
      const icon = this.querySelector('.faq-toggle i');
      if (item.classList.contains('active')) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
    });
  });
  
  // Gallery image lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      const caption = this.querySelector('.gallery-caption').textContent;
      
      openLightbox(img.src, caption);
    });
  });
  
  // Lightbox functionality
  function openLightbox(imgSrc, caption) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption;
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    lightboxCaption.textContent = caption;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Assemble lightbox
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightboxContent.appendChild(closeBtn);
    lightbox.appendChild(lightboxContent);
    
    // Add to DOM
    document.body.appendChild(lightbox);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Add visible class after small delay for animation
    setTimeout(() => {
      lightbox.classList.add('lightbox-visible');
    }, 10);
    
    // Close button functionality
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
    
    function closeLightbox() {
      lightbox.classList.remove('lightbox-visible');
      
      // Remove from DOM after animation
      setTimeout(() => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
      }, 300);
    }
  }
});

// Add lightbox styles
const lightboxStyles = `
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  transition: opacity 0.3s;
}

.lightbox-visible {
  opacity: 1;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  padding: 20px;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  color: white;
  text-align: center;
  margin-top: 16px;
  font-size: 1.125rem;
}

.lightbox-close {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .lightbox-content {
    max-width: 95%;
  }
  
  .lightbox-caption {
    font-size: 1rem;
  }
}
`;

// Add the lightbox styles to the page
const styleElement = document.createElement('style');
styleElement.textContent = lightboxStyles;
document.head.appendChild(styleElement);