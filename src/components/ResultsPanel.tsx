import { ClassificationResult } from "@/lib/classifier";
import { ConfusionMatrixView } from "./ConfusionMatrixView";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  result: ClassificationResult;
}

export function ResultsPanel({ result }: Props) {
  const chartData = [
    { name: "KNN", accuracy: +(result.knnAccuracy * 100).toFixed(1) },
    { name: "Random Forest", accuracy: +(result.rfAccuracy * 100).toFixed(1) },
    { name: "Hybrid", accuracy: +(result.hybridAccuracy * 100).toFixed(1) },
  ];

  const colors = [
    "hsl(var(--chart-knn))",
    "hsl(var(--chart-rf))",
    "hsl(var(--chart-hybrid))",
  ];

  return (
    <div className="space-y-6">
      {/* Accuracy comparison */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-foreground mb-4">Accuracy Comparison</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value}%`, "Accuracy"]}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "KNN", acc: result.knnAccuracy, time: result.trainingTime.knn, color: "text-chart-knn" },
          { label: "Random Forest", acc: result.rfAccuracy, time: result.trainingTime.rf, color: "text-chart-rf" },
          { label: "Hybrid", acc: result.hybridAccuracy, time: null, color: "text-chart-hybrid" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>{(item.acc * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            {item.time !== null && (
              <p className="text-[10px] text-muted-foreground">{item.time.toFixed(0)}ms</p>
            )}
          </div>
        ))}
      </div>

      {/* Confusion matrices */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-base font-semibold text-foreground">Confusion Matrices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ConfusionMatrixView matrix={result.confusionMatrix.knn} classNames={result.classNames} title="KNN" colorClass="text-chart-knn" />
          <ConfusionMatrixView matrix={result.confusionMatrix.rf} classNames={result.classNames} title="Random Forest" colorClass="text-chart-rf" />
          <ConfusionMatrixView matrix={result.confusionMatrix.hybrid} classNames={result.classNames} title="Hybrid" colorClass="text-chart-hybrid" />
        </div>
      </div>
    </div>
  );
}
