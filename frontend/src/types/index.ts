export interface User {
  id: string;
  email: string;
}

export interface VideoAnalysis {
  id: string;
  userId: string;
  videoUrl: string;
  transcription: string;
  summary: string;
  sentiment: {
    transcription: string;
    comments: string;
  };
  productAnalysis: {
    duration: number;
    proximity: string;
  };
  createdAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  images: string[];
  createdAt: Date;
}