document.addEventListener('DOMContentLoaded', () => {

  // Variables modales
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const cartModal = document.getElementById('cartModal');

  // Boutons ouverture/fermeture
  document.getElementById('openLogin').addEventListener('click', () => {
    loginModal.style.display = 'flex';
  });
  document.getElementById('closeLogin').addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  document.getElementById('openSignup').addEventListener('click', () => {
    signupModal.style.display = 'flex';
  });
  document.getElementById('closeSignup').addEventListener('click', () => {
    signupModal.style.display = 'none';
  });

  document.getElementById('cartBtn').addEventListener('click', () => {
    updateCart();
    cartModal.style.display = 'flex';
  });
  document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  // Fermer modales au clic en dehors
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === signupModal) signupModal.style.display = 'none';
    if (e.target === cartModal) cartModal.style.display = 'none';
  });

  // Panier
  let cart = [];

  const cartCountElem = document.getElementById('cartCount');
  const cartItemsElem = document.getElementById('cartItems');
  const totalAmountElem = document.getElementById('totalAmount');

  // Ajouter au panier
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price').replace(/[^\d\.]/g, '')) || 0;

      cart.push({ name, price });
      updateCart();
    });
  });

  // Mettre à jour le panier affiché
  function updateCart() {
    cartCountElem.textContent = cart.length;
    cartItemsElem.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.textContent = `${item.name} - ${item.price.toFixed(2)} €`;
      cartItemsElem.appendChild(div);
      total += item.price;
    });

    totalAmountElem.textContent = `Total : ${total.toFixed(2)} €`;
  }

  // Validation commande
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    alert('Commande validée ! Merci pour votre achat.');
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
  });

  // Redirections instantanées (si tu veux vraiment rediriger)
  /*
  document.getElementById('openLogin').addEventListener('click', () => {
    window.location.href = 'login.html';
  });
  document.getElementById('openSignup').addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
  */
});
