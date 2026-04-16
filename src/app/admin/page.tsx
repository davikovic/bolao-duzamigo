import db from "@/lib/db";
import { AdminMatchRow } from "@/components/admin-match-row";
import { Trophy, Globe, PlusCircle, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AdminFifaSync } from "@/components/admin/fifa-sync-button";
import { AdminAddMatchForm } from "@/components/admin/add-match-form";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Proteção Robustecida
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const matches = await db("matches").select("*").orderBy("date", "desc");

  return (
    <div className="flex flex-col gap-10 py-10 px-4 md:px-0 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-yellow-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500/70">Terminal do Comandante</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Painel de Controle</h1>
          <p className="text-gray-400 font-medium mt-2">Gerencie resultados, adicione jogos e sincronize dados oficiais.</p>
        </div>

        <AdminFifaSync />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lado Esquerdo: Lista de Jogos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Trophy className="text-yellow-500/50" size={20} />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Gerenciar Resultados</h2>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
              <AdminMatchRow 
                key={match.id}
                id={match.id}
                teamA={match.team_a}
                teamB={match.team_b}
                teamAFlag={match.team_a_flag}
                teamBFlag={match.team_b_flag}
                initialScoreA={match.score_a}
                initialScoreB={match.score_b}
              />
            ))}
            
            {matches.length === 0 && (
              <div className="p-20 text-center bg-[#121212] border-2 border-dashed border-white/5 rounded-[3rem] text-gray-500 font-bold uppercase tracking-widest text-xs">
                Nenhum jogo na base de dados.
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Adicionar Manual */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <PlusCircle className="text-blue-500" size={20} />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Novo Jogo</h2>
          </div>

          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl sticky top-10">
            <AdminAddMatchForm />
          </div>
        </div>
      </div>
    </div>
  );
}
