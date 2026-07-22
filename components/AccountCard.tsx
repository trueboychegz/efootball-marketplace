import Link from "next/link";
import { Account } from "../data/accounts";

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-900/50 text-blue-400 border border-blue-800">
            {account.platform}
          </span>
          <span className="text-xs text-gray-400">Seller: {account.seller}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {account.title}
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {account.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="bg-gray-800/60 p-2 rounded text-gray-300">
            <span className="block text-gray-500">Team Strength</span>
            <span className="font-semibold text-white">{account.teamStrength}</span>
          </div>
          <div className="bg-gray-800/60 p-2 rounded text-gray-300">
            <span className="block text-gray-500">Coins</span>
            <span className="font-semibold text-amber-400">{account.coins} 🪙</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div>
          <span className="text-xs text-gray-500 block">Price</span>
          <span className="text-xl font-black text-green-400">${account.price}</span>
        </div>
        <Link 
          href={`/accounts/${account.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
