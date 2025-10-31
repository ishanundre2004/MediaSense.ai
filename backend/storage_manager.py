import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any
import shutil

class StorageManager:
    def __init__(self, base_storage_path: str = "./video_analysis_storage"):
        """
        Initialize storage manager
        
        Args:
            base_storage_path: Base directory for storing all analysis data
        """
        self.base_storage_path = base_storage_path
        self.ensure_storage_directories()
    
    def ensure_storage_directories(self):
        """Create necessary directories if they don't exist"""
        directories = [
            self.base_storage_path,
            os.path.join(self.base_storage_path, "videos"),
            os.path.join(self.base_storage_path, "analysis_results"),
            os.path.join(self.base_storage_path, "reports")
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
            print(f"Ensured directory exists: {directory}")
    
    def generate_analysis_id(self) -> str:
        """Generate unique analysis ID with timestamp"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"analysis_{timestamp}_{unique_id}"
    
    def store_video_file(self, video_file_path: str, analysis_id: str) -> str:
        """
        Store video file in organized directory structure
        
        Args:
            video_file_path: Path to the original video file
            analysis_id: Unique analysis ID
            
        Returns:
            Path where video was stored
        """
        try:
            # Get file extension
            file_extension = os.path.splitext(video_file_path)[1]
            
            # Create destination path
            stored_video_path = os.path.join(
                self.base_storage_path, 
                "videos", 
                f"{analysis_id}{file_extension}"
            )
            
            # Copy video file
            shutil.copy2(video_file_path, stored_video_path)
            print(f"Video stored at: {stored_video_path}")
            
            return stored_video_path
            
        except Exception as e:
            print(f"Error storing video file: {str(e)}")
            raise
    
    def store_analysis_results(self, analysis_id: str, results: Dict[str, Any]) -> str:
        """
        Store analysis results as JSON file
        
        Args:
            analysis_id: Unique analysis ID
            results: Analysis results dictionary
            
        Returns:
            Path to the stored JSON file
        """
        try:
            # Add metadata to results
            results_with_metadata = {
                "analysis_id": analysis_id,
                "timestamp": datetime.now().isoformat(),
                "version": "1.0",
                "data": results
            }
            
            # Create JSON file path
            json_file_path = os.path.join(
                self.base_storage_path,
                "analysis_results",
                f"{analysis_id}.json"
            )
            
            # Write JSON file with proper formatting
            with open(json_file_path, 'w', encoding='utf-8') as json_file:
                json.dump(results_with_metadata, json_file, indent=2, ensure_ascii=False)
            
            print(f"Analysis results stored at: {json_file_path}")
            return json_file_path
            
        except Exception as e:
            print(f"Error storing analysis results: {str(e)}")
            raise
    
    def store_complete_analysis(self, video_file_path: str, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Complete storage operation - stores both video and analysis results
        
        Args:
            video_file_path: Path to the original video file
            results: Analysis results dictionary
            
        Returns:
            Dictionary with storage paths
        """
        try:
            # Generate analysis ID
            analysis_id = self.generate_analysis_id()
            
            # Store video file
            stored_video_path = self.store_video_file(video_file_path, analysis_id)
            
            # Store analysis results
            stored_json_path = self.store_analysis_results(analysis_id, results)
            
            # Generate summary report
            report_path = self.generate_summary_report(analysis_id, results)
            
            return {
                "analysis_id": analysis_id,
                "video_path": stored_video_path,
                "json_path": stored_json_path,
                "report_path": report_path,
                "success": True
            }
            
        except Exception as e:
            print(f"Error in complete analysis storage: {str(e)}")
            return {
                "analysis_id": None,
                "video_path": None,
                "json_path": None,
                "report_path": None,
                "success": False,
                "error": str(e)
            }
    
    def generate_summary_report(self, analysis_id: str, results: Dict[str, Any]) -> str:
        """
        Generate a human-readable summary report
        
        Args:
            analysis_id: Unique analysis ID
            results: Analysis results dictionary
            
        Returns:
            Path to the summary report
        """
        try:
            report_path = os.path.join(
                self.base_storage_path,
                "reports",
                f"{analysis_id}_summary.txt"
            )
            
            with open(report_path, 'w', encoding='utf-8') as report_file:
                report_file.write(f"VIDEO ANALYSIS REPORT\n")
                report_file.write(f"=====================\n\n")
                report_file.write(f"Analysis ID: {analysis_id}\n")
                report_file.write(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                
                # Overall Score
                overall_score = results.get('metrics', {}).get('overall_effectiveness_score', 0)
                report_file.write(f"OVERALL EFFECTIVENESS SCORE: {overall_score:.1f}%\n\n")
                
                # Transcription Summary
                transcription = results.get('transcription', 'No transcription available')
                report_file.write(f"TRANSCRIPTION SUMMARY:\n")
                report_file.write(f"{transcription[:500]}...\n\n" if len(transcription) > 500 else f"{transcription}\n\n")
                
                # Sentiment Analysis
                sentiment = results.get('sentiment', {})
                report_file.write(f"TEXT SENTIMENT: {sentiment.get('sentiment', 'Unknown')} ({sentiment.get('score', 0)}%)\n\n")
                
                # Human Sentiment
                human_sentiment = results.get('human_sentiment', {})
                report_file.write(f"HUMAN SENTIMENT ANALYSIS:\n")
                report_file.write(f"  - Facial Score: {human_sentiment.get('facial_score', 0):.1f}%\n")
                report_file.write(f"  - Body Language Score: {human_sentiment.get('body_score', 0):.1f}%\n")
                report_file.write(f"  - Combined Score: {human_sentiment.get('combined_score', 0):.1f}%\n")
                report_file.write(f"  - Dominant Emotion: {human_sentiment.get('dominant_emotion', 'Unknown')}\n\n")
                
                # Detected Products
                products = results.get('detected_products', [])
                report_file.write(f"DETECTED PRODUCTS:\n")
                for product in products:
                    report_file.write(f"  - {product.get('name', 'Unknown')}: {product.get('count', 0)} detections\n")
                
                if not products:
                    report_file.write(f"  No products detected\n")
                
                report_file.write(f"\nFor detailed analysis, check the JSON file: {analysis_id}.json\n")
            
            print(f"Summary report generated at: {report_path}")
            return report_path
            
        except Exception as e:
            print(f"Error generating summary report: {str(e)}")
            return None
    
    def get_analysis_by_id(self, analysis_id: str) -> Dict[str, Any]:
        """
        Retrieve analysis results by ID
        
        Args:
            analysis_id: Analysis ID to retrieve
            
        Returns:
            Analysis data dictionary
        """
        try:
            json_file_path = os.path.join(
                self.base_storage_path,
                "analysis_results",
                f"{analysis_id}.json"
            )
            
            if not os.path.exists(json_file_path):
                return {"error": f"Analysis {analysis_id} not found"}
            
            with open(json_file_path, 'r', encoding='utf-8') as json_file:
                return json.load(json_file)
                
        except Exception as e:
            return {"error": f"Error retrieving analysis: {str(e)}"}
    
    def list_all_analyses(self) -> list:
        """
        List all stored analyses
        
        Returns:
            List of analysis metadata
        """
        try:
            analyses = []
            results_dir = os.path.join(self.base_storage_path, "analysis_results")
            
            for filename in os.listdir(results_dir):
                if filename.endswith('.json'):
                    analysis_id = filename.replace('.json', '')
                    analysis_data = self.get_analysis_by_id(analysis_id)
                    
                    if 'error' not in analysis_data:
                        analyses.append({
                            'analysis_id': analysis_id,
                            'timestamp': analysis_data.get('timestamp'),
                            'overall_score': analysis_data.get('data', {}).get('metrics', {}).get('overall_effectiveness_score', 0)
                        })
            
            # Sort by timestamp (newest first)
            analyses.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            return analyses
            
        except Exception as e:
            print(f"Error listing analyses: {str(e)}")
            return []