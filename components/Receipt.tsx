import React from 'react';
import { Order } from '../types';
import { Printer, X } from 'lucide-react';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="print-overlay" 
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div 
        id="print-content" 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header - Hidden in Print */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center no-print bg-white dark:bg-gray-800 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Transaction Terminée</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {/* Receipt Area - The only part visible in print */}
        <div 
          id="receipt-area" 
          className="p-8 overflow-y-auto font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {/* Logo / Brand */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-2 text-gray-900 dark:text-white leading-none">Lumière Café</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">123 Avenue de la République</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">75011 Paris</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tél: 01 23 45 67 89</p>
          </div>
          
          {/* Order Info */}
          <div className="border-b border-dashed border-gray-300 dark:border-gray-600 pb-3 mb-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Commande</span>
              <span className="font-bold">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <span>{order.date.toLocaleDateString('fr-FR')} {order.date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Serveur</span>
              <span>{order.waiterName}</span>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-4 text-sm">
            <thead>
              <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                <th className="pb-2 font-semibold w-full">Article</th>
                <th className="pb-2 text-center px-2">Qté</th>
                <th className="pb-2 text-right whitespace-nowrap">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-100 dark:divide-gray-800">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 align-top">{item.name}</td>
                  <td className="py-2 text-center align-top px-2">{item.quantity}</td>
                  <td className="py-2 text-right align-top whitespace-nowrap">{(item.price * item.quantity).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Sous-total HT</span>
              <span>{(order.total / 1.1).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>TVA (10%)</span>
              <span>{(order.total - (order.total / 1.1)).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 dark:border-white pt-2 mt-2">
              <span>TOTAL</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-block px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs font-bold mb-4">
              {order.paymentMethod === 'GENERIC' ? 'CB / ESPÈCES' : order.paymentMethod}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Merci de votre visite !</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">SIRET: 123 456 789 00012</p>
          </div>
        </div>

        {/* Footer Actions - Hidden in Print */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3 no-print shrink-0">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Printer size={18} /> Imprimer
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};