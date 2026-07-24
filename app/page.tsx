import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Link from "next/link";

export default function Home() {
  const accounts = [
    {
      player: "Epic Messi",
      team: "3250",
      price: "$40",
    },
    {
      player: "Big Time Ronaldo",
      team: "3185",
      price: "$35",
    },
    {
      player: "Epic Neymar",
      team: "3300",
      price: "$50",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Hero />

      {/* Featured Accounts Section */}
      <section className="px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">🔥 Featured Accounts</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {accounts.map((account) => (
            <div 
              key={account.player} 
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <h3 className="text-2xl font-bold">{account.player}</h3>
              <p className="mt-3">Team Strength: {account.team}</p>
              <p className="text-green-400 mt-2 font-bold">{account.price}</p>
              
              {/* Here is your fixed Link button! */}
              <Link 
                href="/account" 
                className="mt-5 block text-center w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose eFootball Market?</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold">🔒 Safe Trading</h3>
            <p className="mt-3 text-gray-400">Buy and sell accounts with confidence.</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold">⚡ Fast Deals</h3>
            <p className="mt-3 text-gray-400">Connect with buyers and sellers instantly.</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold">🌐 Global Community</h3>
            <p className="mt-3 text-gray-400">Trade accounts with players from around the world.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-500">
        © 2026 eFootball Market. All rights reserved.
      </footer>
    </main>
  );
}