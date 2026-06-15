import useGameStore from '@/store/useGameStore';
import CandyCell from './CandyCell';
import { BOARD_SIZE } from '@/types';
import { BOARD_REGIONS, ORIGINS } from '@/data/config';

export default function GameBoard() {
  const { board, selectedCandy, selectCandy, isAnimating, gamePhase } = useGameStore();

  const handleCellClick = (row: number, col: number) => {
    if (isAnimating || gamePhase !== 'playing') return;
    selectCandy({ row, col });
  };

  const getCellRegionColor = (row: number, col: number): string | null => {
    for (const region of BOARD_REGIONS) {
      const [rStart, rEnd] = region.rows;
      const [cStart, cEnd] = region.cols;
      if (row >= rStart && row <= rEnd && col >= cStart && col <= cEnd) {
        return ORIGINS[region.originId].color;
      }
    }
    return null;
  };

  return (
    <div className="relative">
      <div
        className="grid gap-1 sm:gap-1.5 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl relative overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          boxShadow: '0 10px 40px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.5)',
        }}
      >
        <div
          className="absolute inset-3 sm:inset-4 grid gap-1 sm:gap-1.5 pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, idx) => {
            const row = Math.floor(idx / BOARD_SIZE);
            const col = idx % BOARD_SIZE;
            const regionColor = getCellRegionColor(row, col);
            return (
              <div
                key={`bg-${row}-${col}`}
                className="rounded-xl"
                style={{
                  backgroundColor: regionColor ? regionColor + '25' : 'transparent',
                }}
              />
            );
          })}
        </div>

        {board.map((row, rowIndex) =>
          row.map((candy, colIndex) => (
            <div key={`wrap-${rowIndex}-${colIndex}`} className="relative z-10">
              <CandyCell
                key={candy?.id || `empty-${rowIndex}-${colIndex}`}
                candy={candy}
                row={rowIndex}
                col={colIndex}
                isSelected={
                  selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                }
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {BOARD_REGIONS.map((region) => {
          const origin = ORIGINS[region.originId];
          return (
            <div
              key={region.originId}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm"
              style={{ color: origin.badgeColor }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: origin.color }}
              />
              {origin.name}
            </div>
          );
        })}
      </div>

      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-600 shadow-lg border-4 border-amber-200" />
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-600 shadow-lg border-4 border-amber-200" />
      <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-amber-600 shadow-lg border-4 border-amber-200" />
      <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-amber-600 shadow-lg border-4 border-amber-200" />
    </div>
  );
}
