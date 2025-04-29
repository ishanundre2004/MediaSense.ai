import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Brain, History, Database, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">VideoSense AI</h1>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Analyze Your Instagram Promotional Videos with AI
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Get deep insights into your promotional content with advanced sentiment analysis,
              product detection, and engagement metrics.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Video className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Video Analysis</h3>
              <p className="text-gray-400">
                Upload your promotional videos and get detailed insights about content performance.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sentiment Analysis</h3>
              <p className="text-gray-400">
                Understand the emotional impact of your content through advanced AI analysis.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <History className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Analysis History</h3>
              <p className="text-gray-400">
                Track your content performance over time with detailed historical data.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-pink-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Product Training</h3>
              <p className="text-gray-400">
                Train our AI to better recognize your products in promotional videos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}