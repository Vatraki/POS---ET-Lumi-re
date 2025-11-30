import React, { useState, useMemo } from 'react';
import { usePOS } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Calendar, Users } from 'lucide-react';

export const DashboardTab: React.FC = () => {
  const { orders, isDarkMode, waiters } = usePOS();
  
  // Default to last 7 days
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>('all');

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    const start = new Date(dateRange.start);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    return orders.filter(o => {
      const orderDate = new Date(o.date);
      const inDateRange = orderDate >= start && orderDate <= end;
      const matchWaiter = selectedWaiterId === 'all' || o.waiterId === selectedWaiterId;
      return inDateRange && matchWaiter;
    });
  }, [orders, dateRange, selectedWaiterId]);

  // KPIs
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const salesData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(o => {
      const dateStr = o.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      map.set(dateStr, (map.get(dateStr) || 0) + o.total);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
          const [dayA, monthA] = a.name.split('/').map(Number);
          const [dayB, monthB] = b.name.split('/').map(Number);
          return monthA - monthB || dayA - dayB;
      });
  }, [filteredOrders]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(o => {
      o.items.forEach(item => {
        map.set(item.category, (map.get(item.category) || 0) + (item.price * item.quantity));
      });
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const waiterData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(o => {
       map.set(o.waiterName || 'Inconnu', (map.get(o.waiterName || 'Inconnu') || 0) + o.total);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
  const CHART_TEXT_COLOR = isDarkMode ? '#9ca3af' : '#64748b';
  const TOOLTIP_BG = isDarkMode ? '#1f2937' : '#ffffff';
  const TOOLTIP_BORDER = isDarkMode ? '#374151' : '#e2e8f0';

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition duration-300 flex items-start justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        {sub && <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-2 font-medium">{sub}</p>}
      </div>
      <div className={`p-2 md:p-3 rounded-lg ${color} shadow-lg shadow-current/20`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Tableau de Bord</h2>
        
        <div className="w-full md:w-auto bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-2 md:gap-3 items-stretch sm:items-center">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <Calendar size={16} className="text-gray-500 shrink-0" />
                <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                    className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 dark:text-gray-200 font-medium w-full"
                />
                <span className="text-gray-400">-</span>
                <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                    className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 dark:text-gray-200 font-medium w-full"
                />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <Users size={16} className="text-gray-500 shrink-0" />
                <select 
                    value={selectedWaiterId} 
                    onChange={(e) => setSelectedWaiterId(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 dark:text-gray-200 font-medium w-full md:min-w-[100px]"
                >
                    <option value="all">Tous les serveurs</option>
                    {waiters.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <StatCard 
          title="CA Total" 
          value={`${totalRevenue.toFixed(2)}€`} 
          sub="Sur la période"
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Commandes" 
          value={totalOrders} 
          sub="Nombre de tickets"
          icon={ShoppingBag}
          color="bg-blue-600"
        />
        <StatCard 
          title="Panier Moyen" 
          value={`${avgOrderValue.toFixed(2)}€`} 
          sub="Par client"
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <StatCard 
          title="CA / Jour" 
          value={`${(totalRevenue / (Math.max(1, (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 3600 * 24)))).toFixed(2)}€`} 
          sub="Moyenne journalière"
          icon={Calendar}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[300px] md:min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Évolution du CA</h3>
          <div className="h-[200px] md:h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.length > 0 ? salesData : [{name: '-', value: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: CHART_TEXT_COLOR, fontSize: 10}} dy={10} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: CHART_TEXT_COLOR, fontSize: 10}} tickFormatter={(val) => `${val}€`} />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? '#374151' : '#f1f5f9'}}
                    contentStyle={{borderRadius: '12px', border: `1px solid ${TOOLTIP_BORDER}`, backgroundColor: TOOLTIP_BG, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                    formatter={(value: number) => [`${value.toFixed(2)}€`, 'Revenu']}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[300px] md:min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Répartition par Catégorie</h3>
          <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{name: 'Aucune Donnée', value: 1}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: `1px solid ${TOOLTIP_BORDER}`, backgroundColor: TOOLTIP_BG, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                    formatter={(value: number) => [`${value.toFixed(2)}€`, 'Ventes']}
                  />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center mt-4">
             {categoryData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                 <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};