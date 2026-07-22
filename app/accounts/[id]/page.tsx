'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // YOUR OFFICIAL ADMIN WHATSAPP NUMBER
  const ADMIN_WHATSAPP = '254757713580'; 

  useEffect(() => {
    if (params?.id) {
      checkAdminAndFetch(params.id as string);
    }
  }, [params?.id]);

  const checkAdminAndFetch = async (id: string) => {
    setLoading(true);

    // Check if logged-in user is Admin
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user && user.app_metadata?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // Fetch account details
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching account:', error);
    } else {
      setAccount(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="text-center py-20 text-gray-500">Loading details...</div>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-red-400">Account listing not found.</p>
          <Link href="/" className="text-blue-400 underline mt-4 inline-block">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const isExchange = account.listing_type === 'exchange';

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-400 hover:text-white mb-6 flex items-center gap-1"
        >
          &larr; Back
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Main Screenshot */}
          {account.image_url && (
            <div className="w-full bg-gray-950 max-h-96 flex items-center justify-center overflow-hidden">
              <img
                src={account.image_url}
                alt={account.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
              <div>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {account.platform}
                </span>
                {isExchange && (
                  <span className="ml-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Exchange / Swap
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
                  {account.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1">Listed by: <span className="text-gray-200 font-semibold">{account.seller}</span></p>
              </div>

              {!isExchange && (
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Price</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    KSh {account.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
              {account.team_strength && (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-500 uppercase block">Team Strength</span>
                  <span className="text-lg font-bold text-blue-400">{account.team_strength}</span>
                </div>
              )}
              {account.coins !== undefined && (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-500 uppercase block">eFootball Coins</span>
                  <span className="text-lg font-bold text-yellow-400">{account.coins}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {account.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-gray-950/50 p-4 rounded-xl border border-gray-800/80">
                  {account.description}
                </p>
              </div>
            )}

            {/* Contact / Purchase Section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              {isAdmin ? (
                /* ADMIN VIEW: Shows actual seller contact number */
                <div className="bg-amber-950/20 border border-amber-800/50 p-5 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-amber-400 font-bold uppercase block">
                        👑 Admin Only - Seller Contact
                      </span>
                      <span className="text-xl font-mono font-bold text-white">{account.whatsapp}</span>
                    </div>

                    <a
                      href={`https://wa.me/${account.whatsapp.replace(/[^0-9]/g, '')}?text=Hi ${account.seller}, I am the admin verifying your listing: ${account.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto text-center bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                    >
                      Chat with Seller
                    </a>
                  </div>
                </div>
              ) : (
                /* REGULAR USER VIEW: Seller contact is hidden; user contacts Admin to deal */
                <div className="bg-emerald-950/20 border border-emerald-800/50 p-5 rounded-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-emerald-400 font-bold uppercase block">
                      🔒 Verified Admin Escrow
                    </span>
                    <p className="text-sm text-gray-200 mt-0.5">
                      Contact Admin to complete purchase safely or offer trade.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                      `Hi Admin, I want to buy/exchange account ID #${account.id} (${account.title}) listed for KSh ${account.price}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shrink-0"
                  >
                    💬 Buy / Trade via Admin
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
