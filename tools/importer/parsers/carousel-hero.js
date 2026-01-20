/**
 * Carousel Hero Parser
 * Converts imagin hero slider and card slider elements to AEM carousel-hero block
 *
 * Source patterns:
 * - .d3-slider-animado (main hero with video slider)
 * - .card-slider (card-based carousels in Mission Planet, Benefits sections)
 *
 * Output: 2-column table with Image | Content (heading, description, CTA)
 */

export function parse(element, document) {
  const rows = [];

  // Check for d3-slider-animado (main hero)
  const videoSlider = element.querySelector('.video-slider');
  if (videoSlider) {
    const slides = videoSlider.querySelectorAll('.contenedor');
    slides.forEach((slide) => {
      const row = parseHeroSlide(slide, document);
      if (row) rows.push(row);
    });
  }

  // Check for card-slider (card carousels)
  const cards = element.querySelectorAll('.cards > .card');
  if (cards.length > 0) {
    cards.forEach((card) => {
      const row = parseCardSlide(card, document);
      if (row) rows.push(row);
    });
  }

  return rows;
}

/**
 * Parse a hero slide from the main video slider
 */
function parseHeroSlide(slide, document) {
  // Get image
  const img = slide.querySelector('img:not([alt*="Anterior"]):not([alt*="Siguiente"])');
  const imgCell = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgCell.appendChild(newImg);
  }

  // Get content
  const contentCell = document.createElement('div');

  // Title
  const titleEl = slide.querySelector('.titulo, h2, h3');
  if (titleEl) {
    const heading = document.createElement('h2');
    heading.textContent = titleEl.textContent.trim();
    contentCell.appendChild(heading);
  }

  // Description
  const descEl = slide.querySelector('.descripcion, .subtitulo, p:not(.titulo)');
  if (descEl) {
    const para = document.createElement('p');
    para.textContent = descEl.textContent.trim();
    contentCell.appendChild(para);
  }

  // CTA link
  const link = slide.querySelector('a.btn, a.cta, a[href]:not([class*="tealium"])');
  if (link) {
    const cta = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent.trim() || 'Learn more';
    cta.appendChild(anchor);
    contentCell.appendChild(cta);
  }

  // Only return row if we have content
  if (imgCell.children.length > 0 || contentCell.children.length > 0) {
    return [imgCell, contentCell];
  }
  return null;
}

/**
 * Parse a card from card-slider carousels
 */
function parseCardSlide(card, document) {
  // Get image (usually background or direct img)
  const img = card.querySelector('img');
  const imgCell = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgCell.appendChild(newImg);
  }

  // Get content
  const contentCell = document.createElement('div');

  // Title
  const titleEl = card.querySelector('.titulo-card, .titulo, h2, h3, p.titulo-card');
  if (titleEl) {
    const heading = document.createElement('strong');
    heading.textContent = titleEl.textContent.trim();
    const para = document.createElement('p');
    para.appendChild(heading);
    contentCell.appendChild(para);
  }

  // Description
  const descEl = card.querySelector('.descripcion-card, .descripcion, p:not(.titulo-card)');
  if (descEl && descEl.textContent.trim()) {
    const para = document.createElement('p');
    para.textContent = descEl.textContent.trim();
    contentCell.appendChild(para);
  }

  // CTA link
  const link = card.querySelector('.enlace a, a[href]');
  if (link && link.textContent.trim()) {
    const cta = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent.trim();
    cta.appendChild(anchor);
    contentCell.appendChild(cta);
  }

  // Only return row if we have content
  if (imgCell.children.length > 0 || contentCell.children.length > 0) {
    return [imgCell, contentCell];
  }
  return null;
}

export const name = 'carousel-hero';
