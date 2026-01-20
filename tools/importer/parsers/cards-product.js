/**
 * Cards Product Parser
 * Converts imagin product card elements to AEM cards-product block
 *
 * Source patterns:
 * - .d2.product-simple (individual product cards)
 * - .d2.product-filters (product filter cards)
 * - .card-explicativas (descriptive cards)
 * - .card-descriptive (descriptive card items)
 *
 * Output: 2-column table with Image | Content (title, description, optional CTA)
 */

export function parse(element, document) {
  const rows = [];

  // Check for product-simple cards
  const productCard = element.closest('.d2.product-simple') || element;
  if (productCard.classList?.contains('product-simple')) {
    const row = parseProductCard(productCard, document);
    if (row) rows.push(row);
    return rows;
  }

  // Check for card-explicativas container with multiple cards
  const cardContainer = element.querySelector('.card-explicativas, .cards.swiper-slide');
  if (cardContainer) {
    const cards = cardContainer.querySelectorAll('.card-descriptive, .card');
    cards.forEach((card) => {
      const row = parseDescriptiveCard(card, document);
      if (row) rows.push(row);
    });
    return rows;
  }

  // Check for individual cards within swiper
  const swiperCards = element.querySelectorAll('.swiper-slide .card-descriptive, .d-flex.cards .card-descriptive');
  if (swiperCards.length > 0) {
    swiperCards.forEach((card) => {
      const row = parseDescriptiveCard(card, document);
      if (row) rows.push(row);
    });
    return rows;
  }

  // Fallback: parse element as single card
  const row = parseGenericCard(element, document);
  if (row) rows.push(row);

  return rows;
}

/**
 * Parse a product-simple card
 */
function parseProductCard(element, document) {
  const imgCell = document.createElement('div');
  const contentCell = document.createElement('div');

  // Get image
  const img = element.querySelector('.image-container img, .imagen img, img');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgCell.appendChild(newImg);
  }

  // Get title
  const title = element.querySelector('.titulo, h2, h3, .title');
  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    const para = document.createElement('p');
    para.appendChild(strong);
    contentCell.appendChild(para);
  }

  // Get description
  const desc = element.querySelector('.descripcion, .description, p:not(.titulo)');
  if (desc && desc.textContent.trim()) {
    const para = document.createElement('p');
    para.textContent = desc.textContent.trim();
    contentCell.appendChild(para);
  }

  // Get CTA
  const link = element.querySelector('a.btn, a.cta, a[href]');
  if (link && link.textContent.trim()) {
    const cta = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent.trim();
    cta.appendChild(anchor);
    contentCell.appendChild(cta);
  }

  if (imgCell.children.length > 0 || contentCell.children.length > 0) {
    return [imgCell, contentCell];
  }
  return null;
}

/**
 * Parse a descriptive card (card-descriptive)
 */
function parseDescriptiveCard(element, document) {
  const imgCell = document.createElement('div');
  const contentCell = document.createElement('div');

  // Get image (may be icon or photo)
  const img = element.querySelector('img, .icon');
  if (img && img.tagName === 'IMG') {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgCell.appendChild(newImg);
  }

  // Get title
  const title = element.querySelector('.titulo-card, .titulo, h3, h4, p.titulo-card');
  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    const para = document.createElement('p');
    para.appendChild(strong);
    contentCell.appendChild(para);
  }

  // Get description
  const desc = element.querySelector('.descripcion-card, .descripcion, p:not(.titulo-card):not(.titulo)');
  if (desc && desc.textContent.trim()) {
    const para = document.createElement('p');
    para.textContent = desc.textContent.trim();
    contentCell.appendChild(para);
  }

  // Get CTA (the card itself may be a link)
  if (element.tagName === 'A' && element.href) {
    const cta = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = element.href;
    anchor.textContent = 'Learn more';
    cta.appendChild(anchor);
    contentCell.appendChild(cta);
  }

  if (contentCell.children.length > 0) {
    return [imgCell, contentCell];
  }
  return null;
}

/**
 * Parse a generic card structure
 */
function parseGenericCard(element, document) {
  const imgCell = document.createElement('div');
  const contentCell = document.createElement('div');

  // Get first image
  const img = element.querySelector('img');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imgCell.appendChild(newImg);
  }

  // Get heading
  const heading = element.querySelector('h2, h3, h4, strong');
  if (heading) {
    const strong = document.createElement('strong');
    strong.textContent = heading.textContent.trim();
    const para = document.createElement('p');
    para.appendChild(strong);
    contentCell.appendChild(para);
  }

  // Get description
  element.querySelectorAll('p').forEach((p, index) => {
    if (index === 0 && heading) return; // Skip if already got as heading
    if (p.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      contentCell.appendChild(para);
    }
  });

  // Get link
  const link = element.querySelector('a[href]');
  if (link && link.textContent.trim()) {
    const cta = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent.trim();
    cta.appendChild(anchor);
    contentCell.appendChild(cta);
  }

  if (imgCell.children.length > 0 || contentCell.children.length > 0) {
    return [imgCell, contentCell];
  }
  return null;
}

export const name = 'cards-product';
