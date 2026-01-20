/**
 * Columns Feature Parser
 * Converts imagin two-column feature sections to AEM columns-feature block
 *
 * Source patterns:
 * - .d2.block-mgm (payroll domiciliation section)
 * - .d2.mgm (referral program section)
 * - .info-mgm (feature info sections)
 *
 * Output: 2-column table with flexible content in each column
 */

export function parse(element, document) {
  const rows = [];

  // Find the main content containers
  const leftContent = element.querySelector('.info-left, .texto, .content-left, .details');
  const rightContent = element.querySelector('.info-right, .imagen, .image-wrapper, .image-container');

  // Alternatively, look for direct column children
  const columns = element.querySelectorAll('.col, .column, [class*="col-"]');

  if (leftContent || rightContent) {
    const row = parseFeatureSection(leftContent, rightContent, document);
    if (row) rows.push(row);
  } else if (columns.length >= 2) {
    const row = parseColumns(columns, document);
    if (row) rows.push(row);
  } else {
    // Try to extract content directly
    const row = parseDirectContent(element, document);
    if (row) rows.push(row);
  }

  return rows;
}

/**
 * Parse a feature section with left/right content
 */
function parseFeatureSection(leftEl, rightEl, document) {
  const leftCell = document.createElement('div');
  const rightCell = document.createElement('div');

  // Process left content (usually text content)
  if (leftEl) {
    // Heading
    const heading = leftEl.querySelector('h2, h3, .titulo');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      leftCell.appendChild(h2);
    }

    // Description paragraphs
    const paras = leftEl.querySelectorAll('p:not(.titulo)');
    paras.forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        leftCell.appendChild(para);
      }
    });

    // Lists
    const lists = leftEl.querySelectorAll('ul, ol');
    lists.forEach((list) => {
      const newList = document.createElement(list.tagName.toLowerCase());
      list.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        newList.appendChild(newLi);
      });
      leftCell.appendChild(newList);
    });

    // CTA link
    const link = leftEl.querySelector('a.btn, a.cta, a[href]');
    if (link && link.textContent.trim()) {
      const cta = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.textContent.trim();
      cta.appendChild(anchor);
      leftCell.appendChild(cta);
    }
  }

  // Process right content (usually image)
  if (rightEl) {
    const img = rightEl.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      rightCell.appendChild(newImg);
    }
  }

  if (leftCell.children.length > 0 || rightCell.children.length > 0) {
    return [leftCell, rightCell];
  }
  return null;
}

/**
 * Parse columns from generic column structure
 */
function parseColumns(columns, document) {
  const cells = [];

  columns.forEach((col, index) => {
    if (index >= 2) return; // Max 2 columns

    const cell = document.createElement('div');

    // Copy headings
    col.querySelectorAll('h1, h2, h3, h4').forEach((h) => {
      const newH = document.createElement(h.tagName.toLowerCase());
      newH.textContent = h.textContent.trim();
      cell.appendChild(newH);
    });

    // Copy paragraphs
    col.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        cell.appendChild(newP);
      }
    });

    // Copy images
    col.querySelectorAll('img').forEach((img) => {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      cell.appendChild(newImg);
    });

    // Copy lists
    col.querySelectorAll('ul, ol').forEach((list) => {
      const newList = document.createElement(list.tagName.toLowerCase());
      list.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        newList.appendChild(newLi);
      });
      cell.appendChild(newList);
    });

    cells.push(cell);
  });

  if (cells.length >= 2) {
    return cells;
  }
  return null;
}

/**
 * Parse direct content when structure is unclear
 */
function parseDirectContent(element, document) {
  const leftCell = document.createElement('div');
  const rightCell = document.createElement('div');

  // Get all images and put in right cell
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    rightCell.appendChild(newImg);
  });

  // Get text content for left cell
  element.querySelectorAll('h2, h3, p, ul, ol').forEach((el) => {
    if (el.closest('img')) return; // Skip if inside image wrapper

    const clone = el.cloneNode(true);
    leftCell.appendChild(clone);
  });

  if (leftCell.children.length > 0 || rightCell.children.length > 0) {
    return [leftCell, rightCell];
  }
  return null;
}

export const name = 'columns-feature';
