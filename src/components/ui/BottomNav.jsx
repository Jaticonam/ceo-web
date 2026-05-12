import {
  LayoutDashboard,
  Bell,
  Settings,
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-1/2
        z-40
        flex
        w-full
        max-w-md
        -translate-x-1/2
        items-center
        justify-around
        border-t
        border-zinc-800
        bg-zinc-950/90
        px-4
        py-4
        backdrop-blur
      "
    >
      
      <button className="flex flex-col items-center gap-1 text-white">
        <LayoutDashboard size={22} />

        <span className="text-[11px] font-medium">
          Dashboard
        </span>
      </button>

      <button className="flex flex-col items-center gap-1 text-zinc-500">
        <Bell size={22} />

        <span className="text-[11px] font-medium">
          Alertas
        </span>
      </button>

      <button className="flex flex-col items-center gap-1 text-zinc-500">
        <Settings size={22} />

        <span className="text-[11px] font-medium">
          Config
        </span>
      </button>

    </nav>
  );
}