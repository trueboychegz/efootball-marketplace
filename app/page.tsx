'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Account {
  id: string;
  title: string;
  seller: string;
  platform: string;
  price: number;
  team_strength?: number;
  coins?: number;
  whatsapp: string;
  description?: string;
  image_url?: string;
  status: string;
  listing_type?: string;
}

export default function Home() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'exchange'>('buy');

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user || null;
    setUser(currentUser);

    if (currentUser && currentUser.app_metadata?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'approved')
      .order('id', { ascending: false });

    if (error) {
      console.error('Database fetch error:', error);
    } else if (data) {
      const sellOnly = data.filter((item) => !item.listing_type || item.listing_type === 'sell');
      setAccounts(sellOnly);
    }
    setLoading(false);
  };

  const handleProtectedNavigation = (targetPath: string, tabName: 'sell' | 'exchange') => {
    setActiveTab(tabName);
    if (!user) {
      router.push('/login');
    } else {
      router.push(targetPath);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!isAdmin) return;

    if (!confirm('Are you sure you want to delete this listing from the homepage?')) return;

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setAccounts(accounts.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          eFootball <span className="text-blue-500">Marketplace</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto text-sm md:text-base">
          Buy, Sell, or Exchange verified eFootball accounts safely in Kenya.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          
          {/* BUY CARD */}
          <div 
            onClick={() => setActiveTab('buy')}
            className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer group border ${
              activeTab === 'buy'
                ? 'bg-gray-900/90 border-emerald-500 ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-gray-900/60 border-gray-800/80 hover:border-gray-700'
            }`}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛒</div>
            <h3 className={`font-bold transition-colors ${activeTab === 'buy' ? 'text-emerald-400' : 'text-white'}`}>
              Buy Accounts
            </h3>
            <p className="text-xs text-gray-400 mt-1">Browse approved eFootball squads for KSh purchase.</p>
          </div>

          {/* SELL CARD */}
          <div 
            onClick={() => handleProtectedNavigation('/sell', 'sell')}
            className={`p-5 rounded-2xl transition-all duration-200 group cursor-pointer border ${
              activeTab === 'sell'
                ? 'bg-gray-900/90 border-emerald-500 ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-gray-900/60 border-gray-800/80 hover:border-gray-700'
            }`}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">💰</div>
            <h3 className={`font-bold transition-colors ${activeTab === 'sell' ? 'text-emerald-400' : 'text-white'}`}>
              Sell Account
            </h3>
            <p className="text-xs text-gray-400 mt-1">Exchange post here</p>
          </div>

          {/* EXCHANGE CARD */}
          <div 
            onClick={() => handleProtectedNavigation('/exchange', 'exchange')}
            className={`p-5 rounded-2xl transition-all duration-200 group cursor-pointer border ${
              activeTab === 'exchange'
                ? 'bg-gray-900/90 border-emerald-500 ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-gray-900/60 border-gray-800/80 hover:border-gray-700'
            }`}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔄</div>
            <h3 className={`font-bold transition-colors ${activeTab === 'exchange' ? 'text-emerald-400' : 'text-white'}`}>
              Exchange Account
            </h3>
            <p className="text-xs text-gray-400 mt-1">Swap your current eFootball account for another player's squad.</p>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Accounts For Sale</h2>
          <span className="text-xs text-gray-400 font-semibold">{accounts.length} live listings</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading marketplace...</div>
        ) : accounts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 p-10 rounded-2xl text-center text-gray-400">
            No approved accounts for sale right now. Be the first to post one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500/60 transition-all rounded-2xl overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {acc.image_url ? (
                    <div className="h-48 bg-gray-950 overflow-hidden relative">
                      <img
                        src={acc.image_url}
                        alt={acc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Platform Badge */}
                      <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        Phone
                      </span>
                    </div>
                  ) : (
                    <div className="h-36 bg-gray-950 flex items-center justify-center text-gray-600 text-xs">
                      No Squad Image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {acc.title}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>Seller: <strong className="text-gray-200">{acc.seller}</strong></span>
                      {acc.team_strength && (
                        <span>Strength: <strong className="text-blue-400">{acc.team_strength}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="px-5 py-3 border-t border-gray-800/80 bg-gray-950/40 flex items-center justify-between gap-2">
                  <span className="text-lg font-extrabold text-emerald-400">KSh {acc.price.toLocaleString()}</span>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(e, acc.id)}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-lg border border-red-500/20 transition-colors"
                        title="Delete Listing"
                      >
                        🗑️ Delete
                      </button>
                    )}
                    <Link
                      href={`/accounts/${acc.id}`}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 inline-flex items-center gap-1"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
