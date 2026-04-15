import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DATASETS, type Dataset } from "@/lib/datasets";
import { runClassifier, type ClassifierParams, type ClassificationResult } from "@/lib/classifier";
import { ResultsPanel } from "@/components/ResultsPanel";

const defaultParams: ClassifierParams = {
  knnK: 5,
  rfTrees: 50,
  rfMaxFeatures: 3,
  testSplit: 0.25,
  hybridWeight: 0.5,
};

export default function Index() {
  const [selectedDataset, setSelectedDataset] = useState<string>("iris");
  const [params, setParams] = useState<ClassifierParams>(defaultParams);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    // Defer to allow UI update
    setTimeout(() => {
      const dataset: Dataset = DATASETS[selectedDataset]();
      const res = runClassifier(dataset.features, dataset.labels, dataset.classNames, params);
      setResult(res);
      setIsRunning(false);
    }, 50);
  }, [selectedDataset, params]);

  const updateParam = <K extends keyof ClassifierParams>(key: K, value: ClassifierParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Hybrid Classifier</h1>
            <p className="text-xs text-muted-foreground">KNN + Random Forest</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Controls */}
          <aside className="space-y-4">
            {/* Dataset */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Dataset</h3>
              <div className="space-y-2">
                {Object.entries(DATASETS).map(([key, gen]) => {
                  const ds = gen();
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDataset(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                        selectedDataset === key
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <span className="font-medium">{ds.name}</span>
                      <p className="text-[11px] mt-0.5 opacity-70">{ds.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Parameters</h3>

              <ParamSlider label="KNN — K neighbors" value={params.knnK} min={1} max={20} step={1}
                onChange={(v) => updateParam("knnK", v)} color="text-chart-knn" />

              <ParamSlider label="RF — Number of trees" value={params.rfTrees} min={5} max={200} step={5}
                onChange={(v) => updateParam("rfTrees", v)} color="text-chart-rf" />

              <ParamSlider label="RF — Max features" value={params.rfMaxFeatures} min={1} max={6} step={1}
                onChange={(v) => updateParam("rfMaxFeatures", v)} color="text-chart-rf" />

              <ParamSlider label="Test split" value={params.testSplit} min={0.1} max={0.5} step={0.05}
                onChange={(v) => updateParam("testSplit", v)} color="text-muted-foreground"
                format={(v) => `${(v * 100).toFixed(0)}%`} />

              <ParamSlider label="Hybrid weight (KNN ↔ RF)" value={params.hybridWeight} min={0} max={1} step={0.05}
                onChange={(v) => updateParam("hybridWeight", v)} color="text-chart-hybrid"
                format={(v) => `${(v * 100).toFixed(0)}% RF`} />
            </div>

            <Button onClick={handleRun} disabled={isRunning} className="w-full" size="lg">
              {isRunning ? "Running..." : "Run Classification"}
            </Button>
          </aside>

          {/* Results */}
          <section>
            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="flex items-center justify-center h-64 bg-card border border-border rounded-xl">
                <div className="text-center text-muted-foreground">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm">Configure parameters and click Run</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function ParamSlider({
  label, value, min, max, step, onChange, color, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color: string; format?: (v: number) => string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
      />
    </div>
  );
}
