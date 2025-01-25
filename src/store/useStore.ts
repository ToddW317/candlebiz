import { create } from 'zustand';
import { User } from 'firebase/auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  user: User | null;
  cart: CartItem[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  cart: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),

  updateCartItemQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ),
    })),

  clearCart: () => set({ cart: [] }),
}));

export default useStore; 