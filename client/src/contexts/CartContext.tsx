import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the cart item interface
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  type?: 'product' | 'event';
  eventId?: string;
}

// Define the cart context interface
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number, size?: string, color?: string) => void;
  updateQuantity: (id: string | number, change: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from cookies on component mount
  useEffect(() => {
    const cookieCart = getCartFromCookies();
    setCartItems(cookieCart);
    updateCartCount(cookieCart);
  }, []);

  // Update cart count when cart items change
  useEffect(() => {
    updateCartCount(cartItems);
  }, [cartItems]);

  // Get cart from cookies
  const getCartFromCookies = (): CartItem[] => {
    try {
      const cartData = document.cookie
        .split('; ')
        .find(row => row.startsWith('cart='))
        ?.split('=')[1];
      return cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
    } catch {
      return [];
    }
  };

  // Save cart to cookies
  const saveCartToCookies = (items: CartItem[]) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(items))}; expires=${expires.toUTCString()}; path=/`;
  };

  // Update cart count
  const updateCartCount = (items: CartItem[]) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // Add item to cart
  const addToCart = (newItem: CartItem) => {
    // Check if the item already exists in the cart (with the same id, size, and color)
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === newItem.id && 
      item.size === newItem.size && 
      item.color === newItem.color
    );

    let updatedCart;
    
    if (existingItemIndex !== -1) {
      // Update the quantity of the existing item
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Add new item to the cart
      updatedCart = [...cartItems, newItem];
    }
    
    setCartItems(updatedCart);
    saveCartToCookies(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (id: string | number, size?: string, color?: string) => {
    const updatedCart = cartItems.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    );
    setCartItems(updatedCart);
    saveCartToCookies(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (id: string | number, change: number, size?: string, color?: string) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.size === size && item.color === color) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    saveCartToCookies(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    saveCartToCookies([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
