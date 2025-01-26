'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faPencil, 
  faTrash,
  faSpinner,
  faChevronDown,
  faChevronUp,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/shared/Modal';
import { Category, Product } from '@/types';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryWithProducts extends Category {
  products: Product[];
  isExpanded?: boolean;
}

interface FirestoreCategoryData {
  name: string;
  description: string;
  productCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface FirestoreProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>('');

  // Fetch categories and their products from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesQuery = query(
          collection(db, 'categories'),
          orderBy('name')
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => {
          const data = doc.data() as FirestoreCategoryData;
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            productCount: data.productCount,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            products: [],
            isExpanded: false
          };
        }) as CategoryWithProducts[];

        // Fetch all products
        const productsQuery = query(
          collection(db, 'products'),
          orderBy('name')
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => {
          const data = doc.data() as FirestoreProductData;
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            stock: data.stock,
            status: data.status,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };
        }) as Product[];

        // Group products by category
        const categoriesWithProducts = categoriesData.map(category => ({
          ...category,
          products: productsData.filter(product => product.category === category.name)
        }));

        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory?.id) {
        // Update existing category
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          name: data.name,
          description: data.description,
          updatedAt: Timestamp.now()
        });

        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...data, updatedAt: new Date().toISOString() }
            : cat
        ));
      } else {
        // Add new category
        const docRef = await addDoc(collection(db, 'categories'), {
          name: data.name,
          description: data.description,
          productCount: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });

        setCategories(prev => [...prev, {
          id: docRef.id,
          name: data.name,
          description: data.description,
          productCount: 0,
          products: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const handleMoveProduct = (product: Product) => {
    setSelectedProduct(product);
    setTargetCategory('');
    setShowMoveModal(true);
  };

  const handleConfirmMove = async () => {
    if (!selectedProduct || !targetCategory) return;

    try {
      setIsSubmitting(true);
      const sourceCategory = categories.find(c => c.name === selectedProduct.category);
      const destCategory = categories.find(c => c.name === targetCategory);

      if (!sourceCategory || !destCategory) return;

      // Update product's category
      const productRef = doc(db, 'products', selectedProduct.id);
      await updateDoc(productRef, {
        category: targetCategory,
        updatedAt: Timestamp.now()
      });

      // Update source category count
      const sourceCategoryRef = doc(db, 'categories', sourceCategory.id);
      await updateDoc(sourceCategoryRef, {
        productCount: (sourceCategory.productCount || 0) - 1,
        updatedAt: Timestamp.now()
      });

      // Update destination category count
      const destCategoryRef = doc(db, 'categories', destCategory.id);
      await updateDoc(destCategoryRef, {
        productCount: (destCategory.productCount || 0) + 1,
        updatedAt: Timestamp.now()
      });

      // Update local state
      setCategories(prev => prev.map(cat => {
        if (cat.id === sourceCategory.id) {
          return {
            ...cat,
            productCount: (cat.productCount || 0) - 1,
            products: cat.products.filter(p => p.id !== selectedProduct.id)
          };
        }
        if (cat.id === destCategory.id) {
          return {
            ...cat,
            productCount: (cat.productCount || 0) + 1,
            products: [...cat.products, { ...selectedProduct, category: targetCategory }]
          };
        }
        return cat;
      }));

      setShowMoveModal(false);
      setSelectedProduct(null);
      setTargetCategory('');
    } catch (error) {
      console.error('Error moving product:', error);
      alert('Failed to move product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-primary-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-skin-primary font-cormorant">
          Categories
        </h1>
        <button 
          onClick={handleAddCategory}
          className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-3 rounded-full bg-primary-light/30 hover:bg-primary-light/50 transition-colors"
                  >
                    <FontAwesomeIcon 
                      icon={category.isExpanded ? faChevronUp : faChevronDown} 
                      className="h-5 w-5 text-primary-dark"
                    />
                  </button>
                  <div>
                    <h3 className="text-lg font-medium text-skin-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-skin-secondary mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-primary-dark hover:text-interactive-hover transition-colors"
                  >
                    <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-error hover:text-error/80 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-skin-primary">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-skin-secondary">Products</span>
                  <span className="font-medium text-skin-primary">{category.productCount}</span>
                </div>
              </div>
            </div>

            {/* Products List */}
            {category.isExpanded && (
              <div className="border-t border-skin-primary">
                {category.products.length > 0 ? (
                  <div className="divide-y divide-skin-primary">
                    {category.products.map((product) => (
                      <div key={product.id} className="p-4 flex items-center justify-between hover:bg-skin-primary/5">
                        <div className="flex items-center space-x-4">
                          {product.imageUrl ? (
                            <div className="h-10 w-10 relative rounded overflow-hidden">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded bg-skin-primary" />
                          )}
                          <div>
                            <h4 className="text-sm font-medium text-skin-primary">{product.name}</h4>
                            <p className="text-xs text-skin-secondary">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMoveProduct(product)}
                          className="px-3 py-1 text-sm text-primary-dark hover:text-interactive-hover transition-colors flex items-center space-x-1"
                        >
                          <span>Move</span>
                          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-skin-secondary text-sm">
                    No products in this category
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleCategorySubmit({
            name: formData.get('name') as string,
            description: formData.get('description') as string,
          });
        }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-skin-secondary mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingCategory?.name}
                className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-skin-secondary mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={editingCategory?.description}
                className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-skin-primary text-skin-primary rounded-lg hover:bg-skin-primary transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                )}
                <span>{editingCategory ? 'Update' : 'Create'} Category</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Move Product Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        title="Move Product"
        size="sm"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-skin-secondary mb-2">
              Move &ldquo;{selectedProduct?.name}&rdquo; to:
            </label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full px-3 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              required
            >
              <option value="">Select a category</option>
              {categories
                .filter(c => c.name !== selectedProduct?.category)
                .map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowMoveModal(false)}
              className="px-4 py-2 border border-skin-primary text-skin-primary rounded-lg hover:bg-skin-primary transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmMove}
              disabled={!targetCategory || isSubmitting}
              className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting && (
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              )}
              <span>Move Product</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 