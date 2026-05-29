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
  Filter,
  MessageSquare,
  Check,
  RotateCcw,
  Mail,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, getCountFromServer } from 'firebase/firestore';

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

  const [imageCounts, setImageCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');

  const fetchImageCounts = async (userList: UserData[]) => {
    // Initialisiere Ladestatus für alle geladenen Nutzer
    const initialLoading: Record<string, boolean> = {};
    userList.forEach(u => {
      initialLoading[u.uid] = true;
    });
    setCountsLoading(initialLoading);

    // In Chunks laden, um Datenbank-Rate-Limits zu schonen
    for (let i = 0; i < userList.length; i += 5) {
      const chunk = userList.slice(i, i + 5);
      await Promise.all(chunk.map(async (u) => {
        try {
          const resultsRef = collection(db, 'users', u.uid, 'results');
          const countSnapshot = await getCountFromServer(resultsRef);
          const count = countSnapshot.data().count;
          
          setImageCounts(prev => ({ ...prev, [u.uid]: count }));
        } catch (err) {
          console.error(`Error loading results count for ${u.uid}:`, err);
          setImageCounts(prev => ({ ...prev, [u.uid]: 0 }));
        } finally {
          setCountsLoading(prev => ({ ...prev, [u.uid]: false }));
        }
      }));
    }
  };
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsSearch, setTicketsSearch] = useState('');
  const [ticketsFilter, setTicketsFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    fetchUsers();
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setTicketsLoading(true);
    const path = 'support_tickets';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(150));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(fetched);
    } catch (err) {
      console.error("Error loading tickets", err);
      handleFirestoreError(err, OperationType.LIST, path);
    } finally {
      setTicketsLoading(false);
    }
  };

  const toggleTicketStatus = async (ticketId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'resolved' ? 'open' : 'resolved';
    const path = `support_tickets/${ticketId}`;
    try {
      const docRef = doc(db, 'support_tickets', ticketId);
      await updateDoc(docRef, { status360: newStatus });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status360: newStatus } : t));
    } catch (err) {
      console.error("Error setting ticket status", err);
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const fetchUsers = async () => {
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        uid: doc.id,
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
      
      // Berechnung der Bild-Zahlen im Hintergrund anstoßen
      fetchImageCounts(fetchedUsers);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => {
    const matchSearch = 
      t.ticketId?.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.name?.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.email?.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.subject?.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.message?.toLowerCase().includes(ticketsSearch.toLowerCase());

    if (ticketsFilter === 'open') {
      return matchSearch && t.status360 === 'open';
    }
    if (ticketsFilter === 'resolved') {
      return matchSearch && t.status360 === 'resolved';
    }
    return matchSearch;
  });

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Benutzer Gesamt', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
              { label: 'Premium Abonnenten', value: stats.premiumUsers, icon: CreditCard, color: 'text-[#FF9EBE]' },
              { label: 'KI-Bilder Gesamt (geladen)', value: loading ? '...' : (Object.values(imageCounts) as number[]).reduce((a: number, b: number) => a + b, 0), icon: Image, color: 'text-purple-500' },
              { label: 'KI-Kosten Gesamt (ca.)', value: loading ? '...' : `${((Object.values(imageCounts) as number[]).reduce((a: number, b: number) => a + b, 0) * 0.03).toFixed(2)} €`, icon: TrendingUp, color: 'text-amber-500' }
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

          {/* Segmented Tab Selector */}
          <div className="flex border-b border-black/5 pb-1 gap-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 text-sm font-black uppercase tracking-widest relative transition-all ${
                activeTab === 'users' ? 'text-[#FF9EBE]' : 'text-brand-primary/40 hover:text-brand-primary/60'
              }`}
            >
              Nutzer-Datenbank
              {activeTab === 'users' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF9EBE] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`pb-4 text-sm font-black uppercase tracking-widest relative transition-all ${
                activeTab === 'tickets' ? 'text-[#FF9EBE]' : 'text-brand-primary/40 hover:text-brand-primary/60'
              }`}
            >
              Support Tickets ({tickets.filter(t => t.status360 === 'open').length} offen)
              {activeTab === 'tickets' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF9EBE] rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'users' ? (
            /* User List & Search */
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
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">KI-Bilder</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">KI-Kosten (ca.)</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Registrierung</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [1,2,3].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={6} className="px-8 py-4"><div className="h-12 bg-black/5 rounded-xl w-full" /></td>
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
                              {countsLoading[user.uid] ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-primary/30 animate-pulse">
                                  Lädt...
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  {imageCounts[user.uid] ?? 0} Bilder
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              {countsLoading[user.uid] ? (
                                <span className="text-[10px] font-bold text-brand-primary/30 animate-pulse">...</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  {((imageCounts[user.uid] ?? 0) * 0.03).toFixed(2)} €
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
                          <td colSpan={6} className="px-8 py-12 text-center text-brand-primary/40 font-bold uppercase tracking-widest text-xs">
                            Keine Nutzer gefunden
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            /* Support Tickets Section */
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                    <MessageSquare size={24} className="text-[#FF9EBE]" />
                    Support-Anfragen
                  </h2>
                  
                  {/* Status filter pills */}
                  <div className="flex bg-black/5 p-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {(['all', 'open', 'resolved'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setTicketsFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          ticketsFilter === filter ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/45 hover:text-brand-primary/70'
                        }`}
                      >
                        {filter === 'all' ? 'Alle' : filter === 'open' ? 'Offen' : 'Erledigt'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tickets durchsuchen..."
                    value={ticketsSearch}
                    onChange={(e) => setTicketsSearch(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-sm font-medium w-full md:w-80 shadow-sm focus:ring-2 focus:ring-[#FF9EBE]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {ticketsLoading ? (
                  [1,2,3].map(i => (
                    <div key={i} className="animate-pulse bg-white p-8 rounded-[2rem] border border-black/5 h-44 w-full" />
                  ))
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className={`bg-white p-6 md:p-8 rounded-[2rem] border transition-all duration-300 shadow-sm flex flex-col gap-5 ${
                        ticket.status360 === 'open' ? 'border-[#FF9EBE]/20 hover:border-[#FF9EBE]/40 bg-white' : 'border-black/5 opacity-80 bg-black/[0.01]'
                      }`}
                    >
                      {/* Ticket Header Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-black text-xs px-3 py-1 bg-black/5 rounded-lg text-brand-primary">
                            {ticket.ticketId}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            ticket.category === 'payment' ? 'bg-[#FF9EBE]/10 text-[#FF9EBE]' :
                            ticket.category === 'bug' ? 'bg-red-50 text-red-500' :
                            ticket.category === 'feedback' ? 'bg-emerald-50 text-emerald-500' :
                            'bg-blue-50 text-blue-500'
                          }`}>
                            {ticket.category === 'payment' ? 'Zahlung / Abo' :
                             ticket.category === 'bug' ? 'Fehler / Tech' :
                             ticket.category === 'feedback' ? 'Wünsche / Lob' :
                             'Allgemein'}
                          </span>
                          {ticket.status360 === 'open' ? (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                              Offen
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-full text-[9px] font-black uppercase tracking-widest">
                              Erledigt
                            </span>
                          )}
                        </div>
                        
                        <div className="text-[10px] font-bold text-brand-primary/45 flex items-center gap-2">
                          <Calendar size={12} />
                          {ticket.createdAt?.toDate ? ticket.createdAt.toDate().toLocaleString('de-DE') : new Date(ticket.createdAt).toLocaleString('de-DE')}
                        </div>
                      </div>

                      {/* Ticket Body Content */}
                      <div className="space-y-3 text-left">
                        <div className="font-bold text-base text-brand-primary">{ticket.subject}</div>
                        <div className="text-sm text-brand-primary/70 leading-relaxed whitespace-pre-wrap bg-black/[0.01] p-4 rounded-2xl border border-black/[0.02]">
                          {ticket.message}
                        </div>
                        {ticket.userAgent && (
                          <div className="text-[9px] text-brand-primary/30 font-mono tracking-tight pt-1">
                            System-Info: {ticket.userAgent}
                          </div>
                        )}
                      </div>

                      {/* Sender Details & Action triggers */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-black/5">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-brand-primary/60">
                          <div className="flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-md bg-black/5 flex items-center justify-center font-bold text-[10px] text-brand-primary">
                              {ticket.name ? ticket.name[0].toUpperCase() : '?'}
                            </span>
                            <span>{ticket.name}</span>
                          </div>
                          <span className="text-brand-primary/20">|</span>
                          <a 
                            href={`mailto:${ticket.email}?subject=Frisuren.ai%20Support:%20${encodeURIComponent(ticket.subject)}%20(${ticket.ticketId})`}
                            className="flex items-center gap-1 hover:text-[#FF9EBE] transition-colors"
                          >
                            <Mail size={12} />
                            {ticket.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTicketStatus(ticket.id, ticket.status360)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                              ticket.status360 === 'open' 
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                : 'bg-black/5 text-brand-primary/40 hover:bg-black/10'
                            }`}
                          >
                            {ticket.status360 === 'open' ? (
                              <>
                                <Check size={14} />
                                Erledigen
                              </>
                            ) : (
                              <>
                                <RotateCcw size={14} />
                                Reaktivieren
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-12 text-center text-brand-primary/40 font-bold uppercase tracking-widest text-xs w-full">
                    Keine Support Tickets gefunden
                  </div>
                )}
              </div>
            </section>
          )}

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
