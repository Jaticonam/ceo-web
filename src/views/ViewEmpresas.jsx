import Card from "../components/ui/Card";
import { Store } from "lucide-react";

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export default function ViewEmpresas({ byBrand, iconGallery }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
        estado histórico por marcas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(byBrand).map(([brandName, data]) => {
          const Icon = iconGallery[data.icon] || Store;

          return (
            <Card
              key={brandName}
              className="group hover:border-blue-200 transition-colors relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${data.color} opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`}
              />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-black text-slate-800 flex items-center capitalize">
                  <div
                    className={`w-8 h-8 rounded-xl ${data.color} text-white flex items-center justify-center mr-3 shadow-md`}
                  >
                    <Icon size={16} />
                  </div>

                  {brandName}
                </h3>

                <span className="text-xl font-bold text-slate-900 no-lowercase">
                  {FORMATTER.format(data.total)}
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6a1b9a] mr-2" />
                    billeteras (yape)
                  </span>

                  <span className="font-bold text-slate-800 no-lowercase">
                    {FORMATTER.format(data.yape)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    bancos
                  </span>

                  <span className="font-bold text-slate-800 no-lowercase">
                    {FORMATTER.format(data.bcp)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    efectivo
                  </span>

                  <span className="font-bold text-slate-800 no-lowercase">
                    {FORMATTER.format(data.cash)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}