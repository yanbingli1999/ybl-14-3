import { Train, StationOrder, DispatchResult, OrderItem, CandyType, OriginId, OriginMismatchDetail, OriginLoad } from '@/types';
import { GAME_CONFIG, ORIGINS } from '@/data/config';
import { getCandyLoad, getCandyLoadByOrigin } from './loadingSystem';

export function calculateDispatchResult(
  train: Train,
  order: StationOrder
): DispatchResult {
  const correctItems: OrderItem[] = [];
  const mismatches: OrderItem[] = [];
  const originMismatches: OriginMismatchDetail[] = [];

  let typeMatchPoints = 0;
  let originMatchPoints = 0;
  let totalRequired = 0;
  let originConstrainedTotal = 0;

  for (const item of order.items) {
    const loaded = getCandyLoad(train, item.candyType);
    totalRequired += item.quantity;

    if (item.requiredOrigin) {
      originConstrainedTotal += item.quantity;
      const loadedFromRequiredOrigin = getCandyLoadByOrigin(train, item.candyType, item.requiredOrigin);
      const carriage = train.carriages.find(c => c.candyType === item.candyType);
      const loadedOrigins = carriage ? [...carriage.originLoads].filter(ol => ol.quantity > 0) : [];

      if (loadedFromRequiredOrigin >= item.quantity) {
        correctItems.push({ ...item });
        typeMatchPoints += item.quantity;
        originMatchPoints += item.quantity;
      } else if (loaded >= item.quantity) {
        correctItems.push({ ...item });
        typeMatchPoints += item.quantity;

        if (loadedFromRequiredOrigin > 0) {
          originMatchPoints += loadedFromRequiredOrigin;
        }

        const missingFromOrigin = item.quantity - loadedFromRequiredOrigin;
        originMismatches.push({
          candyType: item.candyType,
          requiredOrigin: item.requiredOrigin,
          loadedOrigins,
          missing: missingFromOrigin,
        });
        mismatches.push({
          candyType: item.candyType,
          quantity: missingFromOrigin,
          requiredOrigin: item.requiredOrigin,
        });
      } else if (loaded > 0) {
        correctItems.push({ candyType: item.candyType, quantity: loaded, requiredOrigin: item.requiredOrigin });
        typeMatchPoints += loaded;

        if (loadedFromRequiredOrigin > 0) {
          originMatchPoints += loadedFromRequiredOrigin;
        }

        const missingFromOrigin = Math.max(item.quantity - loadedFromRequiredOrigin, 0);
        originMismatches.push({
          candyType: item.candyType,
          requiredOrigin: item.requiredOrigin,
          loadedOrigins,
          missing: missingFromOrigin,
        });

        const typeMissing = item.quantity - loaded;
        if (typeMissing > 0) {
          mismatches.push({ candyType: item.candyType, quantity: typeMissing, requiredOrigin: item.requiredOrigin });
        }
      } else {
        mismatches.push({ ...item });
        originMismatches.push({
          candyType: item.candyType,
          requiredOrigin: item.requiredOrigin,
          loadedOrigins: [],
          missing: item.quantity,
        });
      }
    } else {
      if (loaded >= item.quantity) {
        correctItems.push({ ...item });
        typeMatchPoints += item.quantity;
      } else if (loaded > 0) {
        correctItems.push({ candyType: item.candyType, quantity: loaded, requiredOrigin: null });
        mismatches.push({ candyType: item.candyType, quantity: item.quantity - loaded, requiredOrigin: null });
        typeMatchPoints += loaded;
      } else {
        mismatches.push({ ...item });
      }
    }
  }

  for (const carriage of train.carriages) {
    const inOrder = order.items.find(i => i.candyType === carriage.candyType);
    if (!inOrder && carriage.currentLoad > 0) {
      mismatches.push({ candyType: carriage.candyType, quantity: carriage.currentLoad, requiredOrigin: null });
    }
  }

  const typeMatchRate = totalRequired > 0 ? typeMatchPoints / totalRequired : 0;
  const originMatchRate = originConstrainedTotal > 0 ? originMatchPoints / originConstrainedTotal : 1;
  const overallMatchRate = (typeMatchRate + originMatchRate) / 2;

  const success = overallMatchRate >= 0.8;

  let reward = 0;
  if (success) {
    reward = order.reward;
    if (order.isUrgent) {
      reward += Math.floor(order.reward * GAME_CONFIG.URGENT_BONUS_RATE);
    }
    if (originMatchRate >= 0.95 && originConstrainedTotal > 0) {
      reward += Math.floor(order.reward * 0.1);
    }
  }

  let penalty = 0;
  const totalMismatchCount = mismatches.length + originMismatches.length;
  if (totalMismatchCount > 0) {
    const basePenalty = Math.floor(order.reward * GAME_CONFIG.MISMATCH_PENALTY_RATE);
    penalty = basePenalty * mismatches.length;

    if (originMismatches.length > 0) {
      penalty += Math.floor(basePenalty * originMismatches.length * (GAME_CONFIG.ORIGIN_MISMATCH_PENALTY_MULTIPLIER - 1));
    }

    penalty = Math.min(penalty, order.penalty);
  }

  const reputationChange = success
    ? GAME_CONFIG.REPUTATION_PER_SUCCESS + (originMatchRate >= 0.95 && originConstrainedTotal > 0 ? 2 : 0)
    : GAME_CONFIG.REPUTATION_PER_FAIL;

  return {
    success,
    typeMatchRate,
    originMatchRate,
    overallMatchRate,
    reward,
    penalty,
    mismatches,
    correctItems,
    originMismatches,
    reputationChange,
  };
}

export function canDispatch(train: Train): boolean {
  const totalLoad = train.carriages.reduce((sum, c) => sum + c.currentLoad, 0);
  return totalLoad > 0;
}

export function getMatchColor(matchRate: number): string {
  if (matchRate >= 0.9) return '#6BCB77';
  if (matchRate >= 0.7) return '#FFD93D';
  if (matchRate >= 0.5) return '#FF9F43';
  return '#FF4757';
}
