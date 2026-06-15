import { CandyType, Station, Train, BOARD_SIZE, Origin, BoardRegion, OriginId } from '@/types';

export const CANDY_CONFIG: Record<CandyType, { name: string; color: string; points: number; emoji: string }> = {
  strawberry: { name: '草莓糖', color: '#FF6B9D', points: 10, emoji: '🍓' },
  lemon: { name: '柠檬糖', color: '#FFD93D', points: 10, emoji: '🍋' },
  mint: { name: '薄荷糖', color: '#6BCB77', points: 10, emoji: '🍀' },
  blueberry: { name: '蓝莓糖', color: '#4D96FF', points: 10, emoji: '🫐' },
  grape: { name: '葡萄糖', color: '#9B59B6', points: 10, emoji: '🍇' },
  rainbow: { name: '彩虹糖', color: 'linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #9B59B6)', points: 50, emoji: '🌈' },
  bomb: { name: '炸弹糖', color: '#FF4757', points: 30, emoji: '💣' },
};

export const ORIGINS: Record<OriginId, Origin> = {
  'candy-town': {
    id: 'candy-town',
    name: '糖果小镇',
    shortName: '糖镇',
    color: '#FF6B9D',
    badgeColor: '#FF6B9D',
  },
  'lemon-estate': {
    id: 'lemon-estate',
    name: '柠檬庄园',
    shortName: '柠檬',
    color: '#FFD93D',
    badgeColor: '#E6B800',
  },
  'mint-forest': {
    id: 'mint-forest',
    name: '薄荷森林',
    shortName: '薄荷',
    color: '#6BCB77',
    badgeColor: '#4CAF50',
  },
  'blueberry-port': {
    id: 'blueberry-port',
    name: '蓝莓港口',
    shortName: '港口',
    color: '#4D96FF',
    badgeColor: '#2979FF',
  },
  'grape-castle': {
    id: 'grape-castle',
    name: '葡萄城堡',
    shortName: '城堡',
    color: '#9B59B6',
    badgeColor: '#7B1FA2',
  },
};

export const BOARD_REGIONS: BoardRegion[] = [
  { originId: 'candy-town', rows: [0, 3], cols: [0, 3] },
  { originId: 'lemon-estate', rows: [0, 3], cols: [4, 7] },
  { originId: 'mint-forest', rows: [4, 5], cols: [0, 7] },
  { originId: 'blueberry-port', rows: [6, 7], cols: [0, 3] },
  { originId: 'grape-castle', rows: [6, 7], cols: [4, 7] },
];

export function getOriginForCell(row: number, col: number): OriginId {
  for (const region of BOARD_REGIONS) {
    const [rStart, rEnd] = region.rows;
    const [cStart, cEnd] = region.cols;
    if (row >= rStart && row <= rEnd && col >= cStart && col <= cEnd) {
      return region.originId;
    }
  }
  return 'candy-town';
}

export const STATIONS: Station[] = [
  {
    id: 'candy-town',
    name: '糖果小镇',
    reputationRequired: 0,
    themeColor: '#FF6B9D',
    description: '甜蜜的起点，适合新手列车长',
  },
  {
    id: 'lemon-estate',
    name: '柠檬庄园',
    reputationRequired: 100,
    themeColor: '#FFD93D',
    description: '酸爽的柠檬订单，需要更多技巧',
  },
  {
    id: 'mint-forest',
    name: '薄荷森林',
    reputationRequired: 300,
    themeColor: '#6BCB77',
    description: '急单频发的森林车站',
  },
  {
    id: 'blueberry-port',
    name: '蓝莓港口',
    reputationRequired: 600,
    themeColor: '#4D96FF',
    description: '大额订单的港口贸易站',
  },
  {
    id: 'grape-castle',
    name: '葡萄城堡',
    reputationRequired: 1000,
    themeColor: '#9B59B6',
    description: '皇家级别的复杂订单',
  },
];

function createEmptyOriginLoads() {
  return (Object.keys(ORIGINS) as OriginId[]).map(originId => ({
    originId,
    quantity: 0,
  }));
}

export const INITIAL_TRAIN: Train = {
  id: 'candy-express',
  name: '糖果快车',
  carriages: [
    { id: 'car-1', candyType: 'strawberry', capacity: 20, currentLoad: 0, originLoads: createEmptyOriginLoads() },
    { id: 'car-2', candyType: 'lemon', capacity: 20, currentLoad: 0, originLoads: createEmptyOriginLoads() },
    { id: 'car-3', candyType: 'mint', capacity: 20, currentLoad: 0, originLoads: createEmptyOriginLoads() },
    { id: 'car-4', candyType: 'blueberry', capacity: 20, currentLoad: 0, originLoads: createEmptyOriginLoads() },
    { id: 'car-5', candyType: 'grape', capacity: 20, currentLoad: 0, originLoads: createEmptyOriginLoads() },
  ],
};

export const GAME_CONFIG = {
  BOARD_SIZE,
  INITIAL_MOVES: 30,
  COMBO_BONUS_MULTIPLIER: 0.5,
  MATCH_MIN: 3,
  FOUR_MATCH_SPECIAL: 'bomb' as const,
  FIVE_MATCH_SPECIAL: 'rainbow' as const,
  DISPATCH_BASE_REWARD: 50,
  MISMATCH_PENALTY_RATE: 0.3,
  URGENT_BONUS_RATE: 0.5,
  REPUTATION_PER_SUCCESS: 10,
  REPUTATION_PER_FAIL: -5,
  LOAD_PER_MATCH: 1,
  ORIGIN_MISMATCH_PENALTY_MULTIPLIER: 1.5,
};
