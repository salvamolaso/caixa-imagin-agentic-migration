/**
 * Imagin Site Cleanup Transformer
 * Removes site-wide elements that shouldn't be imported
 */

export function preTransform(document) {
  // Remove cookie consent banners
  const cookieBanners = document.querySelectorAll(
    '.cookie-banner, .cookies-consent, [id*="cookie"], [class*="cookie"]'
  );
  cookieBanners.forEach((el) => el.remove());

  // Remove navigation/header elements
  const navElements = document.querySelectorAll(
    'header, nav, .header, .navigation, .nav-wrapper, .menu-wrapper'
  );
  navElements.forEach((el) => el.remove());

  // Remove footer elements
  const footerElements = document.querySelectorAll(
    'footer, .footer, .footer-wrapper'
  );
  footerElements.forEach((el) => el.remove());

  // Remove modals and popups
  const modals = document.querySelectorAll(
    '.modal, .popup, .overlay, [role="dialog"], .modals'
  );
  modals.forEach((el) => el.remove());

  // Remove tracking pixels and hidden elements
  const trackingElements = document.querySelectorAll(
    '[data-tealium], .tealium, [id*="adobe"], .adobeTarget-hidden, noscript'
  );
  trackingElements.forEach((el) => el.remove());

  // Remove sr-only screen reader elements that contain dynamic status
  const srOnlyStatus = document.querySelectorAll('.sr-only[id*="slider-status"]');
  srOnlyStatus.forEach((el) => el.remove());

  // Remove slider controls (navigation arrows, pagination dots)
  const sliderControls = document.querySelectorAll(
    '.slider-container, .boton-left, .boton-right, .indicador .barras'
  );
  sliderControls.forEach((el) => el.remove());

  // Clean up empty divs
  const emptyDivs = document.querySelectorAll('div:empty');
  emptyDivs.forEach((el) => {
    if (!el.hasAttribute('id') && !el.hasAttribute('class')) {
      el.remove();
    }
  });
}

export function postTransform(document) {
  // Remove any remaining script artifacts
  const scriptArtifacts = document.querySelectorAll(
    '[onclick], [onload], [onerror]'
  );
  scriptArtifacts.forEach((el) => {
    el.removeAttribute('onclick');
    el.removeAttribute('onload');
    el.removeAttribute('onerror');
  });

  // Clean up tealium IDs from links
  const tealiumLinks = document.querySelectorAll('a[id*="tealium"]');
  tealiumLinks.forEach((el) => {
    el.removeAttribute('id');
  });

  // Remove duplicate mobile/desktop links (keep desktop version)
  const mobileLinks = document.querySelectorAll('a[id*="-mobile"]');
  mobileLinks.forEach((el) => el.remove());

  // Clean up Adobe Target classes
  const adobeTargetElements = document.querySelectorAll('.adobeTarget');
  adobeTargetElements.forEach((el) => {
    el.classList.remove('adobeTarget');
  });
}
