import React from 'react';
import { Order } from '../types';
import { Printer } from 'lucide-react';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center no-print">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Transaction Terminée</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">Fermer</button>
        </div>
        
        <div id="receipt-area" className="p-8 overflow-y-auto font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider mb-1 text-gray-900 dark:text-white">Lumière Café</h1>
            <p className="text-gray-500 dark:text-gray-400">123 Avenue de la République</p>
            <p className="text-gray-500 dark:text-gray-400">Tél: 01 23 45 67 89</p>
          </div>
          
          <div className="border-b border-dashed border-gray-300 dark:border-gray-600 pb-2 mb-4">
            <div className="flex justify-between">
              <span>Commande #:</span>
              <span>{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{order.date.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Serveur:</span>
              <span>{order.waiterName}</span>
            </div>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                <th className="pb-1">Article</th>
                <th className="pb-1 text-center">Qté</th>
                <th className="pb-1 text-right">Prix</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">{item.price.toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Merci de votre visite !</p>
            <p>À bientôt.</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3 no-print">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            <Printer size={18} /> Imprimer
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Nouv. Commande
          </button>
        </div>
      </div>
    </div>
  );
};