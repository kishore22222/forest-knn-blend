// Demo datasets for classification

export interface Dataset {
  name: string;
  description: string;
  featureNames: string[];
  classNames: string[];
  features: number[][];
  labels: number[];
}

// Iris-like dataset (simplified)
function generateIris(): Dataset {
  const features: number[][] = [];
  const labels: number[] = [];

  const centers = [
    [5.0, 3.4, 1.5, 0.2],
    [5.9, 2.8, 4.3, 1.3],
    [6.6, 3.0, 5.5, 2.0],
  ];
  const spread = [0.35, 0.35, 0.3, 0.1];

  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < 50; i++) {
      features.push(centers[c].map((v, j) => v + (Math.random() - 0.5) * 2 * spread[j]));
      labels.push(c);
    }
  }

  return {
    name: "Iris",
    description: "Classic flower classification (150 samples, 4 features, 3 classes)",
    featureNames: ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"],
    classNames: ["Setosa", "Versicolor", "Virginica"],
    features,
    labels,
  };
}

// Wine-like dataset
function generateWine(): Dataset {
  const features: number[][] = [];
  const labels: number[] = [];

  const centers = [
    [13.7, 2.0, 2.5, 105, 3.0, 2.8],
    [12.5, 1.8, 2.2, 90, 2.2, 2.0],
    [13.2, 3.3, 2.4, 100, 1.5, 1.5],
  ];
  const spread = [0.8, 0.5, 0.3, 15, 0.5, 0.5];

  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < 60; i++) {
      features.push(centers[c].map((v, j) => v + (Math.random() - 0.5) * 2 * spread[j]));
      labels.push(c);
    }
  }

  return {
    name: "Wine",
    description: "Wine cultivar classification (180 samples, 6 features, 3 classes)",
    featureNames: ["Alcohol", "Malic Acid", "Ash", "Magnesium", "Flavanoids", "Proanthocyanins"],
    classNames: ["Class A", "Class B", "Class C"],
    features,
    labels,
  };
}

// Binary health dataset
function generateHealth(): Dataset {
  const features: number[][] = [];
  const labels: number[] = [];

  for (let i = 0; i < 100; i++) {
    const age = 20 + Math.random() * 60;
    const bmi = 18 + Math.random() * 22;
    const bp = 90 + Math.random() * 80;
    const glucose = 70 + Math.random() * 130;
    const risk = (age > 50 ? 1 : 0) + (bmi > 30 ? 1 : 0) + (bp > 140 ? 1 : 0) + (glucose > 140 ? 1 : 0);
    const label = risk >= 2 ? 1 : 0;
    features.push([age, bmi, bp, glucose]);
    labels.push(label + (Math.random() < 0.1 ? (1 - label) : 0)); // add noise
  }

  return {
    name: "Health Risk",
    description: "Binary health risk classification (100 samples, 4 features, 2 classes)",
    featureNames: ["Age", "BMI", "Blood Pressure", "Glucose"],
    classNames: ["Low Risk", "High Risk"],
    features,
    labels,
  };
}

export const DATASETS: Record<string, () => Dataset> = {
  iris: generateIris,
  wine: generateWine,
  health: generateHealth,
};
