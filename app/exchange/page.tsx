'use client';

import { useEffect, useState } from 'react';
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
  description?: string;
  image_url?: string;
}

export default function ExchangePage() {
  const [exchangeAccounts, setExchangeAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeAccounts();
  }, []);

  const fetchExchangeAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'approved')
      .eq('listing_type', 'exchange')
      .order('id', { ascending: false });

    if (!error && data) {
      setExchangeAccounts(data);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-10">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/" 
            className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 group block"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛒</div>
            <h3 className="font-bold text-white">Buy Accounts</h3>
            <p className="text-xs text-gray-400 mt-1">Browse approved eFootball squads for cash purchase.</p>
          </Link>

          <Link 
            href="/sell" 
            className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 group block"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">💰</div>
            <h3 className="font-bold text-white">Sell Account</h3>
            <p className="text-xs text-gray-400 mt-1">Upload your squad screenshot and list your account for cash.</p>
          </Link>

          {/* EXCHANGE ACTIVE CARD */}
          <div className="p-5 rounded-2xl bg-gray-900/90 border border-emerald-500 ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] group">
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔄</div>
            <h3 className="font-bold text-emerald-400">Exchange Account</h3>
            <p className="text-xs text-gray-400 mt-1">Swap your current eFootball account for another player's squad.</p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Available Squads for Exchange</h2>
          <span className="text-xs text-gray-400 font-semibold">{exchangeAccounts.length} available</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading exchange offers...</div>
        ) : exchangeAccounts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 p-12 rounded-2xl text-center text-gray-400">
            No accounts currently up for exchange. Be the first to post a trade request!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-900 border border-gray-800 hover:border-purple-500/60 transition-all rounded-2xl overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {acc.image_url ? (
                    <div className="h-48 bg-gray-950 overflow-hidden relative">
                      <img
                        src={acc.image_url}
                        alt={acc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {acc.platform}
                      </span>
                      <span className="absolute top-3 right-3 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        🔄 Swap Offer
                      </span>
                    </div>
                  ) : (
                    <div className="h-36 bg-gray-950 flex items-center justify-center text-gray-600 text-xs">
                      No Squad Image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                      {acc.title}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>Trader: <strong className="text-gray-200">{acc.seller}</strong></span>
                      {acc.team_strength && (
                        <span>Strength: <strong className="text-blue-400">{acc.team_strength}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-gray-800/80 bg-gray-950/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Trade / Swap</span>
                  <Link
                    href={`/accounts/${acc.id}`}
                    className="text-xs font-semibold text-blue-400 hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
