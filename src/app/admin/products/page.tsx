'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faPencil, 
  faTrash,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/shared/Modal';
import ProductForm from '@/components/products/ProductForm';
import SwipeableProduct from '@/components/products/SwipeableProduct';
import { Product, ProductFormData, Category } from '@/types';
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
  Timestamp
} from 'firebase/firestore';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // Fetch products and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsQuery = query(
          collection(db, 'products'),
          orderBy('name', 'asc')
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);

        // Fetch categories
        const categoriesQuery = query(
          collection(db, 'categories'),
          orderBy('name')
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: Product['status']) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'text-success bg-success/10';
      case 'low stock':
        return 'text-warning bg-warning/10';
      case 'out of stock':
        return 'text-error bg-error/10';
      default:
        return 'text-skin-secondary bg-skin-primary';
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct?.id) {
        // Update existing product
        const productRef = doc(db, 'products', editingProduct.id);
        const updatedProduct: Product = {
          ...data,
          id: editingProduct.id,
          status: data.stock === 0 
            ? 'Out of Stock' 
            : data.stock <= 10 
              ? 'Low Stock' 
              : 'In Stock',
          updatedAt: new Date().toISOString()
        };
        
        // Remove id before updating Firestore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...updateData } = updatedProduct;
        await updateDoc(productRef, updateData);
        
        setProducts(currentProducts => 
          currentProducts.map(p => 
            p.id === editingProduct.id 
              ? updatedProduct
              : p
          )
        );

        // Update category product count
        if (editingProduct.category !== data.category) {
          // Decrement old category count
          const oldCategory = categories.find(c => c.name === editingProduct.category);
          if (oldCategory) {
            const oldCategoryRef = doc(db, 'categories', oldCategory.id);
            await updateDoc(oldCategoryRef, {
              productCount: (oldCategory.productCount || 0) - 1,
              updatedAt: Timestamp.now()
            });
          }

          // Increment new category count
          const newCategory = categories.find(c => c.name === data.category);
          if (newCategory) {
            const newCategoryRef = doc(db, 'categories', newCategory.id);
            await updateDoc(newCategoryRef, {
              productCount: (newCategory.productCount || 0) + 1,
              updatedAt: Timestamp.now()
            });
          }

          // Update local state
          setCategories(currentCategories => 
            currentCategories.map(c => {
              if (c.name === editingProduct.category) {
                return { ...c, productCount: (c.productCount || 0) - 1 };
              }
              if (c.name === data.category) {
                return { ...c, productCount: (c.productCount || 0) + 1 };
              }
              return c;
            })
          );
        }
      } else {
        // Add new product
        const newProduct: Omit<Product, 'id'> = {
          ...data,
          status: data.stock === 0 
            ? 'Out of Stock' 
            : data.stock <= 10 
              ? 'Low Stock' 
              : 'In Stock',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'products'), newProduct);
        const productWithId: Product = { ...newProduct, id: docRef.id };
        
        setProducts(currentProducts => [...currentProducts, productWithId]);

        // Increment category product count
        const category = categories.find(c => c.name === data.category);
        if (category) {
          const categoryRef = doc(db, 'categories', category.id);
          await updateDoc(categoryRef, {
            productCount: (category.productCount || 0) + 1,
            updatedAt: Timestamp.now()
          });

          // Update local state
          setCategories(currentCategories => 
            currentCategories.map(c => 
              c.id === category.id 
                ? { ...c, productCount: (c.productCount || 0) + 1 }
                : c
            )
          );
        }
      }
      
      setShowProductModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleAddCategory = async (categoryData: { name: string; description: string }) => {
    try {
      const newCategoryData = {
        ...categoryData,
        productCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'categories'), newCategoryData);
      const newCategory: Category = {
        id: docRef.id,
        ...newCategoryData,
        productCount: 0
      };

      setCategories(current => [...current, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Delete the product
        await deleteDoc(doc(db, 'products', productId));
        setProducts(currentProducts => 
          currentProducts.filter(p => p.id !== productId)
        );

        // Decrement category product count
        const category = categories.find(c => c.name === product.category);
        if (category) {
          const categoryRef = doc(db, 'categories', category.id);
          await updateDoc(categoryRef, {
            productCount: Math.max(0, (category.productCount || 0) - 1),
            updatedAt: Timestamp.now()
          });

          // Update local state
          setCategories(currentCategories => 
            currentCategories.map(c => 
              c.id === category.id 
                ? { ...c, productCount: Math.max(0, (c.productCount || 0) - 1) }
                : c
            )
          );
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-primary-dark" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-skin-primary font-cormorant">
              Products
            </h1>
            <button 
              onClick={handleAddProduct}
              className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-skin-muted"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              />
            </div>
            <div className="sm:w-64 relative">
              <FontAwesomeIcon 
                icon={faFilter} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-skin-muted"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-skin-primary">
                <thead className="bg-skin-primary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-skin-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-skin-primary">
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.imageUrl ? (
                            <div className="h-10 w-10 relative rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded bg-skin-primary flex-shrink-0" />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-skin-primary">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-skin-secondary">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-skin-primary">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-skin-primary">{product.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-primary-dark hover:text-interactive-hover mr-3"
                        >
                          <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-error hover:text-error/80"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-skin-primary">
              {currentProducts.map((product) => (
                <SwipeableProduct
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-skin-primary rounded-lg disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
              </button>
              <span className="text-sm text-skin-secondary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-skin-primary rounded-lg disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Product Modal */}
          <Modal
            isOpen={showProductModal}
            onClose={() => setShowProductModal(false)}
            title={editingProduct ? 'Edit Product' : 'Add New Product'}
            size="lg"
          >
            <ProductForm
              onSubmit={handleProductSubmit}
              initialData={editingProduct}
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          </Modal>
        </>
      )}
    </div>
  );
} 