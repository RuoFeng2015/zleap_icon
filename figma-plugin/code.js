"use strict";
/// <reference types="@figma/plugin-typings" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// ============================================
// Constants
// ============================================
var CONFIG_KEY = 'icon-sync-config';
var UI_WIDTH = 400;
var UI_HEIGHT = 550;
// ============================================
// SVG Cleanup Utilities
// ============================================
/**
 * 清理 Figma 导出的 SVG 中的问题元素
 * - 移除画板背景（#F5F5F5 填充的全尺寸矩形）
 * - 移除超大白色背景路径
 * - 移除空的 clipPath 和引用
 * - 保留渐变定义和多色效果
 */
function cleanSvgContent(svgString) {
    var e_1, _a;
    var svg = svgString;
    var originalLength = svg.length;
    // 打印原始 SVG 片段用于调试
    console.log("[cleanSvgContent] \u539F\u59CB SVG \u524D 200 \u5B57\u7B26: ".concat(svg.substring(0, 200)));
    // 1. 移除 #F5F5F5 背景 - 处理 rect 和 path 元素
    // 使用正则匹配包含 fill="#F5F5F5" 的 rect 或 path（紧跟在 svg 标签后的第一个元素）
    var before1 = svg.length;
    // 移除 fill="#F5F5F5" 的 rect 背景（整个画板背景）
    svg = svg.replace(/<rect[^>]*fill="#F5F5F5"[^>]*\/>/gi, '');
    svg = svg.replace(/<rect[^>]*fill="#F5F5F5"[^>]*>[^<]*<\/rect>/gi, '');
    // 移除 fill="#F5F5F5" 的 path 背景
    svg = svg.replace(/<path[^>]*fill="#F5F5F5"[^>]*\/>/gi, '');
    console.log("[cleanSvgContent] Step 1: \u79FB\u9664 #F5F5F5 \u80CC\u666F, \u5220\u9664 ".concat(before1 - svg.length, " \u5B57\u7B26"));
    // 2. 移除超大尺寸的 rect 背景（如 width="1440"）
    var before2 = svg.length;
    // 匹配 width 超过 500 的 rect 元素
    svg = svg.replace(/<rect[^>]*width="(\d+)"[^>]*>/gi, function (match, width) {
        var w = parseInt(width, 10);
        if (w > 500) {
            console.log("[cleanSvgContent] \u5220\u9664\u5927\u5C3A\u5BF8 rect: ".concat(match.substring(0, 80), "..."));
            return '';
        }
        return match;
    });
    console.log("[cleanSvgContent] Step 2: \u79FB\u9664\u5927\u5C3A\u5BF8 rect, \u5220\u9664 ".concat(before2 - svg.length, " \u5B57\u7B26"));
    // 3. 移除 white 背景 path（带有负坐标或 M0 开头）
    var before3 = svg.length;
    svg = svg.replace(/<path[^>]*fill="white"[^>]*\/>/gi, function (match) {
        // 检查是否是大背景路径（d 包含负数坐标或 M0）
        if (match.includes('d="M-') || match.includes('d="M0')) {
            console.log("[cleanSvgContent] \u5220\u9664\u767D\u8272\u80CC\u666F: ".concat(match.substring(0, 80), "..."));
            return '';
        }
        return match;
    });
    console.log("[cleanSvgContent] Step 3: \u79FB\u9664 white \u80CC\u666F, \u5220\u9664 ".concat(before3 - svg.length, " \u5B57\u7B26"));
    // 4. 移除空的 clipPath 定义和 clip-path 属性
    svg = svg.replace(/<clipPath\s+id="[^"]*"\s*\/>/gi, '');
    svg = svg.replace(/<clipPath\s+id="[^"]*"\s*><\/clipPath>/gi, '');
    svg = svg.replace(/\s+clip-path="url\([^)]*\)"/gi, ''); // 注意：属性名是 clip-path 不是 clipPath
    svg = svg.replace(/\s+clipPath="url\([^)]*\)"/gi, '');
    // 5. 简化空的 g 标签
    svg = svg.replace(/<g\s*>\s*<\/g>/gi, '');
    // 6. 解包只有单个属性的 g 标签
    svg = svg.replace(/<g\s*>([^]*?)<\/g>/g, '$1');
    // 7. 移除未使用的渐变定义
    var usedGradientIds = new Set();
    var gradientRefs = svg.matchAll(/(?:fill|stroke)="url\(#([^)]+)\)"/g);
    try {
        for (var gradientRefs_1 = __values(gradientRefs), gradientRefs_1_1 = gradientRefs_1.next(); !gradientRefs_1_1.done; gradientRefs_1_1 = gradientRefs_1.next()) {
            var match = gradientRefs_1_1.value;
            usedGradientIds.add(match[1]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (gradientRefs_1_1 && !gradientRefs_1_1.done && (_a = gradientRefs_1.return)) _a.call(gradientRefs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    svg = svg.replace(/<linearGradient\s+id="([^"]+)"[^>]*>[\s\S]*?<\/linearGradient>/g, function (match, id) { return usedGradientIds.has(id) ? match : ''; });
    // 8. 清理多余的空白
    svg = svg.replace(/>\s+</g, '><');
    svg = svg.replace(/\s{2,}/g, ' ');
    console.log("[cleanSvgContent] \u603B\u8BA1: ".concat(originalLength, " -> ").concat(svg.length, ", \u5220\u9664 ").concat(originalLength - svg.length, " \u5B57\u7B26"));
    console.log("[cleanSvgContent] \u6E05\u7406\u540E SVG \u524D 200 \u5B57\u7B26: ".concat(svg.substring(0, 200)));
    return svg.trim();
}
// ============================================
// State
// ============================================
var currentIcons = [];
// ============================================
// Plugin Initialization
// ============================================
figma.showUI(__html__, {
    width: UI_WIDTH,
    height: UI_HEIGHT,
    title: 'zleap-icon 图标同步',
});
// ============================================
// Selection Change Handler
// ============================================
figma.on('selectionchange', function () {
    updateIconsFromSelection();
});
/**
 * 根据当前选区更新图标列表
 */
function updateIconsFromSelection() {
    var selection = figma.currentPage.selection;
    if (selection.length === 0) {
        // 没有选中任何内容，显示当前页面所有图标
        currentIcons = findIconsInNodes([figma.currentPage]);
    }
    else {
        // 在选中的节点中查找图标
        currentIcons = findIconsInNodes(selection);
    }
    sendToUI({
        type: 'selection-changed',
        payload: {
            icons: currentIcons,
            totalCount: currentIcons.length,
            hasSelection: selection.length > 0,
            selectionName: selection.length === 1
                ? selection[0].name
                : selection.length > 1
                    ? "".concat(selection.length, " \u4E2A\u9009\u4E2D\u9879")
                    : '整个页面',
        },
    });
}
/**
 * 在指定节点中查找图标
 */
function findIconsInNodes(nodes) {
    var e_2, _a;
    var icons = [];
    try {
        for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
            var node = nodes_1_1.value;
            traverseNode(node, icons);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    // 按名称排序
    icons.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return icons;
}
/**
 * 递归遍历节点查找图标
 * 注意：当一个节点被识别为图标后，不再递归其子节点
 */
function traverseNode(node, icons) {
    var e_3, _a;
    // 检查是否是图标（COMPONENT 或 FRAME 类型，合适的尺寸）
    if (isIconNode(node)) {
        icons.push({
            id: node.id,
            name: node.name,
            width: Math.round(node.width),
            height: Math.round(node.height),
        });
        // 已识别为图标，不再递归子节点（避免将子 Frame 也识别为独立图标）
        return;
    }
    // 只有非图标节点才递归处理子节点
    if ('children' in node) {
        try {
            for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                traverseNode(child, icons);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
}
/**
 * 判断节点是否是图标
 */
function isIconNode(node) {
    if (node.type !== 'COMPONENT' && node.type !== 'FRAME') {
        return false;
    }
    var frameNode = node;
    var width = Math.round(frameNode.width);
    var height = Math.round(frameNode.height);
    // 尺寸在 8-256 之间
    if (width < 8 || width > 256 || height < 8 || height > 256) {
        return false;
    }
    // 宽高比在 0.5-2 之间（大致正方形）
    var aspectRatio = width / height;
    if (aspectRatio < 0.5 || aspectRatio > 2) {
        return false;
    }
    // 对于 FRAME，检查是否包含矢量内容
    if (node.type === 'FRAME') {
        var hasVectorContent = frameNode.findOne(function (child) {
            return child.type === 'VECTOR' ||
                child.type === 'BOOLEAN_OPERATION' ||
                child.type === 'LINE' ||
                child.type === 'ELLIPSE' ||
                child.type === 'RECTANGLE' ||
                child.type === 'POLYGON' ||
                child.type === 'STAR' ||
                child.type === 'GROUP';
        });
        if (!hasVectorContent) {
            return false;
        }
    }
    return true;
}
// ============================================
// SVG Export
// ============================================
/**
 * 导出图标为 SVG
 */
function exportIconsToSvg(icons) {
    return __awaiter(this, void 0, void 0, function () {
        var results, total, i, icon, node, svgData, svgString, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    total = icons.length;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < icons.length)) return [3 /*break*/, 7];
                    icon = icons[i];
                    return [4 /*yield*/, figma.getNodeByIdAsync(icon.id)];
                case 2:
                    node = (_a.sent());
                    if (!node) {
                        console.warn("\u8282\u70B9 ".concat(icon.id, " \u4E0D\u5B58\u5728\uFF0C\u8DF3\u8FC7"));
                        return [3 /*break*/, 6];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, node.exportAsync({
                            format: 'SVG',
                            svgIdAttribute: false,
                            contentsOnly: false, // 保留渐变定义
                        })
                        // 将 Uint8Array 转换为字符串
                    ];
                case 4:
                    svgData = _a.sent();
                    svgString = String.fromCharCode.apply(null, Array.from(svgData));
                    // 清理 SVG 中的问题元素
                    svgString = cleanSvgContent(svgString);
                    results.push(__assign(__assign({}, icon), { svg: svgString }));
                    // 发送进度更新
                    sendToUI({
                        type: 'export-progress',
                        payload: {
                            current: i + 1,
                            total: total,
                            currentName: icon.name,
                        },
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u5BFC\u51FA\u56FE\u6807 ".concat(icon.name, " \u5931\u8D25:"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, results];
            }
        });
    });
}
// ============================================
// Message Handlers
// ============================================
figma.ui.onmessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = msg.type;
                switch (_a) {
                    case 'load-config': return [3 /*break*/, 1];
                    case 'save-config': return [3 /*break*/, 3];
                    case 'get-icons': return [3 /*break*/, 5];
                    case 'trigger-sync': return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 1: return [4 /*yield*/, handleLoadConfig()
                // 初始化时也更新图标列表
            ];
            case 2:
                _b.sent();
                // 初始化时也更新图标列表
                updateIconsFromSelection();
                return [3 /*break*/, 10];
            case 3: return [4 /*yield*/, handleSaveConfig(msg.payload)];
            case 4:
                _b.sent();
                return [3 /*break*/, 10];
            case 5: return [4 /*yield*/, handleGetIcons()];
            case 6:
                _b.sent();
                return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, handleTriggerSync(msg.payload)];
            case 8:
                _b.sent();
                return [3 /*break*/, 10];
            case 9:
                console.warn('Unknown message type:', msg.type);
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_2 = _b.sent();
                sendToUI({
                    type: 'error',
                    payload: {
                        message: error_2 instanceof Error ? error_2.message : '发生未知错误',
                    },
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
// ============================================
// Config Management
// ============================================
function handleLoadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var savedConfig, autoFileKey, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, figma.clientStorage.getAsync(CONFIG_KEY)];
                case 1:
                    savedConfig = _a.sent();
                    autoFileKey = getFileKey();
                    config = savedConfig
                        ? {
                            githubRepo: savedConfig.githubRepo || '',
                            githubToken: savedConfig.githubToken || '',
                            figmaFileKey: savedConfig.figmaFileKey || autoFileKey,
                            defaultBranch: savedConfig.defaultBranch || 'main',
                        }
                        : {
                            githubRepo: '',
                            githubToken: '',
                            figmaFileKey: autoFileKey !== 'auto-detect-on-sync' ? autoFileKey : '',
                            defaultBranch: 'main',
                        };
                    sendToUI({
                        type: 'config-loaded',
                        payload: config,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function handleSaveConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var repoPath, urlMatch, configToStore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.githubRepo || !config.githubToken) {
                        throw new Error('请填写 GitHub 仓库地址和 Token');
                    }
                    repoPath = config.githubRepo.trim();
                    urlMatch = repoPath.match(/github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/.*)?$/);
                    if (urlMatch) {
                        repoPath = urlMatch[1];
                    }
                    repoPath = repoPath.replace(/\/+$/, '');
                    if (!/^[\w.-]+\/[\w.-]+$/.test(repoPath)) {
                        throw new Error('仓库地址格式错误，请使用 "用户名/仓库名" 格式或完整的 GitHub URL');
                    }
                    config.githubRepo = repoPath;
                    configToStore = {
                        githubRepo: config.githubRepo,
                        githubToken: config.githubToken,
                        defaultBranch: config.defaultBranch || 'main',
                        figmaFileKey: config.figmaFileKey || getFileKey(),
                    };
                    return [4 /*yield*/, figma.clientStorage.setAsync(CONFIG_KEY, configToStore)];
                case 1:
                    _a.sent();
                    sendToUI({
                        type: 'config-loaded',
                        payload: {
                            githubRepo: configToStore.githubRepo,
                            githubToken: configToStore.githubToken,
                            defaultBranch: configToStore.defaultBranch,
                            figmaFileKey: configToStore.figmaFileKey,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================
// Icon Discovery
// ============================================
function handleGetIcons() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 加载所有页面（新版 Figma 需要）
                return [4 /*yield*/, figma.loadAllPagesAsync()
                    // 更新图标列表
                ];
                case 1:
                    // 加载所有页面（新版 Figma 需要）
                    _a.sent();
                    // 更新图标列表
                    updateIconsFromSelection();
                    sendToUI({
                        type: 'icons-loaded',
                        payload: {
                            icons: currentIcons,
                            totalCount: currentIcons.length,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================
// Sync Trigger
// ============================================
function handleTriggerSync(params) {
    return __awaiter(this, void 0, void 0, function () {
        var savedConfig, iconsWithSvg, syncRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, figma.clientStorage.getAsync(CONFIG_KEY)];
                case 1:
                    savedConfig = _a.sent();
                    if (!savedConfig || !savedConfig.githubRepo || !savedConfig.githubToken) {
                        throw new Error('插件未配置，请先填写 GitHub 仓库地址和 Token');
                    }
                    if (currentIcons.length === 0) {
                        throw new Error('没有找到可同步的图标，请选择包含图标的区域');
                    }
                    // 直接在插件中导出 SVG
                    sendToUI({
                        type: 'export-progress',
                        payload: {
                            current: 0,
                            total: currentIcons.length,
                            currentName: '准备导出...',
                        },
                    });
                    return [4 /*yield*/, exportIconsToSvg(currentIcons)];
                case 2:
                    iconsWithSvg = _a.sent();
                    if (iconsWithSvg.length === 0) {
                        throw new Error('导出 SVG 失败，没有成功导出任何图标');
                    }
                    syncRequest = {
                        version: params.version,
                        message: params.message,
                        timestamp: new Date().toISOString(),
                        icons: iconsWithSvg,
                        syncMode: params.syncMode || 'incremental',
                    };
                    sendToUI({
                        type: 'sync-result',
                        payload: {
                            action: 'trigger-github',
                            config: {
                                githubRepo: savedConfig.githubRepo,
                                githubToken: savedConfig.githubToken,
                            },
                            syncRequest: syncRequest,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================
// Utility Functions
// ============================================
function getFileKey() {
    if (figma.fileKey) {
        return figma.fileKey;
    }
    return 'auto-detect-on-sync';
}
function sendToUI(message) {
    figma.ui.postMessage(message);
}
// ============================================
// Plugin Close Handler
// ============================================
figma.on('close', function () {
    // Cleanup if needed
});
