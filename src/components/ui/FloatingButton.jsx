import { Plus } from "lucide-react";

export default function FloatingButton() {
  return (
    <button
      className="
        fixed
        bottom-24
        left-1/2
        z-50
        flex
        h-16
        w-16
        -translate-x-1/2
        items-center
        justify-center
        rounded-full
        bg-white
        text-black
        shadow-2xl
        transition-all
        hover:scale-105
        active:scale-95
      "
    >
      <Plus size={28} />
    </button>
  );
}