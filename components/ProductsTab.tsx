import React, { useState } from 'react';
import { usePOS } from '../store';
import { Product } from '../types';
import { Trash2, Plus } from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { products, addProduct, removeProduct } = usePOS();
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Café',
    price: 0
  });

  const categories = ['Café', 'Thé', 'Boulangerie', 'Nourriture', 'Boissons', 'Dessert'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      id: crypto.randomUUID(),
      price: Number(newProduct.price)
    });
    setNewProduct({ name: '', category: 'Café', price: 0 });
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Gestion des Produits</h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Gérez votre menu et les prix.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-purple-600 text-white px-3 md:px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 active:scale-95 text-sm md:text-base"
        >
          {isAdding ? 'Annuler' : <><Plus size={18} /> <span className="hidden md:inline">Ajouter Produit</span><span className="md:hidden">Ajouter</span></>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-purple-100 dark:border-gray-700 shadow-xl mb-4 md:mb-8 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Nouvel Article</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'article</label>
              <input 
                required
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="ex: Caramel Macchiato"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
              <select 
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix (€)</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end mt-2">
              <button type="submit" className="w-full sm:w-auto bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition shadow-md hover:shadow-lg">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 transition-colors duration-300 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Nom</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Catégorie</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Prix</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-4 font-medium text-gray-800 dark:text-white">{product.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold border border-purple-100 dark:border-purple-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800 dark:text-white font-medium text-right">{product.price.toFixed(2)}€</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">Aucun produit disponible. Ajoutez-en un pour commencer.</div>
        )}
      </div>
    </div>
  );
};