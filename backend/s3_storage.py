import os
import boto3
import uuid
from typing import List, Dict, Optional
from botocore.exceptions import ClientError, NoCredentialsError
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class S3StorageManager:
    def __init__(self, 
                 aws_access_key_id: str = None,
                 aws_secret_access_key: str = None,
                 region_name: str = 'us-east-1',
                 bucket_name: str = 'product-images-bucket'):
        """
        Initialize S3 Storage Manager
        
        Args:
            aws_access_key_id: AWS access key ID (optional if using IAM roles)
            aws_secret_access_key: AWS secret access key (optional if using IAM roles)
            region_name: AWS region name
            bucket_name: S3 bucket name
        """
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
                region_name=region_name
            )
            self.bucket_name = bucket_name
            self.region_name = region_name
            
            # Create bucket if it doesn't exist
            self._ensure_bucket_exists()
            
            logger.info(f"S3 Storage Manager initialized with bucket: {bucket_name}")
            
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            raise
        except Exception as e:
            logger.error(f"Error initializing S3 Storage Manager: {str(e)}")
            raise

    def _ensure_bucket_exists(self):
        """Check if bucket exists, create if it doesn't"""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            logger.info(f"Bucket {self.bucket_name} already exists")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                # Bucket doesn't exist, create it
                try:
                    if self.region_name == 'us-east-1':
                        self.s3_client.create_bucket(Bucket=self.bucket_name)
                    else:
                        self.s3_client.create_bucket(
                            Bucket=self.bucket_name,
                            CreateBucketConfiguration={
                                'LocationConstraint': self.region_name
                            }
                        )
                    logger.info(f"Created new bucket: {self.bucket_name}")
                except ClientError as create_error:
                    logger.error(f"Error creating bucket: {str(create_error)}")
                    raise
            else:
                logger.error(f"Error checking bucket: {str(e)}")
                raise

    def upload_product_images(self, 
                            product_name: str, 
                            image_files: List, 
                            user_id: str = "default") -> Dict:
        """
        Upload multiple product images to S3
        
        Args:
            product_name: Name of the product
            image_files: List of image file objects or file paths
            user_id: User identifier for organizing files
            
        Returns:
            Dictionary with upload results
        """
        try:
            # Sanitize product name for use in file paths
            sanitized_product_name = self._sanitize_filename(product_name)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            uploaded_files = []
            failed_uploads = []
            
            for i, image_file in enumerate(image_files):
                try:
                    # Generate unique filename
                    file_extension = self._get_file_extension(image_file)
                    unique_filename = f"{sanitized_product_name}_{timestamp}_{i+1}{file_extension}"
                    
                    # S3 key path
                    s3_key = f"products/{user_id}/{sanitized_product_name}/{unique_filename}"
                    
                    # Upload to S3
                    if hasattr(image_file, 'read'):
                        # File-like object
                        self.s3_client.upload_fileobj(
                            image_file,
                            self.bucket_name,
                            s3_key,
                            ExtraArgs={
                                'ContentType': self._get_content_type(file_extension),
                                'Metadata': {
                                    'product-name': product_name,
                                    'uploaded-by': user_id,
                                    'timestamp': timestamp
                                }
                            }
                        )
                    else:
                        # File path string
                        self.s3_client.upload_file(
                            image_file,
                            self.bucket_name,
                            s3_key,
                            ExtraArgs={
                                'ContentType': self._get_content_type(file_extension),
                                'Metadata': {
                                    'product-name': product_name,
                                    'uploaded-by': user_id,
                                    'timestamp': timestamp
                                }
                            }
                        )
                    
                    # Generate public URL
                    file_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{s3_key}"
                    
                    uploaded_files.append({
                        'original_name': getattr(image_file, 'name', str(image_file)),
                        's3_key': s3_key,
                        'url': file_url,
                        'filename': unique_filename
                    })
                    
                    logger.info(f"Successfully uploaded: {s3_key}")
                    
                except Exception as e:
                    failed_uploads.append({
                        'file': getattr(image_file, 'name', str(image_file)),
                        'error': str(e)
                    })
                    logger.error(f"Failed to upload {image_file}: {str(e)}")
            
            return {
                'success': True,
                'product_name': product_name,
                'total_files': len(image_files),
                'uploaded_count': len(uploaded_files),
                'failed_count': len(failed_uploads),
                'uploaded_files': uploaded_files,
                'failed_uploads': failed_uploads,
                'timestamp': timestamp
            }
            
        except Exception as e:
            logger.error(f"Error in upload_product_images: {str(e)}")
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
            products = {}
            prefix = f"products/{user_id}/"
            
            paginator = self.s3_client.get_paginator('list_objects_v2')
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix, Delimiter='/'):
                if 'CommonPrefixes' in page:
                    for common_prefix in page['CommonPrefixes']:
                        product_path = common_prefix['Prefix']
                        product_name = product_path.replace(prefix, '').rstrip('/')
                        
                        # Get first image for thumbnail
                        images = self.s3_client.list_objects_v2(
                            Bucket=self.bucket_name,
                            Prefix=product_path,
                            MaxKeys=1
                        )
                        
                        thumbnail_url = None
                        if 'Contents' in images and len(images['Contents']) > 0:
                            thumbnail_key = images['Contents'][0]['Key']
                            thumbnail_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{thumbnail_key}"
                        
                        products[product_name] = {
                            'name': product_name,
                            'path': product_path,
                            'thumbnail_url': thumbnail_url,
                            'image_count': self._get_image_count(product_path)
                        }
            
            return list(products.values())
            
        except Exception as e:
            logger.error(f"Error listing products: {str(e)}")
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
            sanitized_name = self._sanitize_filename(product_name)
            prefix = f"products/{user_id}/{sanitized_name}/"
            
            images = []
            paginator = self.s3_client.get_paginator('list_objects_v2')
            
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                if 'Contents' in page:
                    for obj in page['Contents']:
                        image_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{obj['Key']}"
                        images.append({
                            'key': obj['Key'],
                            'url': image_url,
                            'size': obj['Size'],
                            'last_modified': obj['LastModified'],
                            'filename': obj['Key'].split('/')[-1]
                        })
            
            return images
            
        except Exception as e:
            logger.error(f"Error getting product images: {str(e)}")
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
            sanitized_name = self._sanitize_filename(product_name)
            prefix = f"products/{user_id}/{sanitized_name}/"
            
            # List all objects with this prefix
            objects_to_delete = []
            paginator = self.s3_client.get_paginator('list_objects_v2')
            
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                if 'Contents' in page:
                    objects_to_delete.extend([{'Key': obj['Key']} for obj in page['Contents']])
            
            if objects_to_delete:
                # Delete all objects
                self.s3_client.delete_objects(
                    Bucket=self.bucket_name,
                    Delete={
                        'Objects': objects_to_delete
                    }
                )
            
            return {
                'success': True,
                'message': f"Deleted product '{product_name}' and {len(objects_to_delete)} images",
                'deleted_count': len(objects_to_delete)
            }
            
        except Exception as e:
            logger.error(f"Error deleting product: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for S3 compatibility"""
        # Replace spaces and special characters
        sanitized = "".join(c if c.isalnum() or c in ('-', '_') else '_' for c in filename)
        return sanitized.lower()

    def _get_file_extension(self, file_obj) -> str:
        """Get file extension from file object or path"""
        if hasattr(file_obj, 'name'):
            filename = file_obj.name
        else:
            filename = str(file_obj)
        
        _, ext = os.path.splitext(filename)
        return ext.lower() if ext else '.jpg'

    def _get_content_type(self, file_extension: str) -> str:
        """Get content type based on file extension"""
        content_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.webp': 'image/webp'
        }
        return content_types.get(file_extension, 'application/octet-stream')

    def _get_image_count(self, prefix: str) -> int:
        """Count images in a prefix"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=1000  # Adjust based on expected maximum
            )
            return len(response.get('Contents', []))
        except Exception:
            return 0

# # Singleton instance
# s3_storage = S3StorageManager()

# # Utility functions for easy import
# def upload_product_images(product_name: str, image_files: List, user_id: str = "default"):
#     return s3_storage.upload_product_images(product_name, image_files, user_id)

# def list_products(user_id: str = "default"):
#     return s3_storage.list_products(user_id)

# def get_product_images(product_name: str, user_id: str = "default"):
#     return s3_storage.get_product_images(product_name, user_id)

# def delete_product(product_name: str, user_id: str = "default"):
#     return s3_storage.delete_product(product_name, user_id)