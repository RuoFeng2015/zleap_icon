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
const observerOptions = {
  root: null,
  rootMargin: '100px', // Preload 100px before appearing
  threshold: 0.1
};

const iconObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const iconName = card.dataset.iconName;
      const svgPath = card.dataset.svgPath;
      const originalName = card.dataset.originalName;

      // Load and render SVG
      loadAndRenderIcon(card, iconName, svgPath, originalName);

      // Stop observing once loaded
      observer.unobserve(card);
    }
  });
}, observerOptions);

async function loadAndRenderIcon(card, iconName, svgPath, originalName) {
  try {
    const svgContent = await loadSvgContent(svgPath);
    const isMulticolor = isMulticolorSvg(svgContent);

    // 多色图标不应用颜色配置，保留原色
    const styledSvg = createSvgWithStyles(
      svgContent,
      currentSize,
      isMulticolor ? 'currentColor' : currentColor
    );

    // Copy icon SVG
    const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    if (adminMode) {
      // Admin mode: show checkbox
      card.classList.add('admin-mode');
      if (selectedIcons.has(originalName)) {
        card.classList.add('selected');
      }

      card.innerHTML = `
        <div class="admin-checkbox"></div>
        <div class="icon-preview">${styledSvg}</div>
        <span class="icon-name">${originalName}</span>
      `;

      card.addEventListener('click', (e) => {
        toggleIconSelection(originalName);
      });
    } else {
      card.innerHTML = `
        <div class="card-copy-btn" title="Copy Component Code">
          ${copyIconSvg}
        </div>
        <div class="icon-preview">${styledSvg}</div>
        <span class="icon-name">${originalName}</span>
      `;

      // Card click opens modal
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-copy-btn')) return;
        openModal({ name: iconName, originalName, svgPath }, svgContent);
      });

      // Copy button click
      const copyBtn = card.querySelector('.card-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const componentCode = `<${iconName} />`;
          try {
            await navigator.clipboard.writeText(componentCode);
            showToast(`Copied ${componentCode}`);

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
      }
    }

    // Mark as loaded
    card.classList.add('loaded');
  } catch (error) {
    console.error(`Failed to load icon ${iconName}:`, error);
    card.innerHTML = '<div class="error">!</div>';
  }
}

/**
 * Render icons to the grid
 */
async function renderIcons() {
  // Clear previous observer and grid
  iconObserver.disconnect();
  iconGrid.innerHTML = '';

  if (filteredIcons.length === 0) {
    iconGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="no-results-text">未找到相关图标</div>
        <div class="no-results-subtext">建议缩短关键词或尝试其他搜索词</div>
      </div>
    `;
    return;
  }

  // Create placeholders for all icons at once
  const fragment = document.createDocumentFragment();

  for (const icon of filteredIcons) {
    const card = document.createElement('div');
    card.className = 'icon-card loading'; // Add loading class for skeleton style?
    // Store data needed for loading
    card.dataset.iconName = icon.name;
    card.dataset.originalName = icon.originalName;
    card.dataset.svgPath = icon.svgPath;

    // Optional: Add a simple loading spinner or skeleton
    card.innerHTML = `<div class="loading-placeholder" style="width: ${currentSize}px; height: ${currentSize}px;"></div>`;

    fragment.appendChild(card);

    // Start observing immediately
    iconObserver.observe(card);
  }

  iconGrid.appendChild(fragment);
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
  const importStatement = `import { ${icon.name} } from '@zleap-ai/icons';`;
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

// Load version from Vite define
function loadVersion() {
  const versionBadge = document.getElementById('version-badge');
  if (versionBadge && typeof __APP_VERSION__ !== 'undefined') {
    versionBadge.textContent = `v${__APP_VERSION__}`;
  }
}

loadVersion();

// ============================================
// Admin Mode
// ============================================

let adminMode = false;
let adminConfig = null; // { repo, token, branch }
let selectedIcons = new Set(); // Set of icon originalName

// Hidden entry: triple-click on version badge
let versionClickCount = 0;
let versionClickTimer = null;

const versionBadge = document.getElementById('version-badge');
if (versionBadge) {
  versionBadge.addEventListener('click', () => {
    versionClickCount++;
    if (versionClickTimer) clearTimeout(versionClickTimer);

    if (versionClickCount >= 5) {
      versionClickCount = 0;
      openAdminLogin();
    } else {
      versionClickTimer = setTimeout(() => {
        versionClickCount = 0;
      }, 2000);
    }
  });
}

// Admin Login Modal
const adminLoginModal = document.getElementById('admin-login-modal');
const adminLoginClose = document.getElementById('admin-login-close');
const adminLoginBackdrop = document.getElementById('admin-login-backdrop');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginError = document.getElementById('admin-login-error');

// Admin Toolbar
const adminToolbar = document.getElementById('admin-toolbar');
const adminSelectedCount = document.getElementById('admin-selected-count');
const adminDeleteBtn = document.getElementById('admin-delete-btn');
const adminExitBtn = document.getElementById('admin-exit-btn');

// Delete Confirm Modal
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const deleteConfirmBackdrop = document.getElementById('delete-confirm-backdrop');
const deleteConfirmText = document.getElementById('delete-confirm-text');
const deletePrMessage = document.getElementById('delete-pr-message');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
const deleteProgress = document.getElementById('delete-progress');
const deleteProgressFill = document.getElementById('delete-progress-fill');
const deleteProgressText = document.getElementById('delete-progress-text');

function openAdminLogin() {
  adminLoginModal.classList.remove('hidden');
  adminLoginError.classList.add('hidden');
  adminUsernameInput.value = '';
  adminPasswordInput.value = '';
  document.body.style.overflow = 'hidden';
  setTimeout(() => adminUsernameInput.focus(), 100);
}

function closeAdminLogin() {
  adminLoginModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function validateAdminLogin() {
  const username = adminUsernameInput.value.trim();
  const password = adminPasswordInput.value.trim();

  if (!username || !password) {
    adminLoginError.textContent = '请输入账号和密码';
    adminLoginError.classList.remove('hidden');
    return;
  }

  // The password is the GitHub token, username is the repo owner
  // Format: username = "owner/repo", password = GitHub token
  // Validate by making a test API call
  validateGitHubCredentials(username, password);
}

async function validateGitHubCredentials(repo, token) {
  adminLoginBtn.textContent = '验证中...';
  adminLoginBtn.disabled = true;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    });

    if (response.ok) {
      const repoData = await response.json();
      adminConfig = {
        repo: repo,
        token: token,
        branch: repoData.default_branch || 'main'
      };
      closeAdminLogin();
      enterAdminMode();
      showToast('✅ 已进入管理模式');
    } else if (response.status === 401) {
      adminLoginError.textContent = 'Token 无效或已过期';
      adminLoginError.classList.remove('hidden');
    } else if (response.status === 404) {
      adminLoginError.textContent = '仓库不存在，请检查格式：用户名/仓库名';
      adminLoginError.classList.remove('hidden');
    } else {
      adminLoginError.textContent = `验证失败 (${response.status})`;
      adminLoginError.classList.remove('hidden');
    }
  } catch (error) {
    adminLoginError.textContent = '网络错误，请检查连接';
    adminLoginError.classList.remove('hidden');
  }

  adminLoginBtn.textContent = '登录';
  adminLoginBtn.disabled = false;
}

function enterAdminMode() {
  adminMode = true;
  selectedIcons.clear();
  adminToolbar.classList.remove('hidden');
  updateSelectedCount();
  renderIcons(); // Re-render with admin mode
}

function exitAdminMode() {
  adminMode = false;
  adminConfig = null;
  selectedIcons.clear();
  adminToolbar.classList.add('hidden');
  renderIcons(); // Re-render without admin mode
  showToast('已退出管理模式');
}

function toggleIconSelection(iconOriginalName) {
  if (selectedIcons.has(iconOriginalName)) {
    selectedIcons.delete(iconOriginalName);
  } else {
    selectedIcons.add(iconOriginalName);
  }
  updateSelectedCount();
  updateCardSelectionUI();
}

function updateSelectedCount() {
  adminSelectedCount.textContent = `已选择 ${selectedIcons.size} 个图标`;
  adminDeleteBtn.disabled = selectedIcons.size === 0;
}

function updateCardSelectionUI() {
  document.querySelectorAll('.icon-card.admin-mode').forEach(card => {
    const originalName = card.dataset.originalName;
    card.classList.toggle('selected', selectedIcons.has(originalName));
  });
}

function openDeleteConfirm() {
  if (selectedIcons.size === 0) return;

  const names = Array.from(selectedIcons).slice(0, 5).join('、');
  const more = selectedIcons.size > 5 ? `等 ${selectedIcons.size} 个图标` : '';
  deleteConfirmText.textContent = `确定要删除 ${names}${more} 吗？此操作将创建一个 PR 来删除这些图标。`;

  deleteConfirmModal.classList.remove('hidden');
  deleteProgress.classList.add('hidden');
  deleteConfirmBtn.disabled = false;
  deleteCancelBtn.disabled = false;
  document.body.style.overflow = 'hidden';
}

function closeDeleteConfirm() {
  deleteConfirmModal.classList.add('hidden');
  document.body.style.overflow = '';
}

async function executeDelete() {
  if (!adminConfig || selectedIcons.size === 0) return;

  deleteConfirmBtn.disabled = true;
  deleteCancelBtn.disabled = true;
  deleteProgress.classList.remove('hidden');
  deleteProgressFill.style.width = '0%';
  deleteProgressText.textContent = '正在创建分支...';

  const { repo, token, branch } = adminConfig;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get latest commit SHA
    const refResponse = await fetch(
      `https://api.github.com/repos/${repo}/git/ref/heads/${branch}`,
      { headers }
    );
    if (!refResponse.ok) throw new Error('获取分支信息失败');
    const refData = await refResponse.json();
    const baseSha = refData.object.sha;

    // 2. Create new branch
    const branchName = `delete-icons-${Date.now()}`;
    const createBranchResponse = await fetch(
      `https://api.github.com/repos/${repo}/git/refs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha
        })
      }
    );
    if (!createBranchResponse.ok) throw new Error('创建分支失败');

    deleteProgressFill.style.width = '10%';
    deleteProgressText.textContent = '正在删除图标文件...';

    // 3. Find and delete SVG files
    const iconsToDelete = Array.from(selectedIcons);
    let deletedCount = 0;

    // Find matching files in svg directory
    const svgDirResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/svg?ref=${branchName}`,
      { headers }
    );

    if (svgDirResponse.ok) {
      const files = await svgDirResponse.json();

      for (const iconName of iconsToDelete) {
        // Find matching file (could be Chinese name or sanitized name)
        const matchingFile = files.find(f =>
          f.name === iconName + '.svg' ||
          f.name === iconName
        );

        if (matchingFile) {
          try {
            const deleteResponse = await fetch(
              `https://api.github.com/repos/${repo}/contents/${matchingFile.path}`,
              {
                method: 'DELETE',
                headers,
                body: JSON.stringify({
                  message: `Delete icon: ${matchingFile.name}`,
                  sha: matchingFile.sha,
                  branch: branchName
                })
              }
            );

            if (deleteResponse.ok) {
              deletedCount++;
            }
          } catch (e) {
            console.error(`删除 ${iconName} 失败:`, e);
          }
        }

        const progress = 10 + (deletedCount / iconsToDelete.length) * 60;
        deleteProgressFill.style.width = `${progress}%`;
        deleteProgressText.textContent = `已删除 ${deletedCount}/${iconsToDelete.length}...`;

        // Small delay between deletes
        await new Promise(r => setTimeout(r, 300));
      }
    }

    deleteProgressFill.style.width = '75%';
    deleteProgressText.textContent = '正在更新 icons.json...';

    // 4. Update icons.json - remove deleted icons
    const remainingIcons = icons.filter(icon => !selectedIcons.has(icon.originalName));
    const updatedIconsJson = {
      version: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      generatedAt: new Date().toISOString(),
      totalCount: remainingIcons.length,
      icons: remainingIcons
    };

    const jsonBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updatedIconsJson, null, 2))));

    // Upload to both locations
    for (const path of ['icons.json', 'docs/public/icons.json']) {
      try {
        const checkResponse = await fetch(
          `https://api.github.com/repos/${repo}/contents/${path}?ref=${branchName}`,
          { headers }
        );
        const uploadBody = {
          message: `Update ${path} - remove deleted icons`,
          content: jsonBase64,
          branch: branchName
        };
        if (checkResponse.ok) {
          const fileData = await checkResponse.json();
          uploadBody.sha = fileData.sha;
        }
        await fetch(
          `https://api.github.com/repos/${repo}/contents/${path}`,
          { method: 'PUT', headers, body: JSON.stringify(uploadBody) }
        );
      } catch (e) {
        console.warn(`更新 ${path} 失败:`, e);
      }
    }

    deleteProgressFill.style.width = '90%';
    deleteProgressText.textContent = '正在创建 PR...';

    // 5. Create PR
    const prMessage = deletePrMessage.value.trim() || '删除不需要的图标';
    const deletedNames = iconsToDelete.join('、');
    const prResponse = await fetch(
      `https://api.github.com/repos/${repo}/pulls`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: `🗑️ 删除图标: ${iconsToDelete.length} 个`,
          body: `## 删除图标\n\n**原因:** ${prMessage}\n\n### 删除的图标\n${iconsToDelete.map(n => `- ${n}`).join('\n')}\n\n此 PR 由文档网站管理功能自动生成。`,
          head: branchName,
          base: branch
        })
      }
    );

    deleteProgressFill.style.width = '100%';

    if (prResponse.ok) {
      const prData = await prResponse.json();
      deleteProgressText.innerHTML = `✅ PR 已创建！<a href="${prData.html_url}" target="_blank" style="color: var(--color-primary);">查看 PR →</a>`;

      // Remove deleted icons from local state
      icons = icons.filter(icon => !selectedIcons.has(icon.originalName));
      filteredIcons = filterIcons(icons, searchInput.value);
      selectedIcons.clear();
      updateSelectedCount();

      setTimeout(() => {
        closeDeleteConfirm();
        renderIcons();
        showToast(`✅ 已创建删除 ${deletedCount} 个图标的 PR`);
      }, 3000);
    } else {
      throw new Error('创建 PR 失败');
    }

  } catch (error) {
    deleteProgressText.textContent = `❌ 操作失败: ${error.message}`;
    deleteConfirmBtn.disabled = false;
    deleteCancelBtn.disabled = false;
  }
}

// Admin event listeners
adminLoginClose.addEventListener('click', closeAdminLogin);
adminLoginBackdrop.addEventListener('click', closeAdminLogin);
adminLoginBtn.addEventListener('click', validateAdminLogin);
adminPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') validateAdminLogin();
});
adminUsernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adminPasswordInput.focus();
});

adminDeleteBtn.addEventListener('click', openDeleteConfirm);
adminExitBtn.addEventListener('click', exitAdminMode);

deleteConfirmBackdrop.addEventListener('click', () => {
  if (!deleteConfirmBtn.disabled) closeDeleteConfirm();
});
deleteCancelBtn.addEventListener('click', closeDeleteConfirm);
deleteConfirmBtn.addEventListener('click', executeDelete);
