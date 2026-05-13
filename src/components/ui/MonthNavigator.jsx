import { ChevronLeft, ChevronRight } from "lucide-react";

const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function MonthNavigator({ currentMonth, onPrev, onNext }) {
  return (
    <div className="flex justify-center items-center py-2">
      <button
        onClick={onPrev}
        className="p-2 text-[#6a1b9a] hover:bg-purple-50 rounded-full transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="px-6 py-1.5 border border-[#6a1b9a] text-[#6a1b9a] rounded-full text-sm font-bold mx-2 min-w-[140px] text-center">
        {formatMonthYear(currentMonth)}
      </span>

      <button
        onClick={onNext}
        className="p-2 text-[#6a1b9a] hover:bg-purple-50 rounded-full transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}