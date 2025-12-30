
export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  description: string;
  niche: string;
  totalPredictions: number;
  isAnalysisHeavy?: boolean;
  avgAccuracy?: number;
}

export enum PredictionStatus {
  ACCURATE = 'Accurate',
  PARTIAL = 'Partially Accurate',
  INACCURATE = 'Inaccurate',
  PENDING = 'Pending Outcome'
}

export interface Prediction {
  id: string;
  videoTitle: string;
  videoDate: string;
  videoUrl: string;
  timestamp: string;
  rawQuote: string;
  structuredClaim: string;
  status: PredictionStatus;
  score: number; // 0 to 1
  explanation: string;
  marketData?: MarketDataPoint[];
}

export interface MarketDataPoint {
  date: string;
  price: string;
  asset: string;
}
