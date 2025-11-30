import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, PaymentMethod, Waiter } from './types';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentUser: Waiter | null;
  waiters: Waiter[];
  isDarkMode: boolean;
  login: (waiterId: string) => void;
  logout: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  processPayment: () => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleTheme: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', category: 'Café', price: 2.50 },
  { id: '2', name: 'Cappuccino', category: 'Café', price: 3.50 },
  { id: '3', name: 'Latte', category: 'Café', price: 4.00 },
  { id: '4', name: 'Croissant', category: 'Boulangerie', price: 2.00 },
  { id: '5', name: 'Pain au Chocolat', category: 'Boulangerie', price: 2.20 },
  { id: '6', name: 'Avocado Toast', category: 'Nourriture', price: 8.50 },
  { id: '7', name: 'Thé Glacé Maison', category: 'Boissons', price: 3.50 },
  { id: '8', name: 'Cheesecake', category: 'Dessert', price: 5.00 },
];

const WAITERS: Waiter[] = [
  { id: 'w1', name: 'Jean Dupont', pin: '123' },
  { id: 'w2', name: 'Sarah Martin', pin: '000' },
  { id: 'w3', name: 'Michel Roux', pin: '111' },
];

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pos_orders');
    return saved ? JSON.parse(saved).map((o: any) => ({ ...o, date: new Date(o.date) })) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<Waiter | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Theme
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Persist Data
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (waiterId: string) => {
    const waiter = WAITERS.find(w => w.id === waiterId);
    if (waiter) setCurrentUser(waiter);
  };

  const logout = () => setCurrentUser(null);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const processPayment = (): Order | null => {
    if (!currentUser || cart.length === 0) return null;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items: [...cart],
      total,
      status: OrderStatus.PAID,
      date: new Date(),
      paymentMethod: PaymentMethod.GENERIC,
      orderNumber: orders.length + 1001,
      waiterId: currentUser.id,
      waiterName: currentUser.name
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <POSContext.Provider value={{
      products,
      cart,
      orders,
      currentUser,
      waiters: WAITERS,
      isDarkMode,
      login,
      logout,
      addProduct,
      removeProduct,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartQuantity,
      processPayment,
      updateOrderStatus,
      toggleTheme
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) throw new Error("usePOS must be used within a POSProvider");
  return context;
};