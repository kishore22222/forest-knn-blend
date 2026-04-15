import { cn } from "@/lib/utils";

interface Props {
  matrix: number[][];
  classNames: string[];
  title: string;
  colorClass: string;
}

export function ConfusionMatrixView({ matrix, classNames, title, colorClass }: Props) {
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <div className="space-y-2">
      <h4 className={cn("text-sm font-semibold", colorClass)}>{title}</h4>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="p-1 text-muted-foreground">Actual\Pred</th>
              {classNames.map((name) => (
                <th key={name} className="p-1 text-muted-foreground text-center min-w-[48px]">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="p-1 text-muted-foreground font-medium">{classNames[i]}</td>
                {row.map((val, j) => {
                  const intensity = val / maxVal;
                  const isDiagonal = i === j;
                  return (
                    <td
                      key={j}
                      className={cn(
                        "p-1 text-center rounded-sm font-mono",
                        isDiagonal ? "text-foreground font-bold" : "text-muted-foreground"
                      )}
                      style={{
                        backgroundColor: isDiagonal
                          ? `hsl(var(--primary) / ${0.15 + intensity * 0.5})`
                          : `hsl(var(--destructive) / ${intensity * 0.3})`,
                      }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
