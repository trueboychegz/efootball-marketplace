'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Get initial auth session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin');
      setLoading(false);
    };

    getInitialSession();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin');
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">⚽</span>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
            eFootball<span className="text-blue-500">Hub</span>
          </span>
        </Link>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          {/* Admin Badge */}
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1"
            >
              🛡️ Admin
            </Link>
          )}

          {/* Dynamic Login / Logout Button */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden sm:inline">
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                Log In / Sign Up
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
