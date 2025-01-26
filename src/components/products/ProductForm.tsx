'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUpload, 
  faSpinner, 
  faPlus,
  faXmark 
} from '@fortawesome/free-solid-svg-icons';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, ProductFormData, FormSubmitEvent, Category } from '@/types';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<Product>;
  isLoading?: boolean;
  categories: Category[];
  onAddCategory: (category: { name: string; description: string }) => void;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  category?: string;
  description?: string;
  image?: string;
}

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  category: HTMLSelectElement;
  price: HTMLInputElement;
  stock: HTMLInputElement;
  description: HTMLTextAreaElement;
  'file-upload': HTMLInputElement;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function ProductForm({ 
  onSubmit, 
  initialData, 
  isLoading = false,
  categories,
  onAddCategory
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateForm = (formData: ProductFormData): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters long';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!imagePreview && !formData.imageUrl) {
      newErrors.image = 'Please upload a product image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImage = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload a JPEG, PNG, or GIF image.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setErrors(prev => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormSubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as FormElements;

    try {
      let imageUrl = imagePreview;
      
      // If there's a new file selected, upload it
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const formData: ProductFormData = {
        name: formElements.name.value.trim(),
        category: formElements.category.value,
        price: parseFloat(formElements.price.value),
        stock: parseInt(formElements.stock.value, 10),
        description: formElements.description.value.trim(),
        imageUrl
      };

      if (validateForm(formData)) {
        await onSubmit(formData);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        image: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim() && newCategory.description.trim()) {
      onAddCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      setShowNewCategory(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-skin-secondary mb-2">
          Product Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-skin-primary rounded-lg">
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative">
                <div className="mx-auto h-32 w-32 relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-error text-white rounded-full p-1 hover:bg-error/80 transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <FontAwesomeIcon 
                  icon={isUploading ? faSpinner : faCloudUpload} 
                  className={`mx-auto h-12 w-12 text-skin-muted ${isUploading ? 'animate-spin' : ''}`}
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
                      accept={ALLOWED_FILE_TYPES.join(',')}
                      onChange={handleImageChange}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-skin-muted">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-error">{errors.image}</p>
        )}
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
              className={`w-full px-3 py-2 border ${errors.name ? 'border-error' : 'border-skin-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Category
            </label>
            <div className="flex space-x-2">
              <select
                name="category"
                defaultValue={initialData?.category}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-error' : 'border-skin-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="px-3 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              </button>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category}</p>
            )}
          </div>
        </div>

        {showNewCategory && (
          <div className="p-4 border border-skin-primary rounded-lg bg-skin-primary/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-skin-primary">Add New Category</h3>
              <button
                type="button"
                onClick={() => setShowNewCategory(false)}
                className="text-skin-secondary hover:text-skin-primary"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
              </div>
              <div>
                <textarea
                  placeholder="Category Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  rows={2}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

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
              className={`w-full px-3 py-2 border ${errors.price ? 'border-error' : 'border-skin-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark`}
              required
            />
            {errors.price && (
              <p className="mt-1 text-sm text-error">{errors.price}</p>
            )}
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
              className={`w-full px-3 py-2 border ${errors.stock ? 'border-error' : 'border-skin-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark`}
              required
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-error">{errors.stock}</p>
            )}
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
            className={`w-full px-3 py-2 border ${errors.description ? 'border-error' : 'border-skin-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
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