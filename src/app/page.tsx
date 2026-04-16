import { GameCard } from "@/components/game-card";

const MOCK_GAMES = [
  {
    id: "g1",
    date: "20/06 16:00",
    group: "Grupo A",
    teamA: { id: "br", name: "Brasil", flag: "🇧🇷" },
    teamB: { id: "ar", name: "Argentina", flag: "🇦🇷" },
  },
  {
    id: "g2",
    date: "21/06 13:00",
    group: "Grupo B",
    teamA: { id: "fr", name: "França", flag: "🇫🇷" },
    teamB: { id: "de", name: "Alemanha", flag: "🇩🇪" },
  },
  {
    id: "g3",
    date: "22/06 16:00",
    group: "Grupo C",
    teamA: { id: "es", name: "Espanha", flag: "🇪🇸" },
    teamB: { id: "pt", name: "Portugal", flag: "🇵🇹" },
  },
];

export default function Home() {
  return (
    <div className="flex flex-col p-4 pb-8 space-y-6">
      <header className="py-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Próximos Jogos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Deixe seu palpite e boa sorte!
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {MOCK_GAMES.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            date={game.date}
            group={game.group}
            teamA={game.teamA}
            teamB={game.teamB}
          />
        ))}
      </div>
    </div>
  );
}
