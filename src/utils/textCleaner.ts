export const cleanTextForSpeech = (htmlContent: string): string => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Remove unwanted elements
  const elementsToRemove = tempDiv.querySelectorAll('style, script, noscript, iframe, code, pre');
  elementsToRemove.forEach(el => el.remove());

  // Function to get visible text from an element
  const getVisibleText = (element: Element): string => {
    // Skip hidden elements
    if (element instanceof HTMLElement) {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return '';
      }
    }

    // If it's a text node, return its content
    if (element.nodeType === Node.TEXT_NODE) {
      return element.textContent?.trim() || '';
    }

    // Skip elements that shouldn't be read
    if (element.tagName === 'CODE' || 
        element.tagName === 'PRE' ||
        element.hasAttribute('aria-hidden')) {
      return '';
    }

    // Recursively process child nodes
    let text = '';
    element.childNodes.forEach(child => {
      text += getVisibleText(child as Element) + ' ';
    });

    // Add natural pauses and intonation markers based on element type
    switch (element.tagName) {
      case 'P':
        text += '... '; // Longer pause between paragraphs
        break;
      case 'DIV':
        text += '. '; // Standard pause
        break;
      case 'H1':
        text += '.... '; // Extra long pause after main heading
        break;
      case 'H2':
      case 'H3':
        text += '... '; // Longer pause after subheadings
        break;
      case 'H4':
      case 'H5':
      case 'H6':
        text += '.. '; // Medium pause after minor headings
        break;
      case 'LI':
        text += ', '; // Short pause between list items
        break;
      case 'BLOCKQUOTE':
        text = `... ${text} ... `; // Dramatic pause around quotes
        break;
    }

    return text;
  };

  // Get clean text and add natural speech patterns
  const cleanText = getVisibleText(tempDiv)
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '... ') // Add pause at line breaks
    .replace(/([.!?])\s+/g, '$1... ') // Add slight pause after sentences
    .replace(/([,;])\s+/g, '$1 ') // Shorter pause for commas and semicolons
    .replace(/\.\.\. \.\.\. /g, '... ') // Clean up multiple pauses
    .replace(/,\s*\./g, '.') // Clean up comma followed by period
    .replace(/\s+/g, ' ') // Final space cleanup
    .trim();

  return cleanText;
};