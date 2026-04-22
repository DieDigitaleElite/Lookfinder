import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Download, 
  Search, 
  Calendar,
  X,
  CreditCard,
  ShieldCheck,
  Package,
  Activity,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: any;
  isPremium?: boolean;
  plan?: string;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    conversionRate: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        ...doc.data()
      })) as UserData[];
      
      setUsers(fetchedUsers);
      
      const premiumCount = fetchedUsers.filter(u => u.isPremium).length;
      setStats({
        totalUsers: fetchedUsers.length,
        premiumUsers: premiumCount,
        conversionRate: fetchedUsers.length > 0 ? (premiumCount / fetchedUsers.length) * 100 : 0
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col font-sans text-brand-primary">
      {/* Header */}
      <header className="px-8 py-6 border-b border-black/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest">Admin Control Center</h1>
            <p className="text-[10px] font-medium text-brand-primary/40 uppercase tracking-widest">Systemverwaltung & Billing</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-brand-primary/40 hover:bg-black/10 transition-all"
        >
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-black/[0.02]">
        <div className="max-w-6xl mx-auto p-8 space-y-12 pb-24">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Benutzer Gesamt', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
              { label: 'Premium Abonnenten', value: stats.premiumUsers, icon: CreditCard, color: 'text-[#FF9EBE]' },
              { label: 'Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 bg-black/5 rounded-xl ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* User List & Search */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <Activity size={24} className="text-[#FF9EBE]" />
                Nutzer Verwaltung
              </h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Nutzer suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-sm font-medium w-full md:w-80 shadow-sm focus:ring-2 focus:ring-[#FF9EBE]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/[0.01]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Nutzer</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Registrierung</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-8 py-4"><div className="h-12 bg-black/5 rounded-xl w-full" /></td>
                        </tr>
                      ))
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.uid} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center font-bold text-brand-primary">
                                {user.email?.[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{user.displayName || 'Unbekannt'}</p>
                                <p className="text-[10px] text-brand-primary/40 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {user.isPremium ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-full text-[9px] font-black uppercase tracking-widest">
                                <Package size={10} />
                                {user.plan || 'Premium'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 text-brand-primary/40 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Free
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-[10px] font-bold text-brand-primary/60 flex items-center gap-2">
                              <Calendar size={12} />
                              {user.createdAt?.toDate().toLocaleDateString('de-DE')}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button className="p-2 bg-black/5 rounded-lg text-brand-primary/40 hover:bg-[#FF9EBE]/10 hover:text-[#FF9EBE] transition-all">
                              <FileText size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-brand-primary/40 font-bold uppercase tracking-widest text-xs">
                          Keine Nutzer gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Billing & Invoices Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <CreditCard size={24} className="text-brand-primary" />
              Rechnungen & Buchhaltung
            </h2>
            
            <div className="bg-black text-white p-10 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-175">
                <FileText size={200} />
              </div>
              
              <div className="relative z-10 space-y-6 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-[#FF9EBE]">
                  Stripe-Integration Aktiv
                </div>
                <h3 className="text-3xl font-serif font-black">Rechnungsmanagement</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Deine Rechnungen werden automatisch über Stripe erstellt. Um Rechnungen zu bearbeiten, 
                  Rückerstattungen zu tätigen oder detaillierte Berichte zu exportieren, nutze bitte dein Stripe Dashboard.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="https://dashboard.stripe.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-[#FF9EBE] text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#FF9EBE]/20"
                  >
                    Stripe Dashboard öffnen
                    <ArrowUpRight size={16} />
                  </a>
                  <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10">
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
