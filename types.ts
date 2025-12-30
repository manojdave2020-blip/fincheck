
export interface Creator {
  id: string;
  name: string;
  channelUrl: string;
  avatar: string;
  avgAccuracy: number;
  totalPredictions: number;
  unverifiableCount: number;
  timeSpan: string;
  isAnalysisHeavy?: boolean;
}

export enum PredictionStatus {
  ACCURATE = 'Accurate',
  PARTIAL = 'Partially Accurate',
  INACCURATE = 'Inaccurate',
  PENDING = 'Pending Outcome'
}

export interface Prediction {
  id: string;
  creatorId: string;
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

export interface VideoFilter {
  keywords: string[];
  minDuration: number; // minutes
  excludeShorts: boolean;
}
