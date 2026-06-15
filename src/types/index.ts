export type CandyType =
  | 'strawberry'
  | 'lemon'
  | 'mint'
  | 'blueberry'
  | 'grape'
  | 'rainbow'
  | 'bomb';

export type SpecialCandyType = 'rainbow' | 'bomb' | null;

export type OriginId = 'candy-town' | 'lemon-estate' | 'mint-forest' | 'blueberry-port' | 'grape-castle';

export interface Origin {
  id: OriginId;
  name: string;
  shortName: string;
  color: string;
  badgeColor: string;
}

export interface BoardRegion {
  originId: OriginId;
  rows: [number, number];
  cols: [number, number];
}

export interface Candy {
  id: string;
  type: CandyType;
  row: number;
  col: number;
  isSpecial: boolean;
  specialType: SpecialCandyType;
  isMatched: boolean;
  isFalling: boolean;
  origin: OriginId;
}

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  candies: Candy[];
  positions: Position[];
  matchType: 'horizontal' | 'vertical' | 'both' | 'special';
  specialGenerated: SpecialCandyType;
  specialPosition: Position | null;
}

export interface OriginLoad {
  originId: OriginId;
  quantity: number;
}

export interface Carriage {
  id: string;
  candyType: CandyType;
  capacity: number;
  currentLoad: number;
  originLoads: OriginLoad[];
}

export interface Train {
  id: string;
  name: string;
  carriages: Carriage[];
}

export interface OrderItem {
  candyType: CandyType;
  quantity: number;
  requiredOrigin: OriginId | null;
}

export interface StationOrder {
  id: string;
  stationId: string;
  stationName: string;
  items: OrderItem[];
  reward: number;
  penalty: number;
  isUrgent: boolean;
  urgentBonus: number;
}

export interface Station {
  id: string;
  name: string;
  reputationRequired: number;
  themeColor: string;
  description: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  coins: number;
  reputation: number;
  level: number;
  unlockedStations: string[];
}

export interface OriginMismatchDetail {
  candyType: CandyType;
  requiredOrigin: OriginId | null;
  loadedOrigins: OriginLoad[];
  missing: number;
}

export interface DispatchResult {
  success: boolean;
  typeMatchRate: number;
  originMatchRate: number;
  overallMatchRate: number;
  reward: number;
  penalty: number;
  mismatches: OrderItem[];
  correctItems: OrderItem[];
  originMismatches: OriginMismatchDetail[];
  reputationChange: number;
}

export interface StatsStep {
  id: string;
  date: string;
  totalMoves: number;
  bestMoves: number;
  gamesPlayed: number;
}

export interface StatsCombo {
  id: string;
  date: string;
  totalCombos: number;
  maxCombo: number;
  avgCombo: number;
}

export interface StatsMismatch {
  id: string;
  date: string;
  mismatchCount: number;
  totalPenalty: number;
  dispatches: number;
}

export interface StatsUrgent {
  id: string;
  date: string;
  urgentCount: number;
  successCount: number;
  successRate: number;
}

export interface StatsReputation {
  id: string;
  date: string;
  reputation: number;
  changeAmount: number;
}

export interface AllStats {
  steps: StatsStep[];
  combos: StatsCombo[];
  mismatches: StatsMismatch[];
  urgents: StatsUrgent[];
  reputations: StatsReputation[];
}

export const BOARD_SIZE = 8;
export const BASIC_CANDY_TYPES: CandyType[] = ['strawberry', 'lemon', 'mint', 'blueberry', 'grape'];
