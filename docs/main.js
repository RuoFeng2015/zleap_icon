// Icon Preview Site - Main JavaScript

// State
let icons = [];
let filteredIcons = [];
let currentSize = 24;
let currentColor = 'currentColor';
let selectedIcon = null;

// DOM Elements
const searchInput = document.getElementById('search-input');
const sizeSelect = document.getElementById('size-select');
const colorSelect = document.getElementById('color-select');
const iconGrid = document.getElementById('icon-grid');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalIconPreview = document.getElementById('modal-icon-preview');
const modalIconName = document.getElementById('modal-icon-name');
const importCode = document.getElementById('import-code');
const usageCode = document.getElementById('usage-code');
const svgCode = document.getElementById('svg-code');
const copyImportBtn = document.getElementById('copy-import');
const copyUsageBtn = document.getElementById('copy-usage');
const copySvgBtn = document.getElementById('copy-svg');

/**
 * Filter icons by search query
 * @param {Array} icons - Array of icon objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered icons
 */
export function filterIcons(icons, query) {
  if (!query || query.trim() === '') {
    return icons;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return icons.filter(icon => {
    const name = (icon.name || '').toLowerCase();
    const originalName = (icon.originalName || '').toLowerCase();
    return name.includes(normalizedQuery) || originalName.includes(normalizedQuery);
  });
}

/**
 * Load icons from icons.json
 */
async function loadIcons() {
  try {
    const response = await fetch('./icons.json');
    const data = await response.json();
    icons = data.icons || [];
    filteredIcons = icons;
    renderIcons();
  } catch (error) {
    console.error('Failed to load icons:', error);
    iconGrid.innerHTML = '<div class="no-results">Failed to load icons. Please try again.</div>';
  }
}

/**
 * Load SVG content for an icon
 * @param {string} svgPath - Path to SVG file
 * @returns {Promise<string>} SVG content
 */
async function loadSvgContent(svgPath) {
  try {
    // svgPath 格式是 "svg/icon-name.svg"，直接使用
    const response = await fetch(`./${svgPath}`);
    return await response.text();
  } catch (error) {
    console.error('Failed to load SVG:', error);
    return '';
  }
}

/**
 * Create SVG element with current size and color
 * @param {string} svgContent - Raw SVG content
 * @param {number} size - Icon size
 * @param {string} color - Icon color
 * @returns {string} Modified SVG string
 */
function createSvgWithStyles(svgContent, size, color) {
  // Parse and modify SVG
  let svg = svgContent;

  // Add or update width and height
  if (svg.includes('width=')) {
    svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
  } else {
    svg = svg.replace('<svg', `<svg width="${size}"`);
  }

  if (svg.includes('height=')) {
    svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
  } else {
    svg = svg.replace('<svg', `<svg height="${size}"`);
  }

  // Update color
  if (color !== 'currentColor') {
    svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`);
    svg = svg.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  }

  return svg;
}

/**
 * Render icons to the grid
 */
async function renderIcons() {
  if (filteredIcons.length === 0) {
    iconGrid.innerHTML = '<div class="no-results">No icons found matching your search.</div>';
    return;
  }

  iconGrid.innerHTML = '';

  for (const icon of filteredIcons) {
    const card = document.createElement('div');
    card.className = 'icon-card';
    card.dataset.iconName = icon.name;

    const svgContent = await loadSvgContent(icon.svgPath);
    const styledSvg = createSvgWithStyles(svgContent, currentSize, currentColor);

    card.innerHTML = `
      <div class="icon-preview">${styledSvg}</div>
      <span class="icon-name">${icon.originalName}</span>
    `;

    card.addEventListener('click', () => openModal(icon, svgContent));
    iconGrid.appendChild(card);
  }
}

/**
 * Open modal with icon details
 * @param {Object} icon - Icon object
 * @param {string} svgContent - SVG content
 */
function openModal(icon, svgContent) {
  selectedIcon = { ...icon, svgContent };

  // Update modal content
  const styledSvg = createSvgWithStyles(svgContent, 48, currentColor);
  modalIconPreview.innerHTML = styledSvg;
  modalIconName.textContent = icon.name;

  // Generate code snippets
  const importStatement = `import { ${icon.name} } from '@your-org/icons';`;
  const usageExample = `<${icon.name} size={${currentSize}} color="${currentColor}" />`;

  importCode.textContent = importStatement;
  usageCode.textContent = usageExample;
  svgCode.textContent = svgContent;

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  selectedIcon = null;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element to show feedback
 */
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);

    // Show feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
}

/**
 * Handle search input
 */
function handleSearch() {
  const query = searchInput.value;
  filteredIcons = filterIcons(icons, query);
  renderIcons();
}

/**
 * Handle size change
 */
function handleSizeChange() {
  currentSize = parseInt(sizeSelect.value, 10);
  renderIcons();

  // Update modal if open
  if (selectedIcon) {
    const styledSvg = createSvgWithStyles(selectedIcon.svgContent, 48, currentColor);
    modalIconPreview.innerHTML = styledSvg;
    usageCode.textContent = `<${selectedIcon.name} size={${currentSize}} color="${currentColor}" />`;
  }
}

/**
 * Handle color change
 */
function handleColorChange() {
  currentColor = colorSelect.value;
  renderIcons();

  // Update modal if open
  if (selectedIcon) {
    const styledSvg = createSvgWithStyles(selectedIcon.svgContent, 48, currentColor);
    modalIconPreview.innerHTML = styledSvg;
    usageCode.textContent = `<${selectedIcon.name} size={${currentSize}} color="${currentColor}" />`;
  }
}

// Event Listeners
searchInput.addEventListener('input', handleSearch);
sizeSelect.addEventListener('change', handleSizeChange);
colorSelect.addEventListener('change', handleColorChange);
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

copyImportBtn.addEventListener('click', () => {
  copyToClipboard(importCode.textContent, copyImportBtn);
});

copyUsageBtn.addEventListener('click', () => {
  copyToClipboard(usageCode.textContent, copyUsageBtn);
});

copySvgBtn.addEventListener('click', () => {
  copyToClipboard(svgCode.textContent, copySvgBtn);
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Initialize
loadIcons();
