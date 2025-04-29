import React from 'react';
import { Calendar, ThumbsUp, MessageCircle, Clock } from 'lucide-react';

const mockHistory = [
  {
    id: 1,
    videoTitle: "Summer Collection Promo",
    date: "2024-03-15",
    sentiment: {
      transcription: "Positive",
      comments: "Very Positive"
    },
    duration: "45 seconds",
    engagement: "High"
  },
  // Add more mock data as needed
];

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Analysis History</h1>
      
      <div className="grid gap-6">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{item.videoTitle}</h2>
                <div className="flex items-center text-gray-400 space-x-4">
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {item.date}
                  </span>
                  <span className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {item.duration}
                  </span>
                </div>
              </div>
              <button className="text-purple-500 hover:text-purple-400 transition-colors">
                View Details
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Content Sentiment</span>
                  <ThumbsUp size={16} className="text-green-500" />
                </div>
                <p className="text-white font-medium">{item.sentiment.transcription}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Comments Sentiment</span>
                  <MessageCircle size={16} className="text-blue-500" />
                </div>
                <p className="text-white font-medium">{item.sentiment.comments}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Engagement</span>
                  <ThumbsUp size={16} className="text-yellow-500" />
                </div>
                <p className="text-white font-medium">{item.engagement}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}