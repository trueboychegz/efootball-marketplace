'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    seller: '',
    platform: 'Phone',
    listing_type: 'sell',
    price: '',
    team_strength: '',
    coins: '',
    whatsapp: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('SCREENSHOTS')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('SCREENSHOTS')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: dbError } = await supabase.from('accounts').insert([
        {
          title: formData.title,
          seller: formData.seller,
          platform: formData.platform,
          listing_type: formData.listing_type,
          price: formData.price ? parseFloat(formData.price) : 0,
          team_strength: formData.team_strength ? parseInt(formData.team_strength) : null,
          coins: formData.coins ? parseInt(formData.coins) : null,
          whatsapp: formData.whatsapp,
          description: formData.description,
          image_url: imageUrl,
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Post Your eFootball Account</h1>
        <p className="text-gray-400 text-sm mb-6">Fill out the details below to submit your account for admin approval.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-6 rounded-2xl text-center">
            🎉 Account submitted successfully! Redirecting to homepage...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Listing Type *</label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="sell">💰 Sell for Cash</option>
                <option value="exchange">🔄 Trade / Exchange Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Listing Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 3150+ Team Strength with Epic Messi"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Your Name / Alias *</label>
                <input
                  type="text"
                  required
                  placeholder="Seller Name"
                  value={formData.seller}
                  onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Platform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price (KSh) *</label>
                <input
                  type="number"
                  required
                  placeholder="2500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Team Strength</label>
                <input
                  type="number"
                  placeholder="3150"
                  value={formData.team_strength}
                  onChange={(e) => setFormData({ ...formData, team_strength: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Coins</label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.coins}
                  onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">WhatsApp Phone Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 0712345678"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Squad Screenshot *</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Description / Details</label>
              <textarea
                rows={3}
                placeholder="Key players, epic managers, or trade details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Listing for Approval'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
