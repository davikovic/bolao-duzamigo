import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { getPoolPendingMemberships } from "@/app/actions/moderator_actions";
import { ModeratorApprovalList } from "@/components/moderator/moderator-approval-list";
import db from "@/lib/db";
import { ShieldHalf, Users, Clock } from "lucide-react";

interface Props {
  params: Promise<{ poolId: string }>;
}

export default async function PoolManagePage({ params }: Props) {
  const { poolId: poolIdStr } = await params;
  const poolId = Number(poolIdStr);

  if (isNaN(poolId)) notFound();

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;
  const isGlobalAdmin = user.role === "admin";
  const isModeratorOfPool = (user.moderatedPoolIds as number[] ?? []).includes(poolId);

  // Somente admin global ou moderador deste pool pode acessar
  if (!isGlobalAdmin && !isModeratorOfPool) redirect("/");

  const pool = await db("pools").where({ id: poolId }).first();
  if (!pool) notFound();

  const { data: pendingMembers, error } = await getPoolPendingMemberships(poolId);

  return (
    <div className="flex flex-col gap-10 py-10 px-4 md:px-0 max-w-4xl mx-auto">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <ShieldHalf className="text-purple-400" size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/70">
            Central do Moderador
          </span>
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          Gerenciar <span className="text-purple-400">{pool.name}</span>
        </h1>
        <p className="text-gray-400 font-medium mt-2">
          Aprove ou recuse solicitações de entrada neste bolão.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
            <Clock className="text-yellow-500" size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aguardando</p>
            <p className="text-3xl font-black text-white">{pendingMembers?.length ?? 0}</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
            <Users className="text-purple-400" size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Seu papel</p>
            <p className="text-sm font-black text-purple-400 uppercase tracking-wide">
              {isGlobalAdmin ? "Admin Global" : "Moderador"}
            </p>
          </div>
        </div>
      </div>

      {/* Approvals section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <Users className="text-gray-500" size={18} />
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Solicitações Pendentes</h2>
        </div>

        {error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
            {error}
          </div>
        ) : (
          <ModeratorApprovalList
            poolId={poolId}
            poolName={pool.name}
            initialPendingMembers={pendingMembers ?? []}
          />
        )}
      </section>
    </div>
  );
}
