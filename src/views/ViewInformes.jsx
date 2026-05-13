import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../components/ui/Card";

const COLORS = [
  "#6a1b9a",
  "#8e24aa",
  "#ab47bc",
  "#ba68c8",
  "#ce93d8",
  "#42a5f5",
  "#26a69a",
  "#66bb6a",
  "#ffa726",
  "#ef5350",
];

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 0,
});

export default function ViewInformes({
  expenseChartData,
  monthlyTrendData,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            distribución de gastos
          </h3>

          {expenseChartData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">
              sin datos de gastos
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      FORMATTER.format(value)
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            tendencia mensual
          </h3>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    FORMATTER.format(value)
                  }
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="ingresos"
                  radius={[8, 8, 0, 0]}
                  fill="#10b981"
                />

                <Bar
                  dataKey="expense"
                  name="gastos"
                  radius={[8, 8, 0, 0]}
                  fill="#f43f5e"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}