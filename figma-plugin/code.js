"use strict";
/// <reference types="@figma/plugin-typings" />
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
var UI_HEIGHT = 500;
// ============================================
// Plugin Initialization
// ============================================
figma.showUI(__html__, {
    width: UI_WIDTH,
    height: UI_HEIGHT,
    title: 'Icon Sync to GitHub',
});
// ============================================
// Message Handlers
// ============================================
figma.ui.onmessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_1;
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
            case 1: return [4 /*yield*/, handleLoadConfig()];
            case 2:
                _b.sent();
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
                error_1 = _b.sent();
                sendToUI({
                    type: 'error',
                    payload: {
                        message: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
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
                    // Validate required fields
                    if (!config.githubRepo || !config.githubToken) {
                        throw new Error('GitHub repository and token are required');
                    }
                    repoPath = config.githubRepo.trim();
                    urlMatch = repoPath.match(/github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/.*)?$/);
                    if (urlMatch) {
                        repoPath = urlMatch[1];
                    }
                    // Remove trailing slashes
                    repoPath = repoPath.replace(/\/+$/, '');
                    // Validate repository format (org/repo)
                    if (!/^[\w.-]+\/[\w.-]+$/.test(repoPath)) {
                        throw new Error('Repository must be in format "org/repo" or a valid GitHub URL');
                    }
                    // Update config with normalized repo path
                    config.githubRepo = repoPath;
                    configToStore = {
                        githubRepo: config.githubRepo,
                        githubToken: config.githubToken,
                        defaultBranch: config.defaultBranch || 'main',
                        figmaFileKey: config.figmaFileKey || getFileKey(),
                    };
                    return [4 /*yield*/, figma.clientStorage.setAsync(CONFIG_KEY, configToStore)
                        // Send back the full config to UI so it knows configuration is complete
                    ];
                case 1:
                    _a.sent();
                    // Send back the full config to UI so it knows configuration is complete
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
        var icons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Load all pages first (required for findAllWithCriteria in newer Figma versions)
                return [4 /*yield*/, figma.loadAllPagesAsync()];
                case 1:
                    // Load all pages first (required for findAllWithCriteria in newer Figma versions)
                    _a.sent();
                    icons = findIconComponents();
                    sendToUI({
                        type: 'icons-loaded',
                        payload: {
                            icons: icons,
                            totalCount: icons.length,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Find all icon components in the current Figma file
 * Icons are identified by:
 * - Components with "icon" in the name (case-insensitive)
 * - Components starting with "ic-" or "ic_"
 * - Components in frames/pages named "Icons" or "icons"
 */
function findIconComponents() {
    var e_1, _a;
    var icons = [];
    var components = figma.root.findAllWithCriteria({
        types: ['COMPONENT'],
    });
    try {
        for (var components_1 = __values(components), components_1_1 = components_1.next(); !components_1_1.done; components_1_1 = components_1.next()) {
            var component = components_1_1.value;
            if (isIconComponent(component)) {
                icons.push({
                    id: component.id,
                    name: component.name,
                    width: Math.round(component.width),
                    height: Math.round(component.height),
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (components_1_1 && !components_1_1.done && (_a = components_1.return)) _a.call(components_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Sort icons alphabetically by name
    icons.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return icons;
}
/**
 * Determine if a component is an icon based on naming conventions
 */
function isIconComponent(component) {
    var name = component.name.toLowerCase();
    // Check component name patterns
    if (name.includes('icon') ||
        name.startsWith('ic-') ||
        name.startsWith('ic_') ||
        name.startsWith('ic/')) {
        return true;
    }
    // Check if component is inside an "icons" frame or page
    var parent = component.parent;
    while (parent) {
        if (parent.type === 'FRAME' || parent.type === 'PAGE') {
            var parentName = parent.name.toLowerCase();
            if (parentName === 'icons' || parentName.includes('icon')) {
                return true;
            }
        }
        parent = parent.parent;
    }
    return false;
}
// ============================================
// Sync Trigger
// ============================================
function handleTriggerSync(params) {
    return __awaiter(this, void 0, void 0, function () {
        var savedConfig, syncRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, figma.clientStorage.getAsync(CONFIG_KEY)];
                case 1:
                    savedConfig = _a.sent();
                    if (!savedConfig || !savedConfig.githubRepo || !savedConfig.githubToken) {
                        throw new Error('Plugin not configured. Please enter GitHub repository and token.');
                    }
                    if (!savedConfig.figmaFileKey ||
                        savedConfig.figmaFileKey === 'auto-detect-on-sync') {
                        throw new Error('Figma File Key is required. Please enter it in Settings.');
                    }
                    syncRequest = {
                        version: params.version,
                        message: params.message,
                        fileKey: savedConfig.figmaFileKey,
                        timestamp: new Date().toISOString(),
                    };
                    // The actual GitHub API call will be made from the UI
                    // because Figma's sandbox has limited network access
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
    // Extract file key from the current document
    // figma.fileKey is available in Figma desktop app
    // It may be null in some contexts (e.g., when file is not saved)
    if (figma.fileKey) {
        return figma.fileKey;
    }
    // Try to get from root name as fallback (not ideal but better than unknown)
    // The file key is typically in the URL: figma.com/file/{fileKey}/...
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
