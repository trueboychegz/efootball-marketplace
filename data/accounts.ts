export interface Account {
  id: string;
  title: string;
  seller: string;
  teamStrength: number;
  coins: number;
  epicPlayers: number;
  level: number;
  price: number;
  platform: "Mobile" | "Steam" | "PlayStation" | "Xbox";
  image: string;
  description: string;
}

export const ACCOUNTS: Account[] = [
  {
    id: "1",
    title: "Epic Messi & Boosted Squad",
    seller: "Alex",
    teamStrength: 3250,
    coins: 1500,
    epicPlayers: 8,
    level: 45,
    price: 40,
    platform: "Mobile",
    image: "/placeholder-card.png",
    description: "High-tier account with maxed out Epic Messi and prime division squad."
  },
  {
    id: "2",
    title: "Big Time Ronaldo + 2.2k Coins",
    seller: "John",
    teamStrength: 3185,
    coins: 2200,
    epicPlayers: 12,
    level: 60,
    price: 35,
    platform: "Mobile",
    image: "/placeholder-card.png",
    description: "Stacked account loaded with eFootball coins ready for upcoming packs."
  },
  {
    id: "3",
    title: "Full Epic Barca / Brazil Squad",
    seller: "David",
    teamStrength: 3300,
    coins: 950,
    epicPlayers: 15,
    level: 50,
    price: 55,
    platform: "PlayStation",
    image: "/placeholder-card.png",
    description: "Competitive rank-ready account featuring full epic showcase team."
  }
];
