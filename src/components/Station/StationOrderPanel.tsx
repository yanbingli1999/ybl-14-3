import useGameStore from '@/store/useGameStore';
import { CANDY_CONFIG, STATIONS, ORIGINS } from '@/data/config';
import { getCandyLoad, getCandyLoadByOrigin } from '@/engine/loadingSystem';
import { MapPin, Flame, Coins, AlertTriangle, Factory } from 'lucide-react';

export default function StationOrderPanel() {
  const { currentOrder, train, currentStationId, profile, changeStation } = useGameStore();

  if (!currentOrder) return null;

  const station = STATIONS.find(s => s.id === currentStationId);
  const availableStations = STATIONS.filter(
    s => s.reputationRequired <= profile.reputation
  );

  return (
    <div
      className="rounded-2xl p-4 shadow-lg border-2"
      style={{
        background: `linear-gradient(135deg, ${station?.themeColor}15, ${station?.themeColor}05)`,
        borderColor: station?.themeColor + '40',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5" style={{ color: station?.themeColor }} />
        <h3 className="text-lg font-bold text-gray-800">{station?.name}</h3>
        {currentOrder.isUrgent && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            <Flame className="w-3 h-3" />
            急单
          </span>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">订单需求</h4>
        <div className="space-y-2">
          {currentOrder.items.map((item, index) => {
            const config = CANDY_CONFIG[item.candyType];
            const loaded = getCandyLoad(train, item.candyType);

            let originLoaded = 0;
            let originProgress = 0;
            let originComplete = false;
            if (item.requiredOrigin) {
              originLoaded = getCandyLoadByOrigin(train, item.candyType, item.requiredOrigin);
              originProgress = Math.min((originLoaded / item.quantity) * 100, 100);
              originComplete = originLoaded >= item.quantity;
            }

            const progress = item.requiredOrigin
              ? originProgress
              : Math.min((loaded / item.quantity) * 100, 100);
            const isComplete = item.requiredOrigin
              ? originComplete
              : loaded >= item.quantity;

            const displayLoaded = item.requiredOrigin ? originLoaded : loaded;
            const originInfo = item.requiredOrigin ? ORIGINS[item.requiredOrigin] : null;

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{config.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <div className="font-medium text-gray-700 flex items-center gap-1">
                        {config.name}
                        {originInfo && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white ml-1"
                            style={{ backgroundColor: originInfo.badgeColor }}
                            title={`必须来自${originInfo.name}`}
                          >
                            <Factory className="w-2.5 h-2.5" />
                            {originInfo.shortName}
                          </span>
                        )}
                      </div>
                      <span className={isComplete ? 'text-green-600 font-bold' : 'text-gray-500'}>
                        {displayLoaded}/{item.quantity}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: isComplete ? '#6BCB77' : config.color,
                        }}
                      />
                    </div>
                  </div>
                  {isComplete && <span className="text-green-500">✓</span>}
                </div>

                {originInfo && !originComplete && loaded > 0 && originLoaded < loaded && (
                  <div className="ml-9 text-[10px] text-orange-600 bg-orange-50 rounded px-2 py-0.5">
                    ⚠️ 已装车{loaded}个，但仅{originLoaded}个来自{originInfo.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-yellow-600">
          <Coins className="w-4 h-4" />
          <span className="font-bold">
            +{currentOrder.reward}
            {currentOrder.isUrgent && (
              <span className="text-red-500 ml-1">(+{currentOrder.urgentBonus} 加急)</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <AlertTriangle className="w-4 h-4" />
          <span>罚金 -{currentOrder.penalty}</span>
        </div>
      </div>

      {availableStations.length > 1 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">切换车站</h4>
          <div className="flex gap-2 flex-wrap">
            {availableStations.map(s => (
              <button
                key={s.id}
                onClick={() => changeStation(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${s.id === currentStationId
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                style={
                  s.id === currentStationId
                    ? { backgroundColor: s.themeColor }
                    : {}
                }
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
