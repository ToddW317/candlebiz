'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faPencil, 
  faTrash,
  faFilter,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/shared/Modal';
import ProductForm from '@/components/products/ProductForm';
import { Product, ProductFormData } from '@/types';

// Temporary mock data
const products: Product[] = [
  {
    id: '1',
    name: 'Lavender Dreams Candle',
    category: 'Scented Candles',
    price: 24.99,
    stock: 45,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Vanilla Bean & Honey',
    category: 'Scented Candles',
    price: 29.99,
    stock: 12,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Ocean Breeze Collection',
    category: 'Gift Sets',
    price: 49.99,
    stock: 0,
    status: 'Out of Stock',
  },
  // Add more mock products as needed
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    // Handle product submission
    console.log('Product data:', data);
    setShowProductModal(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
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

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
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
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white"
            >
              <option value="all">All Categories</option>
              <option value="scented">Scented Candles</option>
              <option value="unscented">Unscented Candles</option>
              <option value="gift-sets">Gift Sets</option>
            </select>
            <FontAwesomeIcon 
              icon={faFilter} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-skin-muted pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-skin-primary">
            <thead>
              <tr className="bg-skin-primary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-skin-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skin-primary">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-skin-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-skin-primary">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-secondary">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-primary">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-secondary">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="text-primary-dark hover:text-interactive-hover transition-colors"
                    >
                      <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                    </button>
                    <button className="text-error hover:text-error/80 transition-colors">
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-skin-primary">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-skin-primary bg-white border border-skin-primary rounded-lg hover:bg-skin-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 px-4 py-2 text-sm font-medium text-skin-primary bg-white border border-skin-primary rounded-lg hover:bg-skin-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-skin-secondary">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, products.length)}</span> of{' '}
                  <span className="font-medium">{products.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-skin-primary bg-white text-sm font-medium text-skin-primary hover:bg-skin-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </button>
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-skin-primary text-sm font-medium ${
                        currentPage === i + 1
                          ? 'bg-skin-primary text-primary-dark'
                          : 'bg-white text-skin-primary hover:bg-skin-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-skin-primary bg-white text-sm font-medium text-skin-primary hover:bg-skin-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

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
        />
      </Modal>
    </div>
  );
} 