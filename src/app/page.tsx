import { GameCard } from "@/components/game-card";
import db from "@/lib/db";

const MOCK_GAMES = [
  {
    id: "g1",
    team_a: "Brasil",
    team_b: "Argentina",
    team_a_flag: "🇧🇷",
    team_b_flag: "🇦🇷",
    date: new Date("2026-06-20T16:00:00Z"),
    group_name: "Grupo A",
  },
  {
    id: "g2",
    team_a: "França",
    team_b: "Alemanha",
    team_a_flag: "🇫🇷",
    team_b_flag: "🇩🇪",
    date: new Date("2026-06-21T13:00:00Z"),
    group_name: "Grupo B",
  },
  {
    id: "g3",
    team_a: "Espanha",
    team_b: "Portugal",
    team_a_flag: "🇪🇸",
    team_b_flag: "🇵🇹",
    date: new Date("2026-06-22T16:00:00Z"),
    group_name: "Grupo C",
  },
];

export default async function Home() {
  let matches: any[] = [];
  let dbError = false;

  try {
    // Busca matches do banco de dados
    const result = await db("matches").select("*").orderBy("date", "asc");
    if (result && result.length > 0) {
      matches = result;
    } else {
      matches = MOCK_GAMES;
    }
  } catch (error) {
    console.error("Erro ao conectar no banco, usando MOCK_GAMES:", error);
    dbError = true;
    matches = MOCK_GAMES; // usa mock como fallback se a string do BD não for válida
  }

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

      {dbError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-sm text-yellow-700">
            <strong>Aviso:</strong> Não foi possível conectar ao banco de dados. Exibindo jogos de demonstração.
            Rode `npx knex migrate:latest` e `npx knex seed:run` para testar localmente.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {matches.map((game) => {
          // Formata data e hora, previne erros de tipagem
          const gameDate = typeof game.date === "string" ? new Date(game.date) : game.date;
          // Ajuste fino para display (DD/MM HH:mm) ignorando warning se não tiver date-fns
          // Como date-fns pode não estar instalado, fazemos um format manual simples
          const day = String(gameDate.getDate()).padStart(2, '0');
          const month = String(gameDate.getMonth() + 1).padStart(2, '0');
          const hours = String(gameDate.getHours()).padStart(2, '0');
          const minutes = String(gameDate.getMinutes()).padStart(2, '0');
          const dateStr = `${day}/${month} ${hours}:${minutes}`;

          return (
            <GameCard
              key={game.id}
              id={String(game.id)}
              date={dateStr}
              group={game.group_name}
              teamA={{ id: game.team_a, name: game.team_a, flag: game.team_a_flag }}
              teamB={{ id: game.team_b, name: game.team_b, flag: game.team_b_flag }}
            />
          );
        })}
      </div>
    </div>
  );
}
