// Hybrid KNN + Random Forest classifier

import KNN from "ml-knn";
import { RandomForestClassifier as RF } from "ml-random-forest";

export interface ClassifierParams {
  knnK: number;
  rfTrees: number;
  rfMaxFeatures: number;
  testSplit: number;
  hybridWeight: number; // 0 = all KNN, 1 = all RF
}

export interface ClassificationResult {
  knnAccuracy: number;
  rfAccuracy: number;
  hybridAccuracy: number;
  knnPredictions: number[];
  rfPredictions: number[];
  hybridPredictions: number[];
  testLabels: number[];
  confusionMatrix: { knn: number[][]; rf: number[][]; hybrid: number[][] };
  classNames: string[];
  trainingTime: { knn: number; rf: number };
}

function shuffle<T>(arr: T[], labels: number[]): [T[], number[]] {
  const indices = arr.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return [indices.map((i) => arr[i]), indices.map((i) => labels[i])];
}

function buildConfusionMatrix(trueLabels: number[], predicted: number[], numClasses: number): number[][] {
  const matrix = Array.from({ length: numClasses }, () => Array(numClasses).fill(0));
  for (let i = 0; i < trueLabels.length; i++) {
    matrix[trueLabels[i]][predicted[i]]++;
  }
  return matrix;
}

function accuracy(trueLabels: number[], predicted: number[]): number {
  let correct = 0;
  for (let i = 0; i < trueLabels.length; i++) {
    if (trueLabels[i] === predicted[i]) correct++;
  }
  return correct / trueLabels.length;
}

export function runClassifier(
  features: number[][],
  labels: number[],
  classNames: string[],
  params: ClassifierParams
): ClassificationResult {
  const [shuffledFeatures, shuffledLabels] = shuffle(features, labels);
  const splitIdx = Math.floor(shuffledFeatures.length * (1 - params.testSplit));

  const trainX = shuffledFeatures.slice(0, splitIdx);
  const trainY = shuffledLabels.slice(0, splitIdx);
  const testX = shuffledFeatures.slice(splitIdx);
  const testY = shuffledLabels.slice(splitIdx);

  const numClasses = classNames.length;

  // KNN
  const knnStart = performance.now();
  const knn = new KNN(trainX, trainY, { k: params.knnK });
  const knnPreds = knn.predict(testX);
  const knnTime = performance.now() - knnStart;

  // Random Forest
  const rfStart = performance.now();
  const rf = new RF({
    nEstimators: params.rfTrees,
    maxFeatures: Math.min(params.rfMaxFeatures, trainX[0].length),
    seed: 42,
  });
  rf.train(trainX, trainY);
  const rfPreds = rf.predict(testX);
  const rfTime = performance.now() - rfStart;

  // Hybrid: weighted voting
  const hybridPreds = testX.map((_, i) => {
    const votes = Array(numClasses).fill(0);
    votes[knnPreds[i]] += 1 - params.hybridWeight;
    votes[rfPreds[i]] += params.hybridWeight;
    return votes.indexOf(Math.max(...votes));
  });

  return {
    knnAccuracy: accuracy(testY, knnPreds),
    rfAccuracy: accuracy(testY, rfPreds),
    hybridAccuracy: accuracy(testY, hybridPreds),
    knnPredictions: knnPreds,
    rfPredictions: rfPreds,
    hybridPredictions: hybridPreds,
    testLabels: testY,
    confusionMatrix: {
      knn: buildConfusionMatrix(testY, knnPreds, numClasses),
      rf: buildConfusionMatrix(testY, rfPreds, numClasses),
      hybrid: buildConfusionMatrix(testY, hybridPreds, numClasses),
    },
    classNames,
    trainingTime: { knn: knnTime, rf: rfTime },
  };
}
