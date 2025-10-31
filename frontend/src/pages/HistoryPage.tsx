import React, { useState, useEffect } from 'react';
import { Calendar, ThumbsUp, MessageCircle, Clock, Eye, Download, BarChart3, User, Volume2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // Update with your backend URL

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/storage/analyses`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis history');
      }
      
      const data = await response.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisDetails = async (analysisId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/storage/analysis/${analysisId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis details');
      }
      
      const data = await response.json();
      setSelectedAnalysis(data);
      setShowDetails(true);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analysis details:', err);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSentimentLabel = (score) => {
    if (score >= 75) return 'Very Positive';
    if (score >= 50) return 'Positive';
    if (score >= 25) return 'Neutral';
    return 'Negative';
  };

  const getEngagementLevel = (score) => {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  const downloadAnalysisJSON = (analysis) => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.analysis_id}_analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Analysis History</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading analysis history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Analysis History</h1>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400">Error loading analysis history: {error}</p>
          <button 
            onClick={fetchAnalysisHistory}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Analysis History</h1>
        <div className="text-gray-400">
          {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''} stored
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Analysis History</h3>
          <p className="text-gray-400">Analyzed videos will appear here with their detailed results.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {analyses.map((analysis) => {
            const overallScore = analysis.overall_score || 0;
            const analysisDate = analysis.timestamp;
            
            return (
              <div
                key={analysis.analysis_id}
                className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {analysis.analysis_id}
                    </h2>
                    <div className="flex items-center text-gray-400 space-x-4 mb-3">
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {formatDate(analysisDate)}
                      </span>
                      <span className={`flex items-center ${getSentimentColor(overallScore)}`}>
                        <ThumbsUp size={16} className="mr-1" />
                        Overall: {overallScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => fetchAnalysisDetails(analysis.analysis_id)}
                      className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-sm">Overall Score</span>
                      <BarChart3 size={14} className={getSentimentColor(overallScore)} />
                    </div>
                    <p className={`text-lg font-bold ${getSentimentColor(overallScore)}`}>
                      {overallScore.toFixed(1)}%
                    </p>
                    <p className="text-gray-400 text-xs">{getSentimentLabel(overallScore)}</p>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-sm">Engagement</span>
                      <ThumbsUp size={14} className="text-yellow-500" />
                    </div>
                    <p className="text-white font-medium text-lg">
                      {getEngagementLevel(overallScore)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-sm">Analysis ID</span>
                      <span className="text-xs text-gray-500">ID</span>
                    </div>
                    <p className="text-white font-mono text-xs truncate">
                      {analysis.analysis_id}
                    </p>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-sm">Actions</span>
                      <Download size={14} className="text-gray-400" />
                    </div>
                    <button 
                      onClick={() => downloadAnalysisJSON(analysis)}
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                      Download JSON
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Analysis Details Modal */}
      {showDetails && selectedAnalysis && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Analysis Details</h2>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mt-2">{selectedAnalysis.analysis_id}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <BarChart3 size={18} className="mr-2 text-purple-500" />
                    Overall Metrics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Effectiveness Score:</span>
                      <span className={`font-bold ${getSentimentColor(selectedAnalysis.data?.metrics?.overall_effectiveness_score || 0)}`}>
                        {(selectedAnalysis.data?.metrics?.overall_effectiveness_score || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Frames:</span>
                      <span className="text-white">{selectedAnalysis.data?.metrics?.total_frames || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Object Duration:</span>
                      <span className="text-white">{(selectedAnalysis.data?.metrics?.object_duration_percentage || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <User size={18} className="mr-2 text-blue-500" />
                    Human Sentiment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Facial Score:</span>
                      <span className="text-white">{(selectedAnalysis.data?.human_sentiment?.facial_score || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Body Language:</span>
                      <span className="text-white">{(selectedAnalysis.data?.human_sentiment?.body_score || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dominant Emotion:</span>
                      <span className="text-white capitalize">{selectedAnalysis.data?.human_sentiment?.dominant_emotion || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <MessageCircle size={18} className="mr-2 text-green-500" />
                    Text Sentiment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sentiment:</span>
                      <span className="text-white">{selectedAnalysis.data?.sentiment?.sentiment || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Score:</span>
                      <span className="text-white">{(selectedAnalysis.data?.sentiment?.score || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language:</span>
                      <span className="text-white">{selectedAnalysis.data?.language || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Volume2 size={18} className="mr-2 text-orange-500" />
                    Vocal Analysis
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vocal Emotion:</span>
                      <span className="text-white">{selectedAnalysis.data?.text_vocal_sentiment?.vocal_emotion || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vocal Score:</span>
                      <span className="text-white">{(selectedAnalysis.data?.text_vocal_sentiment?.vocal_score || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Text Sentiment:</span>
                      <span className="text-white">{selectedAnalysis.data?.text_vocal_sentiment?.text_sentiment_label || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Products */}
              {selectedAnalysis.data?.detected_products && selectedAnalysis.data.detected_products.length > 0 && (
                <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Detected Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedAnalysis.data.detected_products.map((product, index) => (
                      <div key={index} className="bg-gray-600/50 p-2 rounded">
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-gray-400 text-sm">Detections: {product.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcription */}
              {selectedAnalysis.data?.transcription && (
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Transcription</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedAnalysis.data.transcription}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => downloadAnalysisJSON(selectedAnalysis)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Download JSON
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}