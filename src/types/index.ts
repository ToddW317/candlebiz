export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description?: string;
  imageUrl?: string;
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

export type ProductFormData = Omit<Product, 'id' | 'status'> & {
  image?: File;
};

export interface FirebaseError extends Error {
  code: string;
  customData?: {
    email?: string;
  };
  name: string;
} 