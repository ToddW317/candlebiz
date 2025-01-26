'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPencil,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Product } from '@/types';

interface SwipeableProductProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function SwipeableProduct({ 
  product, 
  onEdit,
  onDelete
}: SwipeableProductProps) {
  return (
    <div className="relative">
      {/* Product Content */}
      <div 
        className="p-4 flex items-center justify-between bg-white hover:bg-skin-primary/5"
      >
        <div className="flex items-center space-x-4">
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
          <div>
            <h4 className="text-sm font-medium text-skin-primary">{product.name}</h4>
            <p className="text-xs text-skin-secondary">${product.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-primary-dark hover:text-interactive-hover transition-colors"
              aria-label="Edit product"
            >
              <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-error hover:text-error/80 transition-colors"
              aria-label="Delete product"
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 