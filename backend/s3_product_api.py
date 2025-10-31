from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict
import uvicorn
import os
from datetime import datetime
import asyncio
import uuid
import shutil
from pathlib import Path

app = FastAPI(
    title="Product Image Management API",
    description="API for managing product images in local storage",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local storage configuration
BASE_STORAGE_PATH = "./product_images"
os.makedirs(BASE_STORAGE_PATH, exist_ok=True)

# In-memory storage for upload tasks (use database in production)
upload_tasks = {}

class UploadTask:
    def __init__(self, task_id: str, product_name: str, user_id: str):
        self.task_id = task_id
        self.product_name = product_name
        self.user_id = user_id
        self.status = "processing"  # processing, completed, failed
        self.progress = 0
        self.result = None
        self.created_at = datetime.now()

class LocalStorageManager:
    def __init__(self, base_path: str = BASE_STORAGE_PATH):
        self.base_path = Path(base_path)
        self.base_path.mkdir(exist_ok=True)
        print(f"Local Storage Manager initialized with path: {base_path}")

    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for filesystem compatibility"""
        # Replace spaces and special characters
        sanitized = "".join(c if c.isalnum() or c in ('-', '_') else '_' for c in filename)
        return sanitized.lower()

    def _get_product_path(self, product_name: str, user_id: str = "default") -> Path:
        """Get the directory path for a product"""
        sanitized_name = self._sanitize_filename(product_name)
        return self.base_path / user_id / sanitized_name

    def upload_product_images(self, product_name: str, image_files: List, user_id: str = "default") -> Dict:
        """
        Upload multiple product images to local storage
        
        Args:
            product_name: Name of the product
            image_files: List of file paths (not file objects)
            user_id: User identifier for organizing files
            
        Returns:
            Dictionary with upload results
        """
        try:
            # Create product directory
            product_path = self._get_product_path(product_name, user_id)
            product_path.mkdir(parents=True, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            uploaded_files = []
            failed_uploads = []
            
            for i, file_path in enumerate(image_files):
                try:
                    file_path = Path(file_path)
                    if not file_path.exists():
                        raise FileNotFoundError(f"File not found: {file_path}")
                    
                    # Get file extension
                    file_extension = file_path.suffix.lower()
                    if not file_extension:
                        file_extension = '.jpg'
                    
                    # Generate unique filename
                    unique_filename = f"{self._sanitize_filename(product_name)}_{timestamp}_{i+1}{file_extension}"
                    destination_path = product_path / unique_filename
                    
                    # Copy file to product directory
                    shutil.copy2(file_path, destination_path)
                    
                    uploaded_files.append({
                        'original_name': file_path.name,
                        'local_path': str(destination_path),
                        'filename': unique_filename,
                        'url': f"/images/{user_id}/{self._sanitize_filename(product_name)}/{unique_filename}"
                    })
                    
                    print(f"Successfully saved: {destination_path}")
                    
                except Exception as e:
                    failed_uploads.append({
                        'file': str(file_path),
                        'error': str(e)
                    })
                    print(f"Failed to save {file_path}: {str(e)}")
            
            return {
                'success': True,
                'product_name': product_name,
                'total_files': len(image_files),
                'uploaded_count': len(uploaded_files),
                'failed_count': len(failed_uploads),
                'uploaded_files': uploaded_files,
                'failed_uploads': failed_uploads,
                'timestamp': timestamp,
                'product_path': str(product_path)
            }
            
        except Exception as e:
            print(f"Error in upload_product_images: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'product_name': product_name,
                'uploaded_files': [],
                'failed_uploads': []
            }

    def list_products(self, user_id: str = "default") -> List[Dict]:
        """
        List all products for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            List of product information
        """
        try:
            products = []
            user_path = self.base_path / user_id
            
            if not user_path.exists():
                return []
            
            for product_dir in user_path.iterdir():
                if product_dir.is_dir():
                    product_name = product_dir.name
                    
                    # Get image files
                    image_files = list(product_dir.glob("*.*"))
                    image_files = [f for f in image_files if f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}]
                    
                    # Get first image for thumbnail
                    thumbnail_url = None
                    if image_files:
                        first_image = image_files[0]
                        thumbnail_url = f"/images/{user_id}/{product_name}/{first_image.name}"
                    
                    products.append({
                        'name': product_name.replace('_', ' ').title(),  # Convert back to readable name
                        'path': str(product_dir),
                        'thumbnail_url': thumbnail_url,
                        'image_count': len(image_files)
                    })
            
            return products
            
        except Exception as e:
            print(f"Error listing products: {str(e)}")
            return []

    def get_product_images(self, product_name: str, user_id: str = "default") -> List[Dict]:
        """
        Get all images for a specific product
        
        Args:
            product_name: Name of the product
            user_id: User identifier
            
        Returns:
            List of image information
        """
        try:
            product_path = self._get_product_path(product_name, user_id)
            
            if not product_path.exists():
                return []
            
            images = []
            for image_file in product_path.iterdir():
                if image_file.is_file() and image_file.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}:
                    images.append({
                        'key': str(image_file),
                        'url': f"/images/{user_id}/{self._sanitize_filename(product_name)}/{image_file.name}",
                        'size': image_file.stat().st_size,
                        'last_modified': datetime.fromtimestamp(image_file.stat().st_mtime).isoformat(),
                        'filename': image_file.name
                    })
            
            return images
            
        except Exception as e:
            print(f"Error getting product images: {str(e)}")
            return []

    def delete_product(self, product_name: str, user_id: str = "default") -> Dict:
        """
        Delete a product and all its images
        
        Args:
            product_name: Name of the product to delete
            user_id: User identifier
            
        Returns:
            Delete operation result
        """
        try:
            product_path = self._get_product_path(product_name, user_id)
            
            if not product_path.exists():
                return {
                    'success': False,
                    'error': 'Product not found'
                }
            
            # Count files before deletion
            file_count = len(list(product_path.glob("*.*")))
            
            # Remove directory and all contents
            shutil.rmtree(product_path)
            
            return {
                'success': True,
                'message': f"Deleted product '{product_name}' and {file_count} images",
                'deleted_count': file_count
            }
            
        except Exception as e:
            print(f"Error deleting product: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Initialize Local Storage Manager
storage_manager = LocalStorageManager()

@app.get("/")
async def root():
    return {
        "message": "Product Image Management API",
        "version": "1.0.0",
        "storage_type": "local_filesystem",
        "storage_path": BASE_STORAGE_PATH,
        "endpoints": {
            "upload": "POST /upload",
            "list_products": "GET /products",
            "get_product_images": "GET /products/{product_name}",
            "delete_product": "DELETE /products/{product_name}",
            "upload_status": "GET /upload/status/{task_id}",
            "images": "GET /images/{user_id}/{product_name}/{filename}"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "storage_type": "local_filesystem",
        "storage_path": BASE_STORAGE_PATH
    }

@app.post("/upload")
async def upload_product(
    background_tasks: BackgroundTasks,
    product_name: str = Form(..., description="Name of the product"),
    user_id: str = Form("default", description="User identifier"),
    files: List[UploadFile] = File(..., description="Product image files")
):
    """
    Upload product images to local storage
    
    - **product_name**: Name of the product
    - **user_id**: User identifier (optional, defaults to "default")
    - **files**: List of image files (PNG, JPG, JPEG, etc.)
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Validate file types
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
    for file in files:
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed: {file.filename}. Allowed types: {', '.join(allowed_extensions)}"
            )
    
    # Create upload task
    task_id = str(uuid.uuid4())
    upload_task = UploadTask(task_id, product_name, user_id)
    upload_tasks[task_id] = upload_task
    
    # Start background processing
    background_tasks.add_task(
        process_upload_task,
        task_id,
        product_name,
        user_id,
        files
    )
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": f"Upload started for {len(files)} images",
        "product_name": product_name,
        "user_id": user_id
    }

async def process_upload_task(
    task_id: str,
    product_name: str,
    user_id: str,
    files: List[UploadFile]
):
    """Process upload task in background"""
    try:
        task = upload_tasks[task_id]
        task.status = "processing"
        task.progress = 10
        
        # Save files temporarily and process
        temp_files = []
        try:
            # Save all files first, then process them
            for i, file in enumerate(files):
                # Create temporary file path
                temp_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
                
                # Read file content and save to temp location
                content = await file.read()
                with open(temp_path, "wb") as buffer:
                    buffer.write(content)
                
                temp_files.append(temp_path)
                
                # Update progress
                task.progress = 10 + (i / len(files)) * 40
                
            task.progress = 50
            
            # Upload to local storage using the saved temp files
            upload_result = storage_manager.upload_product_images(
                product_name=product_name,
                image_files=temp_files,
                user_id=user_id
            )
            
            task.progress = 100
            task.status = "completed"
            task.result = upload_result
            
        except Exception as e:
            task.status = "failed"
            task.result = {"error": str(e)}
            print(f"Error in upload processing: {e}")
        finally:
            # Clean up temporary files
            for temp_file in temp_files:
                try:
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                except Exception as e:
                    print(f"Error cleaning up temp file {temp_file}: {e}")
                    
    except Exception as e:
        task = upload_tasks[task_id]
        task.status = "failed"
        task.result = {"error": str(e)}
        print(f"Upload task failed: {e}")

@app.get("/upload/status/{task_id}")
async def get_upload_status(task_id: str):
    """Get status of an upload task"""
    if task_id not in upload_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = upload_tasks[task_id]
    return {
        "task_id": task_id,
        "status": task.status,
        "progress": task.progress,
        "product_name": task.product_name,
        "user_id": task.user_id,
        "created_at": task.created_at.isoformat(),
        "result": task.result
    }

@app.get("/products")
async def get_all_products(
    user_id: str = "default",
    page: int = 1,
    limit: int = 50
):
    """
    Get list of all products for a user
    
    - **user_id**: User identifier (optional)
    - **page**: Page number for pagination (optional)
    - **limit**: Number of items per page (optional)
    """
    try:
        products = storage_manager.list_products(user_id=user_id)
        
        # Simple pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_products = products[start_idx:end_idx]
        
        return {
            "products": paginated_products,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(products),
                "pages": (len(products) + limit - 1) // limit
            },
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving products: {str(e)}")

@app.get("/products/{product_name}")
async def get_product_details(
    product_name: str,
    user_id: str = "default"
):
    """
    Get details and images for a specific product
    
    - **product_name**: Name of the product
    - **user_id**: User identifier (optional)
    """
    try:
        images = storage_manager.get_product_images(product_name, user_id)
        
        if not images:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {
            "product_name": product_name,
            "user_id": user_id,
            "total_images": len(images),
            "images": images
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving product: {str(e)}")

@app.delete("/products/{product_name}")
async def remove_product(
    product_name: str,
    user_id: str = "default"
):
    """
    Delete a product and all its images
    
    - **product_name**: Name of the product to delete
    - **user_id**: User identifier (optional)
    """
    try:
        result = storage_manager.delete_product(product_name, user_id)
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Unknown error'))
        
        return {
            "message": f"Product '{product_name}' deleted successfully",
            "deleted_count": result.get('deleted_count', 0),
            "user_id": user_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")

@app.get("/images/{user_id}/{product_name}/{filename}")
async def get_image(user_id: str, product_name: str, filename: str):
    """
    Serve product images directly
    """
    try:
        product_path = storage_manager._get_product_path(product_name, user_id)
        image_path = product_path / filename
        
        if not image_path.exists() or not image_path.is_file():
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Return the image file
        from fastapi.responses import FileResponse
        
        # Detect media type based on file extension
        extension = image_path.suffix.lower()
        media_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.webp': 'image/webp'
        }
        media_type = media_types.get(extension, 'image/jpeg')
        
        return FileResponse(
            path=image_path,
            media_type=media_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving image: {str(e)}")

@app.get("/storage/info")
async def get_storage_info():
    """Get storage information"""
    try:
        total_size = 0
        total_products = 0
        total_images = 0
        
        for user_dir in Path(BASE_STORAGE_PATH).iterdir():
            if user_dir.is_dir():
                for product_dir in user_dir.iterdir():
                    if product_dir.is_dir():
                        total_products += 1
                        for image_file in product_dir.iterdir():
                            if image_file.is_file():
                                total_images += 1
                                total_size += image_file.stat().st_size
        
        return {
            "storage_type": "local_filesystem",
            "base_path": BASE_STORAGE_PATH,
            "total_products": total_products,
            "total_images": total_images,
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting storage info: {str(e)}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        log_level="info"
    )