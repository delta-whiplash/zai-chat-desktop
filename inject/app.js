/**
 * Z.ai Desktop - Custom JavaScript
 * Amélioration de l'interface et gestion de la barre de titre
 */

(function() {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    titleBarHeight: 38,
    selectorsToHide: [
      'header',
      '.nav-header',
      '.top-header',
      '.app-header',
      '.page-header',
      '.navbar',
      '.top-nav',
      '.app-nav',
      '.main-header',
      '[role="banner"]',
      '[data-testid*="header"]',
      '[data-testid*="nav"]',
      '[aria-label*="navigation"]',
      '[aria-label*="header"]'
    ]
  };

  // ==========================================
  // FONCTIONS UTILITAIRES
  // ==========================================

  /**
   * Cache les éléments de navigation du site
   */
  function hideNavigationElements() {
    CONFIG.selectorsToHide.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && el.style.display !== 'none') {
            el.style.display = 'none';
            el.dataset.zaiHidden = 'true';
          }
        });
      } catch (e) {
        // Ignorer les sélecteurs invalides
      }
    });
  }

  /**
   * Ajuste le layout pour compenser la barre de titre
   */
  function adjustLayout() {
    // Ajuster le padding du body si nécessaire
    if (document.body) {
      document.body.style.paddingTop = CONFIG.titleBarHeight + 'px';
    }

    // Chercher les conteneurs principaux et ajuster leur position
    const mainContainers = document.querySelectorAll(
      '#main, .app-container, .chat-container, .main-container, .content-wrapper'
    );

    mainContainers.forEach(container => {
      if (container) {
        container.style.paddingTop = '0';
        container.style.marginTop = '0';
      }
    });
  }

  /**
   * Ajoute la classe pour indiquer que le script est actif
   */
  function markAsEnhanced() {
    if (document.body && !document.body.classList.contains('zai-enhanced')) {
      document.body.classList.add('zai-enhanced');
    }
  }

  // ==========================================
  // OBSERVATEUR DE MUTATIONS
  // ==========================================

  /**
   * Initialise l'observateur pour les changements DOM
   * (important pour les SPA comme z.ai)
   */
  function initMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldHide = false;

      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldHide = true;
        }
      });

      if (shouldHide) {
        hideNavigationElements();
        adjustLayout();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  // ==========================================
  // GESTION DES RACCOURCIS CLAVIER
  // ==========================================

  /**
   * Initialise les raccourcis clavier personnalisés
   */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F5 ou Ctrl+R pour rafraîchir
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        // Laisser le comportement par défaut
        return;
      }

      // Échap pour fermer les modals/dialogs
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll(
          '[role="dialog"], .modal, .popup, [data-testid*="modal"]'
        );
        modals.forEach(modal => {
          const closeBtn = modal.querySelector('[aria-label*="close"], .close, [data-testid*="close"]');
          if (closeBtn) {
            closeBtn.click();
          }
        });
      }
    });
  }

  // ==========================================
  // INITIALISATION
  // ==========================================

  /**
   * Fonction d'initialisation principale
   */
  function init() {
    console.log('[Z.ai Desktop] Enhancement script loaded');

    // Marquer comme amélioré
    markAsEnhanced();

    // Cacher les éléments de navigation
    hideNavigationElements();

    // Ajuster le layout
    adjustLayout();

    // Initialiser l'observateur pour les changements SPA
    initMutationObserver();

    // Initialiser les raccourcis clavier
    initKeyboardShortcuts();

    // Ré-appliquer après un court délai pour les sites lents
    setTimeout(() => {
      hideNavigationElements();
      adjustLayout();
    }, 500);

    // Ré-appliquer après 2 secondes pour être sûr
    setTimeout(() => {
      hideNavigationElements();
      adjustLayout();
    }, 2000);

    console.log('[Z.ai Desktop] Enhancement script initialized');
  }

  // ==========================================
  // LANCEMENT
  // ==========================================

  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM déjà prêt
    init();
  }

  // Backup: s'assurer que tout est caché quand la page est complètement chargée
  window.addEventListener('load', () => {
    hideNavigationElements();
    adjustLayout();
  });

})();
