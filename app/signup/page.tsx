'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const cleanUsername = username.trim().toLowerCase()

    // 1. Check if username is already taken in profiles table
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', cleanUsername)
      .maybeSingle()

    if (existingUser) {
      setMessage('Username is already taken. Please choose another.')
      setLoading(false)
      return
    }

    // 2. Send Magic Link for registration
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username: cleanUsername,
        },
      },
    })

    setLoading(false)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email! Click the link sent to your inbox to complete registration.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4">
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-4 bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="e.g. john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Sending link...' : 'Register with Magic Link'}
        </button>

        {message && (
          <p className="text-sm text-center mt-2 p-2 bg-slate-700 rounded text-slate-200">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

