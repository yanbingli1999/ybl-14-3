import { Train, Carriage, CandyType, OriginId, OriginLoad } from '@/types';
import { GAME_CONFIG, ORIGINS } from '@/data/config';
import { ClearedCandyInfo } from './matchEngine';

export function loadCandiesToTrain(train: Train, candyInfo: ClearedCandyInfo): {
  train: Train;
  overflow: Record<CandyType, number>;
  totalLoaded: number;
} {
  const newCarriages = train.carriages.map(c => ({
    ...c,
    originLoads: c.originLoads.map(ol => ({ ...ol })),
  }));
  const overflow: Record<string, number> = {};
  let totalLoaded = 0;
  const { totalByType, byTypeAndOrigin } = candyInfo;

  for (const candyType of Object.keys(totalByType) as CandyType[]) {
    const count = totalByType[candyType];
    const carriage = newCarriages.find(c => c.candyType === candyType);

    if (carriage) {
      const availableSpace = carriage.capacity - carriage.currentLoad;
      const toLoad = Math.min(count, availableSpace);
      carriage.currentLoad += toLoad;
      totalLoaded += toLoad;

      if (count > availableSpace) {
        overflow[candyType] = count - availableSpace;
      }

      if (toLoad > 0) {
        const originIds = Object.keys(ORIGINS) as OriginId[];
        let remainingToLoad = toLoad;

        for (const originId of originIds) {
          const key = `${candyType}-${originId}`;
          const originCount = byTypeAndOrigin[key] || 0;
          if (originCount > 0 && remainingToLoad > 0) {
            const loadFromOrigin = Math.min(originCount, remainingToLoad);
            const originLoadEntry = carriage.originLoads.find(ol => ol.originId === originId);
            if (originLoadEntry) {
              originLoadEntry.quantity += loadFromOrigin;
            }
            remainingToLoad -= loadFromOrigin;
          }
        }
      }
    } else {
      overflow[candyType] = count;
    }
  }

  return {
    train: { ...train, carriages: newCarriages },
    overflow: overflow as Record<CandyType, number>,
    totalLoaded,
  };
}

export function getLoadPercentage(carriage: Carriage): number {
  if (carriage.capacity === 0) return 0;
  return (carriage.currentLoad / carriage.capacity) * 100;
}

export function getTotalLoad(train: Train): number {
  return train.carriages.reduce((sum, c) => sum + c.currentLoad, 0);
}

export function getTotalCapacity(train: Train): number {
  return train.carriages.reduce((sum, c) => sum + c.capacity, 0);
}

export function isTrainFull(train: Train): boolean {
  return train.carriages.every(c => c.currentLoad >= c.capacity);
}

export function getTrainLoadPercentage(train: Train): number {
  const totalLoad = getTotalLoad(train);
  const totalCapacity = getTotalCapacity(train);
  if (totalCapacity === 0) return 0;
  return (totalLoad / totalCapacity) * 100;
}

function createEmptyOriginLoads(): OriginLoad[] {
  return (Object.keys(ORIGINS) as OriginId[]).map(originId => ({
    originId,
    quantity: 0,
  }));
}

export function clearTrain(train: Train): Train {
  return {
    ...train,
    carriages: train.carriages.map(c => ({
      ...c,
      currentLoad: 0,
      originLoads: createEmptyOriginLoads(),
    })),
  };
}

export function getCandyLoad(train: Train, candyType: CandyType): number {
  const carriage = train.carriages.find(c => c.candyType === candyType);
  return carriage?.currentLoad || 0;
}

export function getCandyLoadByOrigin(
  train: Train,
  candyType: CandyType,
  originId: OriginId
): number {
  const carriage = train.carriages.find(c => c.candyType === candyType);
  if (!carriage) return 0;
  const originLoad = carriage.originLoads.find(ol => ol.originId === originId);
  return originLoad?.quantity || 0;
}

export function getCarriageOriginBreakdown(carriage: Carriage): OriginLoad[] {
  return carriage.originLoads.filter(ol => ol.quantity > 0);
}
