import React, { useState, useEffect } from 'react';
import { Upload, Plus, Image as ImageIcon, Trash2, Eye, Loader, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080'; // Backend API URL

interface Product {
  name: string;
  path: string;
  thumbnail_url: string | null;
  image_count: number;
}

interface UploadTask {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  product_name: string;
  user_id: string;
  created_at: string;
  result?: any;
}

interface ProductImage {
  key: string;
  url: string;
  size: number;
  last_modified: string;
  filename: string;
}

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Poll upload task status if there's an active upload
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (uploadTask && uploadTask.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/upload/status/${uploadTask.task_id}`);
          const taskStatus = await response.json();
          setUploadTask(taskStatus);
          
          if (taskStatus.status === 'completed' || taskStatus.status === 'failed') {
            clearInterval(interval);
            setUploading(false);
            if (taskStatus.status === 'completed') {
              fetchProducts(); // Refresh product list
              resetForm();
            }
          }
        } catch (err) {
          console.error('Error checking upload status:', err);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [uploadTask]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products?user_id=default`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async (productName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productName)}?user_id=default`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product images');
      }
      
      const data = await response.json();
      setProductImages(data.images || []);
    } catch (err) {
      console.error('Error fetching product images:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (!files || files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('product_name', productName);
      formData.append('user_id', 'default');
      
      // Append all files
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to start upload');
      }

      const taskData = await response.json();
      setUploadTask(taskData);
      
    } catch (err) {
      setError('Failed to upload product');
      console.error('Upload error:', err);
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setError(null);
    }
  };

  const handleDeleteProduct = async (productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" and all its images?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(productName)}?user_id=default`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove from local state
      setProducts(products.filter(p => p.name !== productName));
      
    } catch (err) {
      setError('Failed to delete product');
      console.error('Delete error:', err);
    }
  };

  const handleViewImages = async (product: Product) => {
    setSelectedProduct(product);
    await fetchProductImages(product.name);
    setShowImagesModal(true);
  };

  const resetForm = () => {
    setProductName('');
    setFiles(null);
    setShowForm(false);
    setUploadTask(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-2">Manage your product datasets and images</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadTask && uploadTask.status === 'processing' && (
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-400">Uploading {uploadTask.product_name}...</p>
            <span className="text-blue-400">{uploadTask.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadTask.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader size={32} className="text-purple-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-xl p-12 rounded-xl border border-gray-700 text-center">
          <ImageIcon size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first product dataset</p>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 hover:border-purple-500 transition-all overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                {product.thumbnail_url ? (
                  <img
                    src={`${API_BASE_URL}${product.thumbnail_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon size={48} className="text-gray-500" />
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {product.image_count} image{product.image_count !== 1 ? 's' : ''}
                </p>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewImages(product)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.name)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={uploading}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-400 mb-2">
                  Product Name *
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Product Images Dataset *
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                  <div className="space-y-2 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-500" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploading}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {files && (
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Files</h3>
                  <ul className="space-y-2 max-h-32 overflow-y-auto">
                    {Array.from(files).map((file, index) => (
                      <li key={index} className="text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <ImageIcon size={16} className="mr-2 text-purple-500" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {formatFileSize(file.size)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg py-3 px-4 hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader size={20} className="mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="mr-2" />
                      Upload Dataset
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Images Modal */}
      {showImagesModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                  <p className="text-gray-400">{productImages.length} images</p>
                </div>
                <button 
                  onClick={() => setShowImagesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {productImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">No images found for this product</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <div key={image.key} className="bg-gray-700/50 rounded-lg overflow-hidden">
                      <img
                        src={`${API_BASE_URL}${image.url}`}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-white text-xs truncate mb-1">{image.filename}</p>
                        <p className="text-gray-400 text-xs">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}