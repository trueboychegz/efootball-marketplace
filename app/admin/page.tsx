'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface AccountListing {
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
  created_at?: string;
}

export default function AdminPage() {
  const [listings, setListings] = useState<AccountListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchPendingListings = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('accounts')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      setListings(listings.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-400">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Review pending listings before they are published to the marketplace.
            </p>
          </div>
          <button
            onClick={fetchPendingListings}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-4 py-2 rounded-lg border border-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading pending submissions...</div>
        ) : listings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
            No pending submissions right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Screenshot Display */}
                  {item.image_url ? (
                    <div className="relative mb-4 bg-gray-950 rounded-xl overflow-hidden border border-gray-800 group">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setSelectedImage(item.image_url || null)}
                      />
                      <button
                        onClick={() => setSelectedImage(item.image_url || null)}
                        className="absolute bottom-2 right-2 bg-black/70 text-xs text-white px-2.5 py-1 rounded-md backdrop-blur-md"
                      >
                        🔍 Tap to Expand
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center text-gray-600 text-xs mb-4">
                      No Screenshot Uploaded
                    </div>
                  )}

                  {/* Account Details */}
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-bold text-white leading-tight">{item.title}</h2>
                    <span className="text-emerald-400 font-extrabold text-lg">${item.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-3">
                    <div>
                      <span className="text-gray-500">Seller:</span> {item.seller}
                    </div>
                    <div>
                      <span className="text-gray-500">Platform:</span> {item.platform}
                    </div>
                    {item.team_strength && (
                      <div>
                        <span className="text-gray-500">Strength:</span> {item.team_strength}
                      </div>
                    )}
                    {item.coins && (
                      <div>
                        <span className="text-gray-500">Coins:</span> {item.coins}
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-500">WhatsApp:</span> {item.whatsapp}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-300 mt-3 bg-gray-950/60 p-3 rounded-lg border border-gray-800/60">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Approve / Reject Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => handleAction(item.id, 'approved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-800">
            <img
              src={selectedImage}
              alt="Full Screenshot"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-gray-800/80 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center border border-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
