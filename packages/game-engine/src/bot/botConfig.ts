import type { BotDifficulty } from '../index';

// ============================================
// Bot Difficulty Configuration
// ============================================

export interface BotWeights {
  // Easy bot doesn't use weights
  easy: Record<string, never>;

  // Medium bot weights
  medium: {
    exitHome: number;
    enterHomeLane: number;
    finishToken: number;
    capture: number;
    safeCell: number;
    avoidDanger: number;
    helpLagging: number;
    randomFactor: number;
  };

  // Hard bot weights
  hard: {
    exitHome: number;
    enterHomeLane: number;
    finishToken: number;
    capture: number;
    safeCell: number;
    avoidDanger: number;
    blockOpponent: number;
    advanceLeading: number;
    helpLagging: number;
    extraTurnValue: number;
  };
}

// Partial weights for config overrides
export interface PartialBotWeights {
  easy?: Record<string, never>;
  medium?: Partial<BotWeights['medium']>;
  hard?: Partial<BotWeights['hard']>;
}

export interface BotConfig {
  weights: BotWeights;
  // Global settings
  enableRandomness: boolean;
  randomSeed?: number;
}

// Partial config for overrides
export interface PartialBotConfig {
  weights?: PartialBotWeights;
  enableRandomness?: boolean;
  randomSeed?: number;
}

// Default configuration
export const DEFAULT_BOT_CONFIG: BotConfig = {
  weights: {
    easy: {},

    medium: {
      exitHome: 100,
      enterHomeLane: 80,
      finishToken: 150,
      capture: 90,
      safeCell: 30,
      avoidDanger: 20,
      helpLagging: 10,
      randomFactor: 5,
    },

    hard: {
      exitHome: 200,
      enterHomeLane: 150,
      finishToken: 300,
      capture: 250,
      safeCell: 50,
      avoidDanger: 80,
      blockOpponent: 100,
      advanceLeading: 30,
      helpLagging: 40,
      extraTurnValue: 120,
    },
  },
  enableRandomness: true,
};

// Load configuration from environment variables
export function loadBotConfigFromEnv(): PartialBotConfig {
  const config: PartialBotConfig = { weights: { easy: {}, medium: {}, hard: {} } };

  // Global settings
  if (process.env.BOT_ENABLE_RANDOMNESS !== undefined) {
    config.enableRandomness = process.env.BOT_ENABLE_RANDOMNESS === 'true';
  }
  if (process.env.BOT_RANDOM_SEED !== undefined) {
    config.randomSeed = parseInt(process.env.BOT_RANDOM_SEED, 10);
  }

  // Medium weights
  const mediumWeights = config.weights!.medium!;
  if (process.env.BOT_MEDIUM_EXIT_HOME) mediumWeights.exitHome = parseInt(process.env.BOT_MEDIUM_EXIT_HOME, 10);
  if (process.env.BOT_MEDIUM_ENTER_HOME_LANE) mediumWeights.enterHomeLane = parseInt(process.env.BOT_MEDIUM_ENTER_HOME_LANE, 10);
  if (process.env.BOT_MEDIUM_FINISH_TOKEN) mediumWeights.finishToken = parseInt(process.env.BOT_MEDIUM_FINISH_TOKEN, 10);
  if (process.env.BOT_MEDIUM_CAPTURE) mediumWeights.capture = parseInt(process.env.BOT_MEDIUM_CAPTURE, 10);
  if (process.env.BOT_MEDIUM_SAFE_CELL) mediumWeights.safeCell = parseInt(process.env.BOT_MEDIUM_SAFE_CELL, 10);
  if (process.env.BOT_MEDIUM_AVOID_DANGER) mediumWeights.avoidDanger = parseInt(process.env.BOT_MEDIUM_AVOID_DANGER, 10);
  if (process.env.BOT_MEDIUM_HELP_LAGGING) mediumWeights.helpLagging = parseInt(process.env.BOT_MEDIUM_HELP_LAGGING, 10);
  if (process.env.BOT_MEDIUM_RANDOM_FACTOR) mediumWeights.randomFactor = parseFloat(process.env.BOT_MEDIUM_RANDOM_FACTOR);

  // Hard weights
  const hardWeights = config.weights!.hard!;
  if (process.env.BOT_HARD_EXIT_HOME) hardWeights.exitHome = parseInt(process.env.BOT_HARD_EXIT_HOME, 10);
  if (process.env.BOT_HARD_ENTER_HOME_LANE) hardWeights.enterHomeLane = parseInt(process.env.BOT_HARD_ENTER_HOME_LANE, 10);
  if (process.env.BOT_HARD_FINISH_TOKEN) hardWeights.finishToken = parseInt(process.env.BOT_HARD_FINISH_TOKEN, 10);
  if (process.env.BOT_HARD_CAPTURE) hardWeights.capture = parseInt(process.env.BOT_HARD_CAPTURE, 10);
  if (process.env.BOT_HARD_SAFE_CELL) hardWeights.safeCell = parseInt(process.env.BOT_HARD_SAFE_CELL, 10);
  if (process.env.BOT_HARD_AVOID_DANGER) hardWeights.avoidDanger = parseInt(process.env.BOT_HARD_AVOID_DANGER, 10);
  if (process.env.BOT_HARD_BLOCK_OPPONENT) hardWeights.blockOpponent = parseInt(process.env.BOT_HARD_BLOCK_OPPONENT, 10);
  if (process.env.BOT_HARD_ADVANCE_LEADING) hardWeights.advanceLeading = parseInt(process.env.BOT_HARD_ADVANCE_LEADING, 10);
  if (process.env.BOT_HARD_HELP_LAGGING) hardWeights.helpLagging = parseInt(process.env.BOT_HARD_HELP_LAGGING, 10);
  if (process.env.BOT_HARD_EXTRA_TURN_VALUE) hardWeights.extraTurnValue = parseInt(process.env.BOT_HARD_EXTRA_TURN_VALUE, 10);

  return config;
}

// Merge configs (env overrides defaults)
export function mergeBotConfig(defaultConfig: BotConfig, overrideConfig: PartialBotConfig): BotConfig {
  return {
    ...defaultConfig,
    enableRandomness: overrideConfig.enableRandomness ?? defaultConfig.enableRandomness,
    randomSeed: overrideConfig.randomSeed ?? defaultConfig.randomSeed,
    weights: {
      easy: defaultConfig.weights.easy,
      medium: {
        ...defaultConfig.weights.medium,
        ...overrideConfig.weights?.medium,
      },
      hard: {
        ...defaultConfig.weights.hard,
        ...overrideConfig.weights?.hard,
      },
    },
  };
}

// Get final configuration
let cachedConfig: BotConfig | null = null;

export function getBotConfig(): BotConfig {
  if (cachedConfig) return cachedConfig;

  const envConfig = loadBotConfigFromEnv();
  cachedConfig = mergeBotConfig(DEFAULT_BOT_CONFIG, envConfig);
  return cachedConfig;
}

// Reset cache (useful for testing)
export function resetBotConfig(): void {
  cachedConfig = null;
}

// Difficulty presets for quick setup
export const DIFFICULTY_PRESETS: Record<BotDifficulty, PartialBotConfig> = {
  easy: {},
  medium: {
    weights: {
      medium: {
        exitHome: 120,
        enterHomeLane: 100,
        finishToken: 180,
        capture: 110,
        safeCell: 40,
        avoidDanger: 25,
        helpLagging: 15,
        randomFactor: 3,
      },
    },
  },
  hard: {
    weights: {
      hard: {
        exitHome: 250,
        enterHomeLane: 200,
        finishToken: 350,
        capture: 300,
        safeCell: 70,
        avoidDanger: 100,
        blockOpponent: 130,
        advanceLeading: 40,
        helpLagging: 50,
        extraTurnValue: 150,
      },
    },
  },
};

export function getConfigForDifficulty(difficulty: BotDifficulty): BotConfig {
  const baseConfig = getBotConfig();
  const preset = DIFFICULTY_PRESETS[difficulty];
  return mergeBotConfig(baseConfig, preset);
}