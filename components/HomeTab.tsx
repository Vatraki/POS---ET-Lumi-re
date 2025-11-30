import React, { useState } from 'react';
import { usePOS } from '../store';
import { Order } from '../types';
import { Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Receipt } from './Receipt';

export const HomeTab: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, processPayment } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const categories = ['Tout', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'Tout' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = processPayment();
    if (order) setLastOrder(order);
  };

  const ShoppingBagIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="opacity-50"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  return (
    <div className="flex flex-col md:flex-row h-full gap-3 md:gap-4 lg:gap-6">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar shrink-0 snap-x">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`snap-start px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-1 md:pr-2 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 pb-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl active:scale-95 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col h-24 md:h-28 lg:h-32 justify-between group relative overflow-hidden"
              >
                <div>
                  <h3 className="font-bold text-xs md:text-sm lg:text-base text-gray-800 dark:text-white line-clamp-2 leading-tight">{product.name}</h3>
                  <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{product.category}</span>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm md:text-base lg:text-lg">{product.price.toFixed(2)}€</span>
                  <div className="bg-blue-600 text-white p-1.5 rounded-lg opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <Plus size={14} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-80 lg:w-96 h-[35%] md:h-full bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden shrink-0 transition-colors duration-300 z-10">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-base lg:text-xl font-bold text-gray-800 dark:text-white">Panier</h2>
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 hidden md:block">{new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="md:hidden text-sm font-bold text-blue-600 dark:text-blue-400">
             {cart.length} articles
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2 lg:space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-2">
              <ShoppingBagIcon />
              <p className="font-medium text-sm lg:text-lg">Panier vide</p>
              <p className="text-xs opacity-75">Sélectionnez des articles</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg lg:rounded-xl group border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-bold text-gray-800 dark:text-white text-xs lg:text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white dark:bg-gray-800 rounded-md lg:rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden h-7 lg:h-8">
                    <button 
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="px-2 h-full text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="min-w-[1.5rem] lg:min-w-[2rem] text-center text-xs lg:text-sm font-bold text-gray-700 dark:text-gray-200">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="px-2 h-full text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 lg:p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div className="space-y-1 mb-2 lg:mb-3 hidden md:block">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>TVA (10%)</span>
              <span>{(cartTotal * 0.1).toFixed(2)}€</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-3 lg:mb-4 pt-0 md:pt-3 border-t-0 md:border-t border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{(cartTotal * 1.1).toFixed(2)}€</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 lg:py-4 rounded-xl bg-green-600 text-white font-bold text-sm lg:text-lg hover:bg-green-700 dark:hover:bg-green-500 shadow-lg shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 duration-100"
          >
            <CreditCard size={20} /> <span className="lg:inline">Encaisser</span>
          </button>
        </div>
      </div>

      {lastOrder && <Receipt order={lastOrder} onClose={() => setLastOrder(null)} />}
    </div>
  );
};