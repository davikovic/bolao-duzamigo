import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getModeratedPools } from "@/app/actions/moderator_actions";
import { ShieldHalf, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function MyGroupsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;
  const moderatedPoolIds: number[] = user.moderatedPoolIds ?? [];

  // Redireciona se não for moderador de nenhum pool
  if (moderatedPoolIds.length === 0 && user.role !== "admin") {
    redirect("/");
  }

  const pools = await getModeratedPools();

  return (
    <div className="flex flex-col gap-10 py-10 px-4 md:px-0 max-w-4xl mx-auto">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <ShieldHalf className="text-purple-400" size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/70">
            Área do Moderador
          </span>
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Meus Grupos</h1>
        <p className="text-gray-400 font-medium mt-2">
          Bolões que você modera. Clique em um para aprovar ou recusar novos participantes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pools.map((pool: any) => (
          <Link
            key={pool.id}
            href={`/pools/${pool.id}/manage`}
            className="group bg-[#121212] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between gap-6 transition-all hover:border-purple-500/30 hover:bg-purple-500/5 relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl -mr-8 -mt-8 group-hover:bg-purple-500/15 transition-all" />

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-purple-300 transition-colors">
                  {pool.name}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1 line-clamp-2">
                  {pool.description || "Sem descrição."}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-all shrink-0 ml-4">
                <ShieldHalf className="text-purple-400" size={22} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-600" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Moderação Ativa</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                Gerenciar <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pools.length === 0 && (
        <div className="p-20 text-center bg-[#121212] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
            <ShieldHalf size={32} />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Você não modera nenhum grupo ainda.
          </p>
        </div>
      )}
    </div>
  );
}
