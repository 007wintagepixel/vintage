"use strict";
// ============================================
// @ludo-nexus/shared-types - Main Export
// ============================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = void 0;
// Game types
__exportStar(require("./game/types"), exports);
// Auth types
__exportStar(require("./auth/types"), exports);
// User types
__exportStar(require("./user/types"), exports);
// Wallet types
__exportStar(require("./wallet/types"), exports);
// Room types
__exportStar(require("./room/types"), exports);
// Chat types
__exportStar(require("./chat/types"), exports);
// Friend types
__exportStar(require("./friend/types"), exports);
// Admin types
__exportStar(require("./admin/types"), exports);
// Re-export Zod for consumers
var zod_1 = require("zod");
Object.defineProperty(exports, "z", { enumerable: true, get: function () { return zod_1.z; } });
