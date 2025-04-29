// import React from 'react';

// interface ProductInfo {
//   name: string;
//   count: number;
//   confidence: number | null;
// }

// interface AnalysisResultsProps {
//   results: {
//     transcription: string;
//     language: string;
//     sentiment: {
//       sentiment: string;
//       score: number;
//       raw_label: string;
//       raw_score: number;
//     };
//     metrics: {
//       object_duration: number;
//       object_duration_percentage: number;
//       proximity_score: number;
//       total_frames: number;
//     };
//     detected_products: ProductInfo[];
//     visualization: string;
//   };
// }

// const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
//   const getSentimentColor = (sentiment: string) => {
//     switch (sentiment) {
//       case 'Very Good': return 'bg-green-600';
//       case 'Good': return 'bg-green-400';
//       case 'Neutral': return 'bg-yellow-400';
//       case 'Bad': return 'bg-orange-500';
//       case 'Very Bad': return 'bg-red-600';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getSentimentTextColor = (sentiment: string) => {
//     switch (sentiment) {
//       case 'Very Good': return 'text-green-600';
//       case 'Good': return 'text-green-400';
//       case 'Neutral': return 'text-yellow-400';
//       case 'Bad': return 'text-orange-500';
//       case 'Very Bad': return 'text-red-600';
//       default: return 'text-gray-500';
//     }
//   };

//   // Explanation content for each section
//   const sectionExplanations = {
//     transcription: {
//       title: "Transcription & Language",
//       content: (
//         <div className="space-y-2 text-gray-300">
//           <p>
//             <strong>What it shows:</strong> The text transcription of any speech in the video and the detected language.
//           </p>
//           <p>
//             <strong>How it's generated:</strong> Using Whisper, a multilingual speech recognition model that converts speech to text.
//           </p>
//           <p>
//             <strong>Why it matters:</strong> The transcription allows you to understand and analyze the spoken content of the video.
//           </p>
//         </div>
//       )
//     },
//     sentiment: {
//       title: "Sentiment Analysis",
//       content: (
//         <div className="space-y-2 text-gray-300">
//           <p>
//             <strong>What it measures:</strong> The emotional tone of any speech detected in the video.
//           </p>
//           <p>
//             <strong>How it's calculated:</strong> We analyze the transcribed text using a multilingual sentiment analysis model.
//           </p>
//           <p>
//             <strong>Interpretation:</strong>
//           </p>
//           <ul className="list-disc pl-5 space-y-1">
//             <li>
//               <span className="text-red-500 font-medium">0-25% (Very Bad):</span> Strongly negative sentiment
//             </li>
//             <li>
//               <span className="text-orange-500 font-medium">25-50% (Bad):</span> Negative sentiment
//             </li>
//             <li>
//               <span className="text-green-400 font-medium">50-75% (Good):</span> Positive sentiment
//             </li>
//             <li>
//               <span className="text-green-600 font-medium">75-100% (Very Good):</span> Strongly positive sentiment
//             </li>
//           </ul>
//           <p>
//             <strong>Why it matters:</strong> Helps understand the emotional context of the video content.
//           </p>
//         </div>
//       )
//     },
//     productAnalysis: {
//       title: "Product Analysis Metrics",
//       content: (
//         <div className="space-y-4 text-gray-300">
//           <div>
//             <p className="font-medium">Detected Products</p>
//             <p>
//               <strong>What it shows:</strong> Products identified in the video using object detection.
//             </p>
//             <p>
//               <strong>How it's calculated:</strong> Using YOLO, an object detection model trained to recognize various products.
//             </p>
//             <p>
//               <strong>Count:</strong> The number of frames in which each product appears.
//             </p>
//           </div>
          
//           <div>
//             <p className="font-medium">Object Duration</p>
//             <p>
//               <strong>What it measures:</strong> The percentage of time that objects of interest are present in the video.
//             </p>
//             <p>
//               <strong>Interpretation:</strong>
//             </p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li>
//                 <span className="text-red-500 font-medium">0-25%:</span> Very little object presence
//               </li>
//               <li>
//                 <span className="text-orange-500 font-medium">25-50%:</span> Moderate object presence
//               </li>
//               <li>
//                 <span className="text-green-400 font-medium">50-75%:</span> Good object presence
//               </li>
//               <li>
//                 <span className="text-green-600 font-medium">75-100%:</span> Excellent object presence
//               </li>
//             </ul>
//           </div>
          
//           <div>
//             <p className="font-medium">Proximity Score</p>
//             <p>
//               <strong>What it measures:</strong> How close and clearly visible the objects are in the frame.
//             </p>
//             <p>
//               <strong>Interpretation:</strong>
//             </p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li>
//                 <span className="text-red-500 font-medium">0-25%:</span> Objects are too small or too blurry
//               </li>
//               <li>
//                 <span className="text-orange-500 font-medium">25-50%:</span> Objects are visible but not optimal
//               </li>
//               <li>
//                 <span className="text-green-400 font-medium">50-75%:</span> Good object visibility and clarity
//               </li>
//               <li>
//                 <span className="text-green-600 font-medium">75-100%:</span> Excellent object visibility and clarity
//               </li>
//             </ul>
//           </div>
//         </div>
//       )
//     },
//     visualization: {
//       title: "Analysis Visualization",
//       content: (
//         <div className="space-y-2 text-gray-300">
//           <p>
//             <strong>What it shows:</strong> A visual representation of the analysis results, including object detection and key metrics.
//           </p>
//           <p>
//             <strong>What to look for:</strong> The visualization helps you quickly understand where and when objects appear in the video.
//           </p>
//           <p>
//             <strong>Color coding:</strong> Different colors may represent different objects or confidence levels in the detection.
//           </p>
//         </div>
//       )
//     }
//   };

//   const [openExplanation, setOpenExplanation] = React.useState<string | null>(null);

//   const toggleExplanation = (section: string) => {
//     setOpenExplanation(openExplanation === section ? null : section);
//   };

//   const getProgressBarColor = (percentage: number) => {
//     if (percentage >= 75) return 'bg-green-600';
//     if (percentage >= 50) return 'bg-green-400';
//     if (percentage >= 25) return 'bg-yellow-400';
//     return 'bg-red-500';
//   };

//   return (
//     <div className="space-y-8 max-w-6xl mx-auto">
//       {/* Page Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Video Analysis Results</h1>
//         <p className="text-gray-400 max-w-2xl mx-auto">
//           Comprehensive analysis of your video content, including transcription, sentiment, and product detection.
//         </p>
//       </div>

//       {/* Top Summary Card */}
//       <div className="bg-gray-800/70 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Sentiment Summary */}
//           <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
//             <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Content Sentiment</div>
//             <div className={`text-2xl font-bold ${getSentimentTextColor(results.sentiment.sentiment)}`}>
//               {results.sentiment.sentiment}
//             </div>
//             <div className="w-full mt-2 bg-gray-700 rounded-full h-2">
//               <div 
//                 className={`${getSentimentColor(results.sentiment.sentiment)} h-2 rounded-full`} 
//                 style={{ width: `${results.sentiment.score}%` }}
//               ></div>
//             </div>
//             <div className="text-gray-400 text-sm mt-1">{Math.round(results.sentiment.score)}%</div>
//           </div>
          
//           {/* Language Summary */}
//           <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
//             <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Detected Language</div>
//             <div className="text-2xl font-bold text-blue-400">{results.language}</div>
//             <div className="text-gray-400 text-sm mt-2">Speech detected & analyzed</div>
//           </div>
          
//           {/* Products Summary */}
//           <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
//             <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Product Detection</div>
//             <div className="text-2xl font-bold text-purple-400">
//               {results.detected_products?.length || 0} <span className="text-gray-400 text-lg font-normal">Products</span>
//             </div>
//             <div className="text-gray-400 text-sm mt-2">
//               {results.metrics.object_duration_percentage.toFixed(1)}% screen time
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content Columns */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Transcription & Language Section */}
//           <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
//             <div className="absolute top-4 right-4">
//               <button 
//                 onClick={() => toggleExplanation('transcription')}
//                 className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
//                 aria-label="Information about transcription"
//               >
//                 i
//               </button>
//             </div>
//             {openExplanation === 'transcription' && (
//               <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
//                 <h3 className="font-semibold text-white mb-2">{sectionExplanations.transcription.title} Explanation</h3>
//                 {sectionExplanations.transcription.content}
//               </div>
//             )}
//             <div className="flex items-center gap-3 mb-4">
//               <div className="bg-blue-500/20 p-2 rounded-lg">
//                 <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3m0 0a7 7 0 017 7m-7-7a7 7 0 00-7 7"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-white">Transcription & Language</h2>
//             </div>
//             <div className="p-4 bg-gray-800/80 rounded-lg border border-gray-700 shadow-inner">
//               <p className="text-white whitespace-pre-wrap leading-relaxed">
//                 {results.transcription || "No speech detected in this video"}
//               </p>
//             </div>
//             <div className="mt-4 flex flex-wrap gap-2">
//               <div className="bg-blue-500/20 py-1 px-3 rounded-full text-sm text-blue-400 flex items-center">
//                 <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
//                 {results.language}
//               </div>
//             </div>
//           </div>

//           {/* Sentiment Analysis Section */}
//           <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
//             <div className={`absolute top-0 left-0 w-full h-1 ${getSentimentColor(results.sentiment.sentiment)}`}></div>
//             <div className="absolute top-4 right-4">
//               <button 
//                 onClick={() => toggleExplanation('sentiment')}
//                 className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
//                 aria-label="Information about sentiment analysis"
//               >
//                 i
//               </button>
//             </div>
//             {openExplanation === 'sentiment' && (
//               <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
//                 <h3 className="font-semibold text-white mb-2">{sectionExplanations.sentiment.title} Explanation</h3>
//                 {sectionExplanations.sentiment.content}
//               </div>
//             )}
//             <div className="flex items-center gap-3 mb-6">
//               <div className={`${getSentimentColor(results.sentiment.sentiment).replace('bg-', 'bg-').replace('600', '500/20').replace('400', '400/20')} p-2 rounded-lg`}>
//                 <svg className={`w-5 h-5 ${getSentimentTextColor(results.sentiment.sentiment)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-white">Sentiment Analysis</h2>
//             </div>
            
//             <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-6 shadow-inner">
//               <div className="text-center mb-6">
//                 <div className={`text-3xl font-bold mb-2 ${getSentimentTextColor(results.sentiment.sentiment)}`}>
//                   {results.sentiment.sentiment}
//                 </div>
//                 <p className="text-gray-400">
//                   Confidence: {(results.sentiment.raw_score * 100).toFixed(1)}% ({results.sentiment.raw_label})
//                 </p>
//               </div>
              
//               <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//                 <div 
//                   className={`${getSentimentColor(results.sentiment.sentiment)} h-4 rounded-full transition-all duration-500`} 
//                   style={{ width: `${results.sentiment.score}%` }}
//                 ></div>
//               </div>
              
//               <div className="flex justify-between text-xs text-gray-400">
//                 <span>0%</span>
//                 <span>25%</span>
//                 <span>50%</span>
//                 <span>75%</span>
//                 <span>100%</span>
//               </div>
              
//               <div className="flex justify-between mt-2 text-xs">
//                 <span className="text-red-500">Very Bad</span>
//                 <span className="text-orange-500">Bad</span>
//                 <span className="text-yellow-400">Neutral</span>
//                 <span className="text-green-400">Good</span>
//                 <span className="text-green-600">Very Good</span>
//               </div>
//             </div>
//           </div>

//           {/* Visualization Section */}
//           <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
//             <div className="absolute top-4 right-4">
//               <button 
//                 onClick={() => toggleExplanation('visualization')}
//                 className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
//                 aria-label="Information about visualization"
//               >
//                 i
//               </button>
//             </div>
//             {openExplanation === 'visualization' && (
//               <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
//                 <h3 className="font-semibold text-white mb-2">{sectionExplanations.visualization.title} Explanation</h3>
//                 {sectionExplanations.visualization.content}
//               </div>
//             )}
//             <div className="flex items-center gap-3 mb-4">
//               <div className="bg-purple-500/20 p-2 rounded-lg">
//                 <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-white">Analysis Visualization</h2>
//             </div>
//             <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 shadow-inner">
//               <img 
//                 src={`data:image/png;base64,${results.visualization}`} 
//                 alt="Analysis results visualization" 
//                 className="max-w-full h-auto rounded-lg"
//               />
//             </div>
//           </div>
//         </div>
        
//         {/* Right Column */}
//         <div className="space-y-8">
//           {/* Product Analysis Section */}
//           <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
//             <div className="absolute top-4 right-4">
//               <button 
//                 onClick={() => toggleExplanation('productAnalysis')}
//                 className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
//                 aria-label="Information about product analysis"
//               >
//                 i
//               </button>
//             </div>
//             {openExplanation === 'productAnalysis' && (
//               <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
//                 <h3 className="font-semibold text-white mb-2">{sectionExplanations.productAnalysis.title} Explanation</h3>
//                 {sectionExplanations.productAnalysis.content}
//               </div>
//             )}
//             <div className="flex items-center gap-3 mb-6">
//               <div className="bg-purple-500/20 p-2 rounded-lg">
//                 <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-white">Product Analysis</h2>
//             </div>
            
//             {/* Detected Products */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center">
//                 <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
//                 Detected Products
//               </h3>
//               {results.detected_products && results.detected_products.length > 0 ? (
//                 <div className="space-y-3">
//                   {results.detected_products.map((product, index) => (
//                     <div key={index} className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 shadow-sm hover:border-purple-500/50 transition-colors">
//                       <div className="flex justify-between items-center">
//                         <div className="font-medium text-white">{product.name}</div>
//                         <div className="bg-purple-500/20 text-purple-400 text-xs py-1 px-2 rounded-full">
//                           {product.count} frames
//                         </div>
//                       </div>
//                       {product.confidence !== null && (
//                         <div className="mt-2">
//                           <div className="flex justify-between text-xs mb-1">
//                             <span className="text-gray-400">Confidence</span>
//                             <span className="text-purple-400">{(product.confidence * 100).toFixed(1)}%</span>
//                           </div>
//                           <div className="w-full bg-gray-700 rounded-full h-1">
//                             <div 
//                               className="bg-purple-500 h-1 rounded-full" 
//                               style={{ width: `${product.confidence * 100}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 text-center">
//                   <p className="text-gray-400">No products detected</p>
//                 </div>
//               )}
//             </div>
            
//             {/* Key Metrics */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center">
//                 <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
//                 Key Metrics
//               </h3>
              
//               <div className="space-y-4">
//                 {/* Object Duration */}
//                 <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700">
//                   <div className="flex justify-between items-center mb-2">
//                     <div className="text-white font-medium">Object Duration</div>
//                     <div className="text-gray-300">{results.metrics.object_duration.toFixed(2)}s</div>
//                   </div>
//                   <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
//                     <div 
//                       className={`${getProgressBarColor(results.metrics.object_duration_percentage)} h-2 rounded-full`} 
//                       style={{ width: `${results.metrics.object_duration_percentage}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-right text-gray-400 text-sm">
//                     {results.metrics.object_duration_percentage.toFixed(1)}% of video
//                   </div>
//                 </div>
                
//                 {/* Proximity Score */}
//                 <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700">
//                   <div className="flex justify-between items-center mb-2">
//                     <div className="text-white font-medium">Proximity Score</div>
//                     <div className="text-gray-300">{results.metrics.proximity_score.toFixed(1)}%</div>
//                   </div>
//                   <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
//                     <div 
//                       className={`${getProgressBarColor(results.metrics.proximity_score)} h-2 rounded-full`} 
//                       style={{ width: `${results.metrics.proximity_score}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-right text-gray-400 text-sm">
//                     Object visibility quality
//                   </div>
//                 </div>
                
//                 {/* Frame Count */}
//                 <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700">
//                   <div className="flex justify-between items-center">
//                     <div className="text-white font-medium">Frames Analyzed</div>
//                     <div className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full text-sm">
//                       {results.metrics.total_frames}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalysisResults;



import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  RadialBarChart, RadialBar
} from 'recharts';

interface ProductInfo {
  name: string;
  count: number;
  confidence: number | null;
}

interface VisualizationData {
  metrics: {
    objectDuration: number;
    proximityScore: number;
    sentimentScore: number;
  };
  frameData: Array<{
    frameNumber: number;
    proximity: number;
    blurriness: number;
    objectsCount: number;
  }>;
  blurDistribution: Array<{
    range: string;
    count: number;
  }>;
  proximityDistribution: Array<{
    range: string;
    count: number;
  }>;
}

interface AnalysisResultsProps {
  results: {
    transcription: string;
    language: string;
    sentiment: {
      sentiment: string;
      score: number;
      raw_label: string;
      raw_score: number;
    };
    metrics: {
      object_duration: number;
      object_duration_percentage: number;
      proximity_score: number;
      total_frames: number;
    };
    detected_products: ProductInfo[];
    visualization_data: VisualizationData;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Good': return 'bg-green-600';
      case 'Good': return 'bg-green-400';
      case 'Neutral': return 'bg-yellow-400';
      case 'Bad': return 'bg-orange-500';
      case 'Very Bad': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Good': return 'text-green-600';
      case 'Good': return 'text-green-400';
      case 'Neutral': return 'text-yellow-400';
      case 'Bad': return 'text-orange-500';
      case 'Very Bad': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];
  
  // Explanation content for each section
  const sectionExplanations = {
    transcription: {
      title: "Transcription & Language",
      content: (
        <div className="space-y-2 text-gray-300">
          <p>
            <strong>What it shows:</strong> The text transcription of any speech in the video and the detected language.
          </p>
          <p>
            <strong>How it's generated:</strong> Using Whisper, a multilingual speech recognition model that converts speech to text.
          </p>
          <p>
            <strong>Why it matters:</strong> The transcription allows you to understand and analyze the spoken content of the video.
          </p>
        </div>
      )
    },
    sentiment: {
      title: "Sentiment Analysis",
      content: (
        <div className="space-y-2 text-gray-300">
          <p>
            <strong>What it measures:</strong> The emotional tone of any speech detected in the video.
          </p>
          <p>
            <strong>How it's calculated:</strong> We analyze the transcribed text using a multilingual sentiment analysis model.
          </p>
          <p>
            <strong>Interpretation:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="text-red-500 font-medium">0-25% (Very Bad):</span> Strongly negative sentiment
            </li>
            <li>
              <span className="text-orange-500 font-medium">25-50% (Bad):</span> Negative sentiment
            </li>
            <li>
              <span className="text-green-400 font-medium">50-75% (Good):</span> Positive sentiment
            </li>
            <li>
              <span className="text-green-600 font-medium">75-100% (Very Good):</span> Strongly positive sentiment
            </li>
          </ul>
          <p>
            <strong>Why it matters:</strong> Helps understand the emotional context of the video content.
          </p>
        </div>
      )
    },
    productAnalysis: {
      title: "Product Analysis Metrics",
      content: (
        <div className="space-y-4 text-gray-300">
          <div>
            <p className="font-medium">Detected Products</p>
            <p>
              <strong>What it shows:</strong> Products identified in the video using object detection.
            </p>
            <p>
              <strong>How it's calculated:</strong> Using YOLO, an object detection model trained to recognize various products.
            </p>
            <p>
              <strong>Count:</strong> The number of frames in which each product appears.
            </p>
          </div>
          
          <div>
            <p className="font-medium">Object Duration</p>
            <p>
              <strong>What it measures:</strong> The percentage of time that objects of interest are present in the video.
            </p>
            <p>
              <strong>Interpretation:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="text-red-500 font-medium">0-25%:</span> Very little object presence
              </li>
              <li>
                <span className="text-orange-500 font-medium">25-50%:</span> Moderate object presence
              </li>
              <li>
                <span className="text-green-400 font-medium">50-75%:</span> Good object presence
              </li>
              <li>
                <span className="text-green-600 font-medium">75-100%:</span> Excellent object presence
              </li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium">Proximity Score</p>
            <p>
              <strong>What it measures:</strong> How close and clearly visible the objects are in the frame.
            </p>
            <p>
              <strong>Interpretation:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="text-red-500 font-medium">0-25%:</span> Objects are too small or too blurry
              </li>
              <li>
                <span className="text-orange-500 font-medium">25-50%:</span> Objects are visible but not optimal
              </li>
              <li>
                <span className="text-green-400 font-medium">50-75%:</span> Good object visibility and clarity
              </li>
              <li>
                <span className="text-green-600 font-medium">75-100%:</span> Excellent object visibility and clarity
              </li>
            </ul>
          </div>
        </div>
      )
    },
    visualization: {
      title: "Analysis Visualization",
      content: (
        <div className="space-y-2 text-gray-300">
          <p>
            <strong>What it shows:</strong> Interactive visualizations of the analysis results, including object detection metrics, proximity scores, and frame-by-frame analysis.
          </p>
          <p>
            <strong>What to look for:</strong> The charts help you understand the quality and effectiveness of your video content.
          </p>
          <p>
            <strong>Color coding:</strong> Different colors represent different metrics and their relative importance.
          </p>
        </div>
      )
    }
  };

  const [openExplanation, setOpenExplanation] = useState<string | null>(null);
  const [activeVisChart, setActiveVisChart] = useState('overview');

  const toggleExplanation = (section: string) => {
    setOpenExplanation(openExplanation === section ? null : section);
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-600';
    if (percentage >= 50) return 'bg-green-400';
    if (percentage >= 25) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  // Prepare data for key metrics visualization
  const keyMetricsData = [
    {
      name: 'Object Duration',
      value: results.metrics.object_duration_percentage,
      fill: results.metrics.object_duration_percentage >= 75 ? '#22c55e' : 
            results.metrics.object_duration_percentage >= 50 ? '#4ade80' : 
            results.metrics.object_duration_percentage >= 25 ? '#facc15' : '#ef4444',
    },
    {
      name: 'Proximity Score',
      value: results.metrics.proximity_score,
      fill: results.metrics.proximity_score >= 75 ? '#22c55e' : 
            results.metrics.proximity_score >= 50 ? '#4ade80' : 
            results.metrics.proximity_score >= 25 ? '#facc15' : '#ef4444',
    },
    {
      name: 'Sentiment',
      value: results.sentiment.score,
      fill: results.sentiment.score >= 75 ? '#22c55e' : 
            results.sentiment.score >= 50 ? '#4ade80' : 
            results.sentiment.score >= 25 ? '#facc15' : '#ef4444',
    }
  ];

  // Simplify frame data for visualization by sampling if there are too many frames
  const sampleFrameData = () => {
    const frameData = results.visualization_data?.frameData || [];
    if (frameData.length <= 50) return frameData;
    
    const sampled = [];
    const step = Math.ceil(frameData.length / 50);
    for (let i = 0; i < frameData.length; i += step) {
      sampled.push(frameData[i]);
    }
    return sampled;
  };

  const sampledFrameData = sampleFrameData();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Video Analysis Results</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Comprehensive analysis of your video content, including transcription, sentiment, and product detection.
        </p>
      </div>

      {/* Top Summary Card */}
      <div className="bg-gray-800/70 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sentiment Summary */}
          <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Content Sentiment</div>
            <div className={`text-2xl font-bold ${getSentimentTextColor(results.sentiment.sentiment)}`}>
              {results.sentiment.sentiment}
            </div>
            <div className="w-full mt-2 bg-gray-700 rounded-full h-2">
              <div 
                className={`${getSentimentColor(results.sentiment.sentiment)} h-2 rounded-full`} 
                style={{ width: `${results.sentiment.score}%` }}
              ></div>
            </div>
            <div className="text-gray-400 text-sm mt-1">{Math.round(results.sentiment.score)}%</div>
          </div>
          
          {/* Language Summary */}
          <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Detected Language</div>
            <div className="text-2xl font-bold text-blue-400">{results.language}</div>
            <div className="text-gray-400 text-sm mt-2">Speech detected & analyzed</div>
          </div>
          
          {/* Products Summary */}
          <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Product Detection</div>
            <div className="text-2xl font-bold text-purple-400">
              {results.detected_products?.length || 0} <span className="text-gray-400 text-lg font-normal">Products</span>
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {results.metrics.object_duration_percentage.toFixed(1)}% screen time
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transcription & Language Section */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleExplanation('transcription')}
                className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Information about transcription"
              >
                i
              </button>
            </div>
            {openExplanation === 'transcription' && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
                <h3 className="font-semibold text-white mb-2">{sectionExplanations.transcription.title} Explanation</h3>
                {sectionExplanations.transcription.content}
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3m0 0a7 7 0 017 7m-7-7a7 7 0 00-7 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Transcription & Language</h2>
            </div>
            <div className="p-4 bg-gray-800/80 rounded-lg border border-gray-700 shadow-inner">
              <p className="text-white whitespace-pre-wrap leading-relaxed">
                {results.transcription || "No speech detected in this video"}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="bg-blue-500/20 py-1 px-3 rounded-full text-sm text-blue-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                {results.language}
              </div>
            </div>
          </div>

          {/* Sentiment Analysis Section */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${getSentimentColor(results.sentiment.sentiment)}`}></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleExplanation('sentiment')}
                className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Information about sentiment analysis"
              >
                i
              </button>
            </div>
            {openExplanation === 'sentiment' && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
                <h3 className="font-semibold text-white mb-2">{sectionExplanations.sentiment.title} Explanation</h3>
                {sectionExplanations.sentiment.content}
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className={`${getSentimentColor(results.sentiment.sentiment).replace('bg-', 'bg-').replace('600', '500/20').replace('400', '400/20')} p-2 rounded-lg`}>
                <svg className={`w-5 h-5 ${getSentimentTextColor(results.sentiment.sentiment)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Sentiment Analysis</h2>
            </div>
            
            <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-6 shadow-inner">
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${getSentimentTextColor(results.sentiment.sentiment)}`}>
                  {results.sentiment.sentiment}
                </div>
                <div className="text-gray-400">
                  Sentiment score: {Math.round(results.sentiment.score)}%
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className={`${getSentimentColor(results.sentiment.sentiment)} h-3 rounded-full`} 
                  style={{ width: `${results.sentiment.score}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Raw Label</div>
                  <div className="font-medium text-white">{results.sentiment.raw_label}</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Raw Score</div>
                  <div className="font-medium text-white">{results.sentiment.raw_score.toFixed(2)}</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Normalized</div>
                  <div className="font-medium text-white">{Math.round(results.sentiment.score)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Analysis Section */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleExplanation('productAnalysis')}
                className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Information about product analysis"
              >
                i
              </button>
            </div>
            {openExplanation === 'productAnalysis' && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
                <h3 className="font-semibold text-white mb-2">{sectionExplanations.productAnalysis.title} Explanation</h3>
                {sectionExplanations.productAnalysis.content}
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Product Analysis Metrics</h2>
            </div>
            
            <div className="space-y-6">
              {/* Detected Products */}
              <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-white mb-4">Detected Products</h3>
                {results.detected_products?.length > 0 ? (
                  <div className="space-y-4">
                    {results.detected_products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-xs text-gray-400">Detected in {product.count} frames</div>
                          </div>
                        </div>
                        {product.confidence !== null && (
                          <div className="text-sm text-gray-400">
                            {Math.round(product.confidence * 100)}% confidence
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">No products detected in this video</div>
                )}
              </div>
              
              {/* Key Metrics */}
              <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Object Duration */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Object Duration</span>
                      <span className="font-medium text-white">
                        {results.metrics.object_duration_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`${getProgressBarColor(results.metrics.object_duration_percentage)} h-2.5 rounded-full`} 
                        style={{ width: `${results.metrics.object_duration_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Proximity Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Proximity Score</span>
                      <span className="font-medium text-white">
                        {results.metrics.proximity_score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`${getProgressBarColor(results.metrics.proximity_score)} h-2.5 rounded-full`} 
                        style={{ width: `${results.metrics.proximity_score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Radial Bar Chart */}
                <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="20%" 
                      outerRadius="80%" 
                      data={keyMetricsData}
                      startAngle={180} 
                      endAngle={-180}
                    >
                      <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        clockWise
                        dataKey="value"
                      >
                        {keyMetricsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </RadialBar>
                      <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        wrapperStyle={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Visualization Section */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleExplanation('visualization')}
                className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Information about visualizations"
              >
                i
              </button>
            </div>
            {openExplanation === 'visualization' && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
                <h3 className="font-semibold text-white mb-2">{sectionExplanations.visualization.title} Explanation</h3>
                {sectionExplanations.visualization.content}
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Analysis Visualization</h2>
            </div>
            
            <div className="space-y-6">
              {/* Chart Selection Tabs */}
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveVisChart('overview')}
                  className={`px-4 py-2 text-sm font-medium ${activeVisChart === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveVisChart('frames')}
                  className={`px-4 py-2 text-sm font-medium ${activeVisChart === 'frames' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Frame Analysis
                </button>
                <button
                  onClick={() => setActiveVisChart('distribution')}
                  className={`px-4 py-2 text-sm font-medium ${activeVisChart === 'distribution' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Distributions
                </button>
              </div>
              
              {/* Overview Chart */}
              {activeVisChart === 'overview' && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampledFrameData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="frameNumber" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="proximity" 
                        name="Proximity (%)" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="blurriness" 
                        name="Blurriness (%)" 
                        stroke="#82ca9d" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Frame Analysis Chart */}
              {activeVisChart === 'frames' && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampledFrameData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="frameNumber" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="objectsCount" 
                        name="Objects Count" 
                        fill="#ffc658" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Distribution Charts */}
              {activeVisChart === 'distribution' && (
                <div className="space-y-6">
                  <div className="h-64">
                    <h4 className="text-center text-gray-400 mb-2">Blur Distribution</h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={results.visualization_data.blurDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="range"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {results.visualization_data.blurDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} frames`, 'Count']}
                          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-64">
                    <h4 className="text-center text-gray-400 mb-2">Proximity Distribution</h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={results.visualization_data.proximityDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="range"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {results.visualization_data.proximityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} frames`, 'Count']}
                          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Technical Details */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Technical Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Frames Processed</span>
                <span className="font-medium text-white">{results.metrics.total_frames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Object Duration</span>
                <span className="font-medium text-white">
                  {results.metrics.object_duration.toFixed(2)} seconds
                </span>
              </div>
              <div className="flex justify-between">
              <span className="text-gray-400">Average Blurriness</span>
                <span className="font-medium text-white">
                  {results.metrics.average_blurriness?.toFixed(2) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Processing Status</span>
                <span className="font-medium text-green-400">Completed</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Models Used</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Object Detection</div>
                  <div className="font-medium text-white">YOLOv8</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Speech Recognition</div>
                  <div className="font-medium text-white">Whisper</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Sentiment Analysis</div>
                  <div className="font-medium text-white">Multilingual Model</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Computer Vision</div>
                  <div className="font-medium text-white">OpenCV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-gray-800/70 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-lg text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Need more detailed analysis?</h3>
        <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
          Our advanced analytics can provide deeper insights into your video performance and audience engagement.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Upgrade Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;