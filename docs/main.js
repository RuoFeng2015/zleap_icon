// Icon Preview Site - Main JavaScript

// State
let icons = [];
let filteredIcons = [];
let currentSize = 32;
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
 * Check if SVG is multicolor (has multiple fill/stroke colors or gradients)
 * @param {string} svgContent - Raw SVG content
 * @returns {boolean} True if multicolor
 */
function isMulticolorSvg(svgContent) {
  // 检查是否使用了渐变或图案（通过 url() 引用）
  const hasUrlFill = /fill="url\(#[^)]+\)"/.test(svgContent);
  const hasUrlStroke = /stroke="url\(#[^)]+\)"/.test(svgContent);

  // 检查是否有渐变/图案定义
  const hasGradient = svgContent.includes('<linearGradient') ||
    svgContent.includes('<radialGradient') ||
    svgContent.includes('<pattern');

  // 检查是否有多个不同的 fill 颜色（排除 none, currentColor, url()）
  const fillMatches = svgContent.match(/fill="(?!none|currentColor|url\()[^"]+"/g) || [];
  const uniqueFills = new Set(fillMatches);

  // 检查是否有多个不同的 stroke 颜色
  const strokeMatches = svgContent.match(/stroke="(?!none|currentColor|url\()[^"]+"/g) || [];
  const uniqueStrokes = new Set(strokeMatches);

  return hasUrlFill || hasUrlStroke || hasGradient || uniqueFills.size > 1 || uniqueStrokes.size > 1;
}

/**
 * Create SVG element with current size and color
 * @param {string} svgContent - Raw SVG content
 * @param {number} size - Icon size
 * @param {string} color - Icon color (only applied to single-color icons)
 * @param {string} uniqueId - Optional unique ID to prevent gradient ID collisions
 * @returns {string} Modified SVG string
 */
function createSvgWithStyles(svgContent, size, color, uniqueId = null) {
  let svg = svgContent;

  // 生成唯一前缀，避免多个 SVG 使用相同的渐变 ID 导致冲突
  const prefix = uniqueId || `svg-${Math.random().toString(36).substr(2, 9)}`;

  // 替换所有 id="xxx" 为 id="prefix-xxx"
  // 同时替换引用 url(#xxx) 为 url(#prefix-xxx)
  svg = svg.replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`);
  svg = svg.replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`);

  // 找到 <svg 开标签的结束位置
  const svgTagEnd = svg.indexOf('>');
  if (svgTagEnd === -1) return svg;

  // 提取 <svg ...> 开标签
  let svgOpenTag = svg.substring(0, svgTagEnd + 1);
  const restOfSvg = svg.substring(svgTagEnd + 1);

  // 只在 <svg> 开标签中修改 width 和 height
  // 先移除现有的 width 和 height（如果有）
  svgOpenTag = svgOpenTag.replace(/\s+width="[^"]*"/gi, '');
  svgOpenTag = svgOpenTag.replace(/\s+height="[^"]*"/gi, '');

  // 在 <svg 后插入新的 width 和 height
  svgOpenTag = svgOpenTag.replace('<svg', `<svg width="${size}" height="${size}"`);

  // 重新组合 SVG
  svg = svgOpenTag + restOfSvg;

  // 只对单色图标应用颜色配置
  // 多色图标保留原始颜色
  if (color !== 'currentColor' && !isMulticolorSvg(svgContent)) {
    // 替换 currentColor
    svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`);
    svg = svg.replace(/stroke="currentColor"/g, `stroke="${color}"`);

    // 替换其他颜色值（但不替换 none 和 url() 引用）
    // 替换常见的黑色值
    svg = svg.replace(/fill="(#000000|#000|black)"/gi, `fill="${color}"`);
    svg = svg.replace(/stroke="(#000000|#000|black)"/gi, `stroke="${color}"`);

    // 替换其他具体颜色值（排除 none, url(), white, transparent）
    svg = svg.replace(/fill="(?!none|url\(|white|#fff|#ffffff|transparent)[^"]+"/gi, `fill="${color}"`);
    svg = svg.replace(/stroke="(?!none|url\(|white|#fff|#ffffff|transparent)[^"]+"/gi, `stroke="${color}"`);
  }

  return svg;
}

/**
 * Render icons to the grid
 */
// Toast Notification
const toast = document.getElementById('toast');
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2000);
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
    const isMulticolor = isMulticolorSvg(svgContent);

    // 多色图标不应用颜色配置，保留原色
    const styledSvg = createSvgWithStyles(
      svgContent,
      currentSize,
      isMulticolor ? 'currentColor' : currentColor
    );

    // Copy icon SVG
    const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    card.innerHTML = `
      <div class="card-copy-btn" title="Copy Component Code">
        ${copyIconSvg}
      </div>
      <div class="icon-preview">${styledSvg}</div>
      <span class="icon-name">${icon.originalName}</span>
    `;

    // Card click opens modal
    card.addEventListener('click', (e) => {
      // Ignore if copy button was clicked
      if (e.target.closest('.card-copy-btn')) return;
      openModal(icon, svgContent);
    });

    // Copy button click
    const copyBtn = card.querySelector('.card-copy-btn');
    copyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const componentCode = `<${icon.name} />`;
      try {
        await navigator.clipboard.writeText(componentCode);
        showToast(`Copied ${componentCode}`);

        // Button feedback
        copyBtn.style.backgroundColor = 'var(--color-primary)';
        copyBtn.style.color = 'white';
        setTimeout(() => {
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });

    iconGrid.appendChild(card);
  }
}

/**
 * Simple syntax highlighter for JSX/import statements
 * Uses placeholders to avoid highlighting generated HTML tags
 */
function highlightJsx(code) {
  // 1. Escape HTML first
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Apply placeholders
  out = out
    // Keywords
    .replace(/\b(import|from|export|const|let|var)\b/g, '___KEY___$1___END___')
    // JSX Attributes (word followed by =) - require leading space to avoid matching inside strings/text
    .replace(/(\s)(\w+)=/g, '$1___ATTR___$2___END___=')
    // String Values (in attributes)
    .replace(/=(".*?")/g, '=___VAL___$1___END___')
    // Expression Values
    .replace(/({[^}]+})/g, '___VAL___$1___END___')
    // Strings (single quotes for imports)
    .replace(/('[^']*')/g, '___STR___$1___END___')
    // Tags (start with &lt;)
    .replace(/(&lt;\/?)([\w]+)/g, '$1___TAG___$2___END___')
  // Tag End (&gt; or /&gt;) - Just color the bracket? Original code colored the bracket.
  // Original: .replace(/(\/?>|&gt;)/g, '<span class="tag">$1</span>')
  // We will leave brackets plain or color them as tag?
  // Let's color the whole tag structure if possible, but simplest is to just restore placeholders.

  // 3. Replace placeholders with real HTML
  return out
    .replace(/___KEY___/g, '<span class="keyword">')
    .replace(/___ATTR___/g, '<span class="attr-name">')
    .replace(/___VAL___/g, '<span class="attr-value">')
    .replace(/___STR___/g, '<span class="string">')
    .replace(/___TAG___/g, '<span class="tag">')
    .replace(/___END___/g, '</span>');
}

/**
 * Simple syntax highlighter for SVG
 */
function highlightSvg(code) {
  // 1. Escape HTML first
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Apply placeholders
  out = out
    // Tags: &lt;tagname or &lt;/tagname
    .replace(/(&lt;\/?[\w:-]+)/g, '___TAG___$1___END___')
    // Attributes: word=
    .replace(/(\s)([\w:-]+)=/g, '$1___ATTR___$2___END___=')
    // Values: "..."
    .replace(/="([^"]*)"/g, '=___VAL___"$1"___END___');

  // 3. Replace placeholders
  return out
    .replace(/___TAG___/g, '<span class="tag">')
    .replace(/___ATTR___/g, '<span class="attr-name">')
    .replace(/___VAL___/g, '<span class="attr-value">')
    .replace(/___END___/g, '</span>');
}

/**
 * Open modal with icon details
 * @param {Object} icon - Icon object
 * @param {string} svgContent - SVG content
 */
function openModal(icon, svgContent) {
  selectedIcon = { ...icon, svgContent };
  const isMulticolor = isMulticolorSvg(svgContent);

  // Update modal content - 多色图标不应用颜色
  const styledSvg = createSvgWithStyles(svgContent, 64, isMulticolor ? 'currentColor' : currentColor);
  modalIconPreview.innerHTML = styledSvg;
  modalIconName.textContent = icon.name;

  // Generate code snippets
  const importStatement = `import { ${icon.name} } from '@zleap-web/icons';`;
  const usageExample = `<${icon.name} size={${currentSize}} color="${currentColor}" />`;

  // Apply syntax highlighting
  importCode.innerHTML = highlightJsx(importStatement);
  usageCode.innerHTML = highlightJsx(usageExample);
  svgCode.innerHTML = highlightSvg(svgContent);

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
    button.style.backgroundColor = 'var(--color-primary)';
    button.style.color = 'white';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
      button.style.color = '';
    }, 2000);

    showToast('Copied to clipboard!');
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
