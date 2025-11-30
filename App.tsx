import React, { useState } from 'react';
import { HomeTab } from './components/HomeTab';
import { ProductsTab } from './components/ProductsTab';
import { KitchenTab } from './components/KitchenTab';
import { DashboardTab } from './components/DashboardTab';
import { usePOS, POSProvider } from './store';
import { TabView } from './types';
import { LayoutGrid, Coffee, ChefHat, BarChart3, LogOut, UserCircle, ChevronLeft, Delete, Sun, Moon } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { waiters, login, isDarkMode, toggleTheme } = usePOS();
  const [selectedWaiterId, setSelectedWaiterId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumPad = (num: string) => {
    if (pin.length < 3) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleLogin = () => {
    const waiter = waiters.find(w => w.id === selectedWaiterId);
    if (waiter && waiter.pin === pin) {
      login(waiter.id);
    } else {
      setError(true);
      setPin('');
    }
  };

  const selectedWaiter = waiters.find(w => w.id === selectedWaiterId);

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <button onClick={toggleTheme} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md text-center transition-all duration-300">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-blue-500/30 shadow-lg">
          L
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Bienvenue chez Lumière</h1>
        
        {!selectedWaiterId ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Sélectionnez votre compte pour continuer</p>
            <div className="grid grid-cols-2 gap-4">
              {waiters.map(waiter => (
                <button
                  key={waiter.id}
                  onClick={() => setSelectedWaiterId(waiter.id)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition group flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                    <UserCircle size={24} />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-sm">{waiter.name}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => { setSelectedWaiterId(null); setPin(''); setError(false); }}
              className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 text-sm font-medium"
            >
              <ChevronLeft size={16} /> Retour
            </button>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6">Entrez le code PIN pour <strong className="text-gray-800 dark:text-white">{selectedWaiter?.name}</strong></p>
            
            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length ? 'bg-blue-600 scale-110' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 font-medium animate-pulse">Code PIN incorrect. Réessayez.</p>}

            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumPad(num.toString())}
                  className="h-16 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xl font-bold text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-95"
                >
                  {num}
                </button>
              ))}
              <div className="h-16 flex items-center justify-center"></div>
              <button
                  onClick={() => handleNumPad('0')}
                  className="h-16 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xl font-bold text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-95"
                >
                  0
              </button>
              <button
                  onClick={handleBackspace}
                  className="h-16 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 hover:text-red-500 transition active:scale-95 flex items-center justify-center"
                >
                  <Delete size={24} />
              </button>
            </div>

            <button 
              onClick={handleLogin}
              disabled={pin.length === 0}
              className="w-full max-w-[280px] py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/30"
            >
              Connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, logout, isDarkMode, toggleTheme } = usePOS();
  const [activeTab, setActiveTab] = useState<TabView>('HOME');

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'HOME': return <HomeTab />;
      case 'PRODUCTS': return <ProductsTab />;
      case 'KITCHEN': return <KitchenTab />;
      case 'DASHBOARD': return <DashboardTab />;
      default: return <HomeTab />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label, mobile = false }: { tab: TabView, icon: any, label: string, mobile?: boolean }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center transition-all duration-200 group relative
        ${mobile 
          ? 'flex-col flex-1 py-2' 
          : 'flex-col p-3 rounded-xl w-full'
        }
        ${activeTab === tab 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
        }
        ${!mobile && activeTab === tab ? 'bg-blue-50 dark:bg-gray-800' : ''}
        ${!mobile && activeTab !== tab ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
      `}
    >
      <Icon size={mobile ? 20 : 24} className={`mb-1 transition-transform duration-200 ${!mobile && activeTab !== tab ? 'group-hover:scale-110' : ''}`} />
      <span className={`${mobile ? 'text-[10px]' : 'text-[10px]'} font-bold uppercase tracking-wide`}>{label}</span>
      {!mobile && activeTab === tab && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
      {mobile && activeTab === tab && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full shadow-lg shadow-blue-500/50" />}
    </button>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
      <nav className="hidden md:flex w-24 bg-white dark:bg-gray-850 border-r border-gray-200 dark:border-gray-800 flex-col items-center py-6 gap-6 z-20 shadow-xl no-print shrink-0">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-blue-500/30 shadow-lg shrink-0">
          L
        </div>
        
        <div className="flex flex-col gap-2 w-full px-2">
          <NavButton tab="HOME" icon={LayoutGrid} label="Caisse" />
          <NavButton tab="PRODUCTS" icon={Coffee} label="Menu" />
          <NavButton tab="KITCHEN" icon={ChefHat} label="Cuisine" />
          <NavButton tab="DASHBOARD" icon={BarChart3} label="Stats" />
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 w-full px-2">
           <button 
             onClick={toggleTheme}
             className="p-3 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           
           <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

           <div className="text-center group cursor-default">
             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold shadow-md">
                {currentUser.name.charAt(0)}
             </div>
             <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate w-full px-1">{currentUser.name}</p>
           </div>
           
           <button 
             onClick={logout}
             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
             title="Déconnexion"
           >
             <LogOut size={20} />
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full w-full overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-hidden p-2 md:p-6 pb-20 md:pb-6">
          {renderTab()}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible only on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between px-2 pb-safe z-30 shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.1)]">
        <NavButton tab="HOME" icon={LayoutGrid} label="Caisse" mobile />
        <NavButton tab="PRODUCTS" icon={Coffee} label="Menu" mobile />
        <NavButton tab="KITCHEN" icon={ChefHat} label="Cuisine" mobile />
        <NavButton tab="DASHBOARD" icon={BarChart3} label="Stats" mobile />
        <button 
           onClick={logout}
           className="flex flex-col flex-1 py-2 items-center justify-center text-red-400 hover:text-red-500 transition-colors"
         >
           <LogOut size={20} className="mb-1" />
           <span className="text-[10px] font-bold uppercase tracking-wide">Sortir</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}