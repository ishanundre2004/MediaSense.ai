from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from apify_client import ApifyClient
import pandas as pd
from transformers import pipeline
import numpy as np
from collections import Counter
import emoji
import re
from sklearn.feature_extraction.text import CountVectorizer
import uuid
import json
from datetime import datetime
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class AnalysisRequest(BaseModel):
    url: str
    results_limit: int = 100

class AnalysisResult(BaseModel):
    id: str
    url: str
    timestamp: str
    total_comments: int
    positive_comments: int
    negative_comments: int
    positive_percentage: float
    negative_percentage: float
    overall_sentiment: str
    most_liked_comment: Optional[dict]
    emotion_stats: dict
    top_keywords: list
    negative_comments_sample: list  # Changed from negative_comments to avoid duplication
    sentiment_distribution: dict

# Global variables
sentiment_analyzer = pipeline(
    task="sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment",
    return_all_scores=True
)

emotion_classifier = pipeline(
    "text-classification",
    model="bhadresh-savani/distilbert-base-uncased-emotion",
    return_all_scores=True
)

# Helper functions
def preprocess_text(text):
    emoji_sentiment_map = {
        '😍': 'love',
        '❤️': 'love',
        '🥰': 'love',
        '😘': 'love',
        '👍': 'good',
        '🔥': 'amazing',
        '😢': 'sad',
        '😭': 'sad',
        '😡': 'angry',
        '😠': 'angry',
        '🙏': 'please',
        '👏': 'applause',
        '💯': 'perfect',
        '🤔': 'thinking',
        '🤣': 'laughing',
        '😂': 'laughing',
        '😊': 'happy',
        '🥺': 'pleading',
        '💕': 'love',
    }
    
    emoji_count = len([c for c in text if c in emoji.EMOJI_DATA])
    
    if emoji_count > 0:
        emoji_percentage = emoji_count / len(text) if len(text) > 0 else 0
        
        if emoji_percentage > 0.5:
            emojis_in_text = [c for c in text if c in emoji.EMOJI_DATA]
            sentiment_words = []
            for e in emojis_in_text:
                if e in emoji_sentiment_map:
                    sentiment_words.append(emoji_sentiment_map[e])
            
            enhanced_text = text + " " + " ".join(sentiment_words)
            return enhanced_text
    
    return text

def get_sentiment_from_scores(scores):
    label_mapping = {
        'LABEL_0': 'NEGATIVE',
        'LABEL_1': 'NEUTRAL',
        'LABEL_2': 'POSITIVE'
    }
    
    max_score_item = max(scores, key=lambda x: x['score'])
    label = label_mapping.get(max_score_item['label'], max_score_item['label'])
    return {'label': label, 'score': max_score_item['score']}

def get_enhanced_sentiment(text, scores):
    sentiment = get_sentiment_from_scores(scores)
    
    if re.search(r'(😍|❤️|🥰|😘|👍|🔥){2,}', text):
        return {'label': 'POSITIVE', 'score': 0.95}
    elif re.search(r'(😢|😭|😡|😠){2,}', text):
        return {'label': 'NEGATIVE', 'score': 0.95}
    
    return sentiment

def extract_keywords(texts, n=5):
    processed_texts = [preprocess_text(text) for text in texts]
    vectorizer = CountVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(processed_texts)
    
    word_counts = np.array(X.sum(axis=0)).flatten()
    words = np.array(vectorizer.get_feature_names_out())
    
    top_indices = word_counts.argsort()[-n:][::-1]
    top_words = words[top_indices]
    top_counts = word_counts[top_indices]
    
    return [{"keyword": word, "count": int(count)} for word, count in zip(top_words, top_counts)]

# API Endpoints
@app.post("/analyze", response_model=AnalysisResult)
async def analyze_comments(request: AnalysisRequest):
    try:
        # Initialize Apify client with your API token
        client = ApifyClient("apify_api_wAQ84O9aXtfo5IeGNNNhiFzsGVaAR74hMowK")
        
        # Prepare the Actor input
        run_input = {
            "directUrls": [request.url],
            "resultsType": "comments",
            "resultsLimit": request.results_limit,
            "searchType": "user",
            "searchLimit": 1,
            "addParentData": False,
        }
        
        # Run the Actor and wait for it to finish
        run = client.actor("shu8hvrXbJbY3Eb9W").call(run_input=run_input)
        
        # Process the results
        comments_data = []
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            comments_data.append(item)
        
        if not comments_data:
            raise HTTPException(status_code=404, detail="No comments found")
        
        df = pd.DataFrame(comments_data)
        
        # Find most liked comment
        most_liked_comment = None
        if 'likesCount' in df.columns:
            most_liked_idx = df['likesCount'].idxmax()
            most_liked_comment = df.iloc[most_liked_idx].to_dict()
        
        # Perform sentiment analysis and emotion detection
        sentiments = []
        emotions = []
        
        for comment in df['text']:
            try:
                processed_text = preprocess_text(comment)
                sentiment_result = sentiment_analyzer(processed_text)
                sentiment = get_enhanced_sentiment(comment, sentiment_result[0])
                sentiments.append(sentiment)
                
                emotion_result = emotion_classifier(processed_text)
                emotions.append(emotion_result[0])
            except Exception as e:
                sentiments.append({"label": "NEUTRAL", "score": 0.5})
                emotions.append([{"label": "neutral", "score": 1.0}])
        
        # Add results to DataFrame
        df['sentiment'] = [item['label'] for item in sentiments]
        df['confidence'] = [item['score'] for item in sentiments]
        
        # Process emotion results
        emotion_labels = []
        for emotion_scores in emotions:
            top_emotion = max(emotion_scores, key=lambda x: x['score'])
            emotion_labels.append(top_emotion['label'])
        
        df['emotion'] = emotion_labels
        
        # Calculate statistics
        emotion_counts = Counter(emotion_labels)
        total_comments = len(df)
        emotion_stats = {
            emotion: (count / total_comments * 100) 
            for emotion, count in emotion_counts.items()
        }
        
        # Extract keywords
        top_keywords = extract_keywords(df['text'].tolist(), n=5)
        
        # Get negative comments sample
        negative_comments = df[df['sentiment'] == 'NEGATIVE'].copy()
        negative_comments = negative_comments.sort_values(by='confidence', ascending=False)
        negative_comments_sample = negative_comments.head(5).to_dict('records')
        
        # Count sentiments
        sentiment_counts = Counter(df['sentiment'].tolist())
        positive_perc = sentiment_counts.get('POSITIVE', 0) / total_comments * 100
        negative_perc = sentiment_counts.get('NEGATIVE', 0) / total_comments * 100
        
        # Create result
        result = AnalysisResult(
            id=str(uuid.uuid4()),
            url=request.url,
            timestamp=datetime.now().isoformat(),
            total_comments=total_comments,
            positive_comments=sentiment_counts.get('POSITIVE', 0),
            negative_comments=sentiment_counts.get('NEGATIVE', 0),
            positive_percentage=round(positive_perc, 1),
            negative_percentage=round(negative_perc, 1),
            overall_sentiment="Mostly Positive" if positive_perc > negative_perc else "Mostly Negative" if negative_perc > positive_perc else "Neutral",
            most_liked_comment=most_liked_comment,
            emotion_stats=emotion_stats,
            top_keywords=top_keywords,
            negative_comments_sample=negative_comments_sample,  # Changed to negative_comments_sample
            sentiment_distribution=dict(sentiment_counts)
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    # In a real app, you would fetch this from a database
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)