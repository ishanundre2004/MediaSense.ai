import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

export default function AnalyzeComments() {
  const [postUrl, setPostUrl] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: postUrl,
          results_limit: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Analyze Instagram Comments
        </h1>
        <Link
          to="/history"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
        >
          View History
        </Link>
      </div>

      <div className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-8 shadow-lg shadow-black/40">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="postUrl" className="block text-gray-400 mb-2">
              Instagram Post URL
            </label>
            <input
              id="postUrl"
              type="url"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              placeholder="Paste Instagram post URL to analyze comments..."
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="button"
              className="flex items-center text-gray-400 hover:text-white mb-2"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              Advanced Options
              {isAdvancedOpen ? (
                <ChevronUp className="ml-1" size={18} />
              ) : (
                <ChevronDown className="ml-1" size={18} />
              )}
            </button>
            {isAdvancedOpen && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-gray-400">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-600"
                      defaultChecked
                    />
                    <span>Sentiment Analysis</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-gray-400">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-600"
                      defaultChecked
                    />
                    <span>Emotion Detection</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-gray-400">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-600"
                      defaultChecked
                    />
                    <span>Keyword Extraction</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? "Analyzing..." : "Analyze Comments"}
          </button>
        </form>
      </div>

      {analysisResult && (
        <div className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/40 animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-6">
            Analysis Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Overall Sentiment
              </h3>
              <div className="flex items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                    analysisResult.overall_sentiment.includes("Positive")
                      ? "bg-green-600/20 text-green-400"
                      : analysisResult.overall_sentiment.includes("Negative")
                      ? "bg-red-600/20 text-red-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  <span className="text-2xl font-bold">
                    {Math.max(
                      analysisResult.positive_percentage,
                      analysisResult.negative_percentage
                    ).toFixed(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {analysisResult.overall_sentiment}
                  </p>
                  <p className="text-gray-400">
                    {analysisResult.total_comments} comments analyzed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Positive Comments
              </h3>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 bg-green-600/20 text-green-400">
                  <span className="text-2xl font-bold">
                    {analysisResult.positive_percentage.toFixed(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {analysisResult.positive_comments}
                  </p>
                  <p className="text-gray-400">Percentage of total</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Negative Comments
              </h3>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 bg-red-600/20 text-red-400">
                  <span className="text-2xl font-bold">
                    {analysisResult.negative_percentage.toFixed(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {analysisResult.negative_comments}
                  </p>
                  <p className="text-gray-400">Percentage of total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Emotion Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(analysisResult.emotion_stats).map(
                ([emotion, percentage]) => (
                  <div
                    key={emotion}
                    className="bg-gray-900/50 p-3 rounded-lg border border-gray-800"
                  >
                    <p className="text-gray-400 capitalize">{emotion}</p>
                    <p className="text-white font-bold">
                      {Number(percentage).toFixed(1)}%
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Top Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.top_keywords.map((keyword: any) => (
                <span
                  key={keyword.keyword}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                >
                  {keyword.keyword} ({keyword.count})
                </span>
              ))}
            </div>
          </div>

          {analysisResult.most_liked_comment && (
            <div className="mb-8 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Most Liked Comment
              </h3>
              <p className="text-white mb-2">
                {analysisResult.most_liked_comment.text}
              </p>
              <div className="flex items-center text-gray-400 text-sm">
                <span>
                  By: {analysisResult.most_liked_comment.ownerUsername}
                </span>
                <span className="mx-2">•</span>
                <span>
                  Likes: {analysisResult.most_liked_comment.likesCount}
                </span>
                <span className="mx-2">•</span>
                <span className="capitalize">
                  {analysisResult.most_liked_comment.emotion || "neutral"}
                </span>
              </div>
            </div>
          )}

          {analysisResult.negative_comments_sample.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Top Negative Comments
              </h3>
              <div className="space-y-4">
              {analysisResult.negative_comments_sample.map((comment: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
                    >
                      <p className="text-white mb-2">{comment.text}</p>
                      <div className="flex items-center text-gray-400 text-sm">
                        <span>By: {comment.ownerUsername}</span>
                        <span className="mx-2">•</span>
                        <span>
                          Confidence: {(comment.confidence * 100).toFixed(1)}%
                        </span>
                        {comment.likesCount && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Likes: {comment.likesCount}</span>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <span className="capitalize">
                          {comment.emotion || "neutral"}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
