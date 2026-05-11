import { Clock } from 'lucide-react';

interface TimeSliderProps {
  simulatedTime: number; // minutes from midnight, e.g. 570 = 09:30
  onTimeChange: (time: number) => void;
}

export function TimeSlider({ simulatedTime, onTimeChange }: TimeSliderProps) {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Clock size={18} className="text-blue-600" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Simulasi Waktu
        </span>
        <span className="ml-auto text-lg font-bold text-blue-600">
          {formatTime(simulatedTime)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="480" // 08:00
          max="1320" // 22:00
          value={simulatedTime}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>08:00</span>
          <span>22:00</span>
        </div>
      </div>
    </div>
  );
}