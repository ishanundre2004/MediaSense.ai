import React, { useState } from 'react';
import { Upload, FileVideo, AlertCircle, RotateCcw } from 'lucide-react';
import AnalysisResults from '../components/AnalysisResults';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File size exceeds the 100MB limit");
        return;
      }
      
      // Check file type
      if (!selectedFile.type.includes('video')) {
        setError("Please upload a video file (MP4, MOV)");
        return;
      }
      
      setFile(selectedFile);
      setResults(null);
      setError(null);
      setProgress(0);
      setProgressMessage(null);
      setUploadComplete(true);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setError(null);
    setProgress(0);
    setProgressMessage("Uploading video...");
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      // First endpoint to start processing
      const startResponse = await fetch('http://localhost:8000/analyze-video', {
        method: 'POST',
        body: formData,
      });
      
      if (!startResponse.ok) {
        throw new Error('Failed to start video analysis');
      }
      
      const { task_id } = await startResponse.json();
      
      // Poll for results
      let attempts = 0;
      const maxAttempts = 60; // 60 attempts with 5s interval = 5 minutes max
      let analysisResults = null;
      
      while (attempts < maxAttempts && !analysisResults) {
        attempts++;
        
        const statusResponse = await fetch(`http://localhost:8000/analysis-status/${task_id}`);
        if (!statusResponse.ok) {
          throw new Error('Failed to check analysis status');
        }
        
        const statusData = await statusResponse.json();
        
        // Update progress
        if (statusData.progress !== undefined) {
          setProgress(statusData.progress);
        }
        
        // Update progress message based on progress
        if (statusData.progress < 40) {
          setProgressMessage(`Processing video frames... (${Math.round(statusData.progress)}%)`);
        } else if (statusData.progress < 55) {
          setProgressMessage(`Extracting audio... (${Math.round(statusData.progress)}%)`);
        } else if (statusData.progress < 80) {
          setProgressMessage(`Transcribing audio... (${Math.round(statusData.progress)}%)`);
        } else if (statusData.progress < 90) {
          setProgressMessage(`Analyzing content... (${Math.round(statusData.progress)}%)`);
        } else {
          setProgressMessage(`Finalizing results... (${Math.round(statusData.progress)}%)`);
        }
        
        if (statusData.status === 'completed') {
          analysisResults = statusData.results;
          break;
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.message || 'Analysis failed');
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
      
      if (!analysisResults) {
        throw new Error('Analysis timed out');
      }
      
      setResults(analysisResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
      setProgressMessage(null);
    }
  };

  const handleAnalyzeAnother = () => {
    setFile(null);
    setResults(null);
    setError(null);
    setProgress(0);
    setProgressMessage(null);
    setUploadComplete(false);
  };

  return (
    <div className="max-w-6xl mx-auto"> {/* Increased width from max-w-4xl to max-w-6xl */}
      <h1 className="text-3xl font-bold text-white mb-8">Analyze Video</h1>
      
      {/* Upload Section - Only show when no file is selected or after clicking "Analyze Another Video" */}
      {!uploadComplete && !analyzing && !results && (
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700 mb-8">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileVideo size={48} className="text-gray-500 mb-4" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
              </div>
              <input
                id="video-upload"
                type="file"
                className="hidden"
                accept="video/mp4,video/quicktime"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}

      {/* File Selected Section - Show when file is selected but not analyzing */}
      {uploadComplete && !analyzing && !results && (
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileVideo size={48} className="text-green-500 mr-3" />
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Video Ready for Analysis</p>
                <p className="text-gray-400 text-sm">{file?.name}</p>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center px-6 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              <Upload className="mr-2" size={24} />
              Start Analysis
            </button>
          </div>
        </div>
      )}

      {/* Analyzing Section - Show during analysis */}
      {analyzing && (
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Upload className="animate-spin text-purple-500 mr-3" size={48} />
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Analyzing Video</p>
                <p className="text-gray-400">{file?.name}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900/50 border border-blue-700 text-white p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Upload className="animate-spin mr-3" size={20} />
              <span className="text-lg font-medium">{progressMessage || 'Processing your video...'}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Processing...</span>
              <span className="font-semibold">{Math.round(progress)}% complete</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-white p-6 rounded-lg mb-8 flex items-start">
          <AlertCircle className="mr-3 mt-1 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="font-semibold text-lg mb-2">Analysis Failed</p>
            <p className="mb-3">{error}</p>
            <p className="text-sm text-red-300">
              Note: This could be due to missing dependencies on the server or issues with the video file.
            </p>
            <button
              onClick={handleAnalyzeAnother}
              className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="mr-2" size={20} />
              Try Another Video
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-8">
          <AnalysisResults results={results} />
          
          {/* Analyze Another Video Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyzeAnother}
              className="inline-flex items-center px-6 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              <RotateCcw className="mr-2" size={24} />
              Analyze Another Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}