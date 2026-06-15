import { Carriage } from '@/types';
import { CANDY_CONFIG, ORIGINS } from '@/data/config';
import { getLoadPercentage } from '@/engine/loadingSystem';
import { useState } from 'react';

interface CarriageCardProps {
  carriage: Carriage;
}

export default function CarriageCard({ carriage }: CarriageCardProps) {
  const config = CANDY_CONFIG[carriage.candyType];
  const loadPercent = getLoadPercentage(carriage);
  const isFull = loadPercent >= 100;
  const safeOriginLoads = carriage.originLoads || [];
  const originBreakdown = safeOriginLoads.filter(ol => ol && ol.quantity > 0);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center p-2 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-md border-2 border-gray-300 min-w-[70px] sm:min-w-[80px] cursor-pointer transition-transform hover:scale-105"
      style={{
        borderColor: config.color + '40',
      }}
      onClick={() => carriage.currentLoad > 0 && setShowDetail(!showDetail)}
      title={carriage.currentLoad > 0 ? '点击查看产地明细' : ''}
    >
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400"
        style={{ backgroundColor: config.color }}
      />
      <div
        className="absolute -top-1 left-1/4 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <div
        className="absolute -top-1 right-1/4 translate-x-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: config.color }}
      />

      <div className="text-2xl sm:text-3xl mb-1">{config.emoji}</div>

      <div className="text-xs font-bold text-gray-700 mb-1">
        {carriage.currentLoad}/{carriage.capacity}
      </div>

      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(loadPercent, 100)}%`,
            backgroundColor: config.color,
            boxShadow: isFull ? `0 0 8px ${config.color}` : 'none',
          }}
        />
      </div>

      {originBreakdown.length > 0 && (
        <div className="w-full mt-1.5 flex flex-wrap gap-0.5 justify-center">
          {originBreakdown.slice(0, 3).map(ol => {
            const originKey = ol.originId as keyof typeof ORIGINS;
            const originConfig = ORIGINS[originKey] || ORIGINS['candy-town'];
            return (
              <div
                key={ol.originId}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: originConfig.color }}
                title={`${originConfig.name}: ${ol.quantity}个`}
              />
            );
          })}
          {originBreakdown.length > 3 && (
            <span className="text-[8px] text-gray-500">+{originBreakdown.length - 3}</span>
          )}
        </div>
      )}

      {showDetail && originBreakdown.length > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-20 mt-1 bg-white rounded-lg shadow-xl p-2 border border-gray-200 whitespace-nowrap">
          <div className="text-[10px] font-bold text-gray-600 mb-1 border-b pb-1">产地明细</div>
          {originBreakdown.map(ol => {
            const originKey = ol.originId as keyof typeof ORIGINS;
            const originConfig = ORIGINS[originKey] || ORIGINS['candy-town'];
            return (
              <div key={ol.originId} className="flex items-center gap-1 text-[10px] py-0.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: originConfig.color }}
                />
                <span className="text-gray-700">{originConfig.name}</span>
                <span className="font-bold text-gray-900 ml-auto">{ol.quantity}</span>
              </div>
            );
          })}
        </div>
      )}

      {isFull && (
        <div className="absolute -top-2 -right-2 text-lg animate-bounce">✨</div>
      )}
    </div>
  );
}
