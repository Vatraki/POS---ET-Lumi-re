import React from 'react';
import { usePOS } from '../store';
import { OrderStatus } from '../types';
import { Check, Clock, Coffee } from 'lucide-react';

export const KitchenTab: React.FC = () => {
  const { orders, updateOrderStatus } = usePOS();
  
  // Active = Paid (Waiting to be made) or Prepared (Waiting to be served/cleared)
  // Actually, standard KDS: Paid -> Prepared -> Delivered/Archived.
  // We will show Paid in the main view.
  const activeOrders = orders.filter(o => o.status === OrderStatus.PAID).sort((a, b) => a.date.getTime() - b.date.getTime());
  const preparedOrders = orders.filter(o => o.status === OrderStatus.PREPARED).slice(0, 5); 

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.PREPARED);
  };

  const handleArchive = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.DELIVERED);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 md:mb-6 flex items-center gap-3 shrink-0">
        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600 dark:text-orange-400">
          <Coffee size={24} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Écran Cuisine</h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Gérez les commandes entrantes.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto md:overflow-y-hidden md:overflow-x-auto pb-4">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-full">
          {activeOrders.length === 0 && (
            <div className="w-full h-32 md:h-full flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <p>Aucune commande active</p>
            </div>
          )}
          
          {activeOrders.map(order => (
            <div key={order.id} className="w-full md:min-w-[300px] md:w-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-orange-500 flex flex-col md:h-full md:max-h-[calc(100vh-180px)] transition-colors duration-300 shrink-0">
              <div className="p-3 md:p-4 border-b border-gray-100 dark:border-gray-700 bg-orange-50/50 dark:bg-orange-900/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">#{order.orderNumber}</span>
                  <span className="text-xs font-mono bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                    {order.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-xs text-orange-700 dark:text-orange-400 font-medium flex items-center gap-1">
                     <Clock size={12} /> il y a {Math.floor((new Date().getTime() - order.date.getTime()) / 60000)} min
                   </div>
                   <div className="text-xs text-gray-500 dark:text-gray-400">
                     Svr: {order.waiterName}
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 max-h-[200px] md:max-h-none">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="bg-gray-100 dark:bg-gray-700 w-6 h-6 rounded flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">
                      {item.quantity}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 leading-tight">
                      <p className="font-medium text-sm md:text-base">{item.name}</p>
                      {item.category === 'Café' && <p className="text-xs text-gray-400 mt-0.5">Taille standard</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <button 
                  onClick={() => handleMarkReady(order.id)}
                  className="w-full py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/30 text-sm md:text-base"
                >
                  <Check size={18} /> Prêt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recently Prepared Section (Footer) */}
      {preparedOrders.length > 0 && (
        <div className="mt-4 md:mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 shrink-0">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Prêt à servir</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
             {preparedOrders.map(order => (
               <div key={order.id} className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-lg p-3 flex items-center gap-3 min-w-[200px]">
                 <div className="bg-white dark:bg-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-green-700 dark:text-green-100 border border-green-200 dark:border-green-700 shrink-0">
                    {order.orderNumber}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100 truncate">{order.items.length} articles</p>
                    <p className="text-xs text-green-700 dark:text-green-300 truncate">{order.waiterName}</p>
                 </div>
                 <button onClick={() => handleArchive(order.id)} className="text-green-400 hover:text-green-700 dark:hover:text-green-200 p-1">
                    <Check size={16} />
                 </button>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};