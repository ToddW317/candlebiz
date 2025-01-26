export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description: string;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface FormSubmitEvent extends React.FormEvent<HTMLFormElement> {
  target: HTMLFormElement & {
    elements: {
      name: HTMLInputElement;
      category: HTMLSelectElement;
      price: HTMLInputElement;
      stock: HTMLInputElement;
      description: HTMLTextAreaElement;
      'file-upload': HTMLInputElement;
    };
  };
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string | null;
}

export interface FirebaseError extends Error {
  code: string;
  customData?: {
    email?: string;
  };
  name: string;
} 