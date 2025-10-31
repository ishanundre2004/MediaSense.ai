import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    uvicorn.run(
        "s3_product_api:app",
        host="0.0.0.0",
        port=8080,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )