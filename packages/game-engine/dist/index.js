"use strict";
// ============================================
// @ludo-nexus/game-engine - Main Export
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
exports.getLegalMoves = exports.BotAI = exports.GameEngineUtils = void 0;
__exportStar(require("./engine/gameEngine"), exports);
__exportStar(require("./bot/botAI"), exports);
__exportStar(require("./constants"), exports);
// Re-export to resolve ambiguity
var gameEngine_1 = require("./engine/gameEngine");
Object.defineProperty(exports, "GameEngineUtils", { enumerable: true, get: function () { return gameEngine_1.GameEngineUtils; } });
var botAI_1 = require("./bot/botAI");
Object.defineProperty(exports, "BotAI", { enumerable: true, get: function () { return botAI_1.BotAI; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "getLegalMoves", { enumerable: true, get: function () { return constants_1.getLegalMoves; } });
