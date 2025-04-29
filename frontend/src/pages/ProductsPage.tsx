import React, { useState } from 'react';
import { Upload, Plus, Image as ImageIcon } from 'lucide-react';

export default function ProductsPage() {
  const [productName, setProductName] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle product creation and dataset upload
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Add New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-400 mb-2">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Product Images Dataset
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
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {files && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Files</h3>
              <ul className="space-y-2">
                {Array.from(files).map((file, index) => (
                  <li key={index} className="text-white flex items-center">
                    <ImageIcon size={16} className="mr-2 text-purple-500" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg py-2 px-4 hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
          >
            <Upload size={20} className="mr-2" />
            Upload Dataset
          </button>
        </form>
      </div>
    </div>
  );
}