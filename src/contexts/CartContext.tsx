
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/auth/useAuth';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  type: 'nft' | 'music' | 'merch' | 'collectible';
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  itemCount: number;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('jestfly-cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('jestfly-cart');
      }
    }
  }, []);

  // Sync cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('jestfly-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load user's cart from database if logged in
  useEffect(() => {
    if (user) {
      loadUserCart();
    }
  }, [user]);

  const loadUserCart = async () => {
    if (!user) return;

    try {
      // Check for active order (cart)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .single();

      if (orderError && orderError.code !== 'PGRST116') {
        console.error('Error fetching cart:', orderError);
        return;
      }

      // If no active cart but we have items in localStorage, create a new cart in DB
      if (!orderData && cartItems.length > 0) {
        await createCartInDatabase();
        return;
      }

      if (!orderData) return;

      // Load cart items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id, 
          quantity, 
          price_at_time,
          products (
            id, 
            title, 
            image_url, 
            type
          )
        `)
        .eq('order_id', orderData.id);

      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        return;
      }

      if (itemsData) {
        const formattedItems: CartItem[] = itemsData.map(item => ({
          id: item.id,
          productId: item.products.id,
          title: item.products.title,
          price: item.price_at_time,
          quantity: item.quantity,
          image: item.products.image_url,
          type: item.products.type
        }));

        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Error loading user cart:', error);
    }
  };

  const createCartInDatabase = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      // Create new order with 'cart' status
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'cart',
          total: cartTotal
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating cart:', orderError);
        return;
      }

      // Add all items to the new cart
      for (const item of cartItems) {
        await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_time: item.price
          });
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  // Cart management functions
  const addToCart = (product: any, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          image: product.image_url,
          type: product.type
        };
        return [...prevItems, newItem];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.title} added to your cart`,
    });

    // Open cart when adding items
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      cartTotal,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
      openCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
