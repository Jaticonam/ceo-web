import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "../../utils/dates";

export default function MonthNavigator({ currentMonth, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center py-2">
      <button
        onClick={onPrev}
        className="rounded-full p-2 text-[#6a1b9a] transition-colors hover:bg-purple-50"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="mx-2 min-w-[140px] rounded-full border border-[#6a1b9a] px-6 py-1.5 text-center text-sm font-bold text-[#6a1b9a]">
        {formatMonthYear(currentMonth)}
      </span>

      <button
        onClick={onNext}
        className="rounded-full p-2 text-[#6a1b9a] transition-colors hover:bg-purple-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}