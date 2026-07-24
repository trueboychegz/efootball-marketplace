import Link from "next/link";

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const currentId = resolvedParams.id;

  const accountsData: Record<string, { player: string; team: string; coins: string; playersCount: string; level: string; price: string }> = {
    "1": {
      player: "Epic Messi",
      team: "3250",
      coins: "1,500",
      playersCount: "8",
      level: "45",
      price: "$40"
    },
    "2": {
      player: "Big Time Ronaldo",
      team: "3185",
      coins: "2,200",
      playersCount: "12",
      level: "60",
      price: "$35"
    },
    "3": {
      player: "Epic Neymar",
      team: "3300",
      coins: "950",
      playersCount: "5",
      level: "38",
      price: "$50"
    }
  };

  const account = accountsData[currentId] || accountsData["1"];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-xl mx-auto mt-10">
        <Link href="/" className="text-sm text-blue-400 hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-blue-500 mt-4">
          ⚽ Account Details
        </h1>

        <div className="mt-6 bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-3xl font-bold">
            {account.player} Account
          </h2>

          <div className="mt-4 space-y-2 text-gray-300">
            <p>💪 Team Strength: <span className="font-semibold text-white">{account.team}</span></p>
            <p>💰 Coins: <span className="font-semibold text-white">{account.coins}</span></p>
            <p>⭐ Epic Players: <span className="font-semibold text-white">{account.playersCount}</span></p>
            <p>🏅 Account Level: <span className="font-semibold text-white">{account.level}</span></p>
          </div>

          <p className="text-green-400 text-2xl mt-6 font-bold">
            {account.price}
          </p>

          <button className="mt-6 w-full bg-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">
            Contact Seller
          </button>
        </div>
      </div>
    </main>
  );
}