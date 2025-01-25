'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faPencil, 
  faTrash,
  faBox
} from '@fortawesome/free-solid-svg-icons';

// Temporary mock data
const categories = [
  {
    id: '1',
    name: 'Scented Candles',
    description: 'Aromatic candles with various fragrances',
    productCount: 12,
  },
  {
    id: '2',
    name: 'Unscented Candles',
    description: 'Classic candles without added fragrance',
    productCount: 8,
  },
  {
    id: '3',
    name: 'Gift Sets',
    description: 'Curated collections of candles and accessories',
    productCount: 4,
  },
  {
    id: '4',
    name: 'Seasonal Collections',
    description: 'Limited edition holiday and seasonal candles',
    productCount: 6,
  },
];

export default function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-skin-primary font-cormorant">
          Categories
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-primary-light/30">
                  <FontAwesomeIcon icon={faBox} className="h-5 w-5 text-primary-dark" />
                </div>
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
                <button className="p-2 text-primary-dark hover:text-interactive-hover transition-colors">
                  <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                </button>
                <button className="p-2 text-error hover:text-error/80 transition-colors">
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
        ))}
      </div>
    </div>
  );
} 