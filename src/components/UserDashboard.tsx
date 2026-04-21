import React from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  History, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Camera,
  Star,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserDashboardProps {
  user: any;
  activeTab: 'overview' | 'studio' | 'gallery' | 'polls';
  setActiveTab: (tab: any) => void;
  children: React.ReactNode;
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function UserDashboard({ 
  user, 
  activeTab, 
  setActiveTab, 
  children, 
  onLogout,
  onProfileClick
}: UserDashboardProps) {
  const navItems = [
    { id: 'overview', name: 'Übersicht', icon: LayoutDashboard },
    { id: 'studio', name: 'Styling Studio', icon: Palette },
    { id: 'gallery', name: 'Meine Looks', icon: History },
    { id: 'polls', name: 'Umfragen', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-100px)] gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex flex-col gap-8">
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center gap-4 px-2">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF9EBE]" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center font-bold text-lg">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-brand-primary truncate">{user.displayName || 'Gast'}</p>
              <p className="text-[10px] text-brand-primary/40 uppercase tracking-widest font-black">Premium Mitglied</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'text-brand-primary/40 hover:bg-black/5 hover:text-brand-primary'
                }`}
              >
                <item.icon size={18} />
                {item.name}
                {activeTab === item.id && (
                  <motion.div layoutId="nav-active" className="ml-auto w-1.5 h-1.5 bg-[#FF9EBE] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-black/5 space-y-1">
            <button 
              onClick={onProfileClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-brand-primary/40 hover:bg-black/5 hover:text-brand-primary transition-all"
            >
              <Settings size={18} />
              Einstellungen
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              Abmelden
            </button>
          </div>
        </div>

        {/* Quick Stats / Info Widget */}
        <div className="hidden lg:block p-6 bg-[#FF9EBE] rounded-[2rem] text-white space-y-4 relative overflow-hidden shadow-xl shadow-[#FF9EBE]/20">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-12 -mt-12" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Dein Status</p>
           <h4 className="text-xl font-serif font-black italic">HairVision Pro</h4>
           <p className="text-xs opacity-80 leading-relaxed font-medium">Unbegrenzte Analysen & High-Res Downloads freigeschaltet.</p>
           <button 
             onClick={() => setActiveTab('studio')}
             className="w-full py-3 bg-white text-[#FF9EBE] rounded-xl text-xs font-black uppercase tracking-widest shadow-lg"
           >
             Neuen Look wagen
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
