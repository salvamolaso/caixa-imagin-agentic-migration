/**
 * Accordion FAQ Parser
 * Converts imagin FAQ accordion elements to AEM accordion-faq block
 *
 * Source patterns:
 * - .d2.faqs .accordion (FAQ accordion container)
 * - .accordion-item (individual FAQ items)
 *
 * Output: 2-column table with Question | Answer
 */

export function parse(element, document) {
  const rows = [];

  // Find accordion items
  const accordionItems = element.querySelectorAll('.accordion-item');

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const row = parseAccordionItem(item, document);
      if (row) rows.push(row);
    });
  } else {
    // Try alternative structure (details/summary)
    const detailsItems = element.querySelectorAll('details');
    detailsItems.forEach((item) => {
      const row = parseDetailsItem(item, document);
      if (row) rows.push(row);
    });
  }

  return rows;
}

/**
 * Parse a Bootstrap-style accordion item
 */
function parseAccordionItem(item, document) {
  const questionCell = document.createElement('div');
  const answerCell = document.createElement('div');

  // Get question from header
  const header = item.querySelector('.accordion-header, .accordion-button');
  if (header) {
    // Look for heading inside header
    const questionEl = header.querySelector('h2, h3, h4') || header;
    questionCell.textContent = questionEl.textContent.trim();
  }

  // Get answer from body
  const body = item.querySelector('.accordion-body, .accordion-collapse');
  if (body) {
    // Copy all content from body
    body.querySelectorAll('p, ul, ol').forEach((el) => {
      if (el.tagName === 'P') {
        const para = document.createElement('p');
        para.innerHTML = el.innerHTML;
        answerCell.appendChild(para);
      } else if (el.tagName === 'UL' || el.tagName === 'OL') {
        const list = document.createElement(el.tagName.toLowerCase());
        el.querySelectorAll('li').forEach((li) => {
          const newLi = document.createElement('li');
          newLi.innerHTML = li.innerHTML;
          list.appendChild(newLi);
        });
        answerCell.appendChild(list);
      }
    });

    // If no structured content found, get text content
    if (answerCell.children.length === 0 && body.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = body.textContent.trim();
      answerCell.appendChild(para);
    }
  }

  if (questionCell.textContent.trim() && answerCell.children.length > 0) {
    return [questionCell, answerCell];
  }
  return null;
}

/**
 * Parse a details/summary accordion item
 */
function parseDetailsItem(item, document) {
  const questionCell = document.createElement('div');
  const answerCell = document.createElement('div');

  // Get question from summary
  const summary = item.querySelector('summary');
  if (summary) {
    questionCell.textContent = summary.textContent.trim();
  }

  // Get answer from remaining content (excluding summary)
  const contentNodes = Array.from(item.childNodes).filter(
    (node) => node !== summary && node.nodeType === Node.ELEMENT_NODE
  );

  contentNodes.forEach((node) => {
    if (node.tagName === 'P') {
      const para = document.createElement('p');
      para.innerHTML = node.innerHTML;
      answerCell.appendChild(para);
    } else if (node.tagName === 'UL' || node.tagName === 'OL') {
      const list = document.createElement(node.tagName.toLowerCase());
      node.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.innerHTML = li.innerHTML;
        list.appendChild(newLi);
      });
      answerCell.appendChild(list);
    } else if (node.tagName === 'DIV') {
      // Process div content
      node.querySelectorAll('p, ul, ol').forEach((el) => {
        const clone = el.cloneNode(true);
        answerCell.appendChild(clone);
      });
    }
  });

  // Fallback: get all text except summary
  if (answerCell.children.length === 0) {
    const fullText = item.textContent;
    const summaryText = summary ? summary.textContent : '';
    const answerText = fullText.replace(summaryText, '').trim();
    if (answerText) {
      const para = document.createElement('p');
      para.textContent = answerText;
      answerCell.appendChild(para);
    }
  }

  if (questionCell.textContent.trim() && answerCell.children.length > 0) {
    return [questionCell, answerCell];
  }
  return null;
}

export const name = 'accordion-faq';
