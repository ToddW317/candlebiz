'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ProductFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export default function ProductForm({ onSubmit, initialData, isLoading = false }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle form submission
    }}>
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-skin-secondary mb-2">
          Product Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-skin-primary rounded-lg">
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-error text-white rounded-full p-1 hover:bg-error/80 transition-colors"
                >
                  <FontAwesomeIcon icon={faCloudUpload} className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <FontAwesomeIcon 
                  icon={faCloudUpload} 
                  className="mx-auto h-12 w-12 text-skin-muted"
                />
                <div className="flex text-sm text-skin-secondary">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary-dark hover:text-interactive-hover focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-skin-muted">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={initialData?.name}
              className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Category
            </label>
            <select
              name="category"
              defaultValue={initialData?.category}
              className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white"
              required
            >
              <option value="">Select a category</option>
              <option value="scented">Scented Candles</option>
              <option value="unscented">Unscented Candles</option>
              <option value="gift-sets">Gift Sets</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              defaultValue={initialData?.price}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={initialData?.stock}
              min="0"
              className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-secondary mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData?.description}
            className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-skin-primary text-skin-primary rounded-lg hover:bg-skin-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
            )}
            <span>{initialData ? 'Update' : 'Create'} Product</span>
          </button>
        </div>
      </div>
    </form>
  );
} 