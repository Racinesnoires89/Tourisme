document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.filter-btn');
  const articles = document.querySelectorAll('.article-card');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const category = button.getAttribute('data-category');

      // Active le bouton sélectionné
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Affiche les articles correspondant à la catégorie
      articles.forEach(article => {
        if (article.getAttribute('data-category') === category || category === 'tous') {
          article.style.display = 'block';
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
});
