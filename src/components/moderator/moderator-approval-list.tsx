"use client";

import { useState } from "react";
import { Check, X, Users, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { approveAsModerator, rejectAsModerator } from "@/app/actions/moderator_actions";

interface PendingMember {
  membershipId: number;
  userId: number;
  name: string;
  email: string;
  image: string | null;
}

interface ModeratorApprovalListProps {
  poolId: number;
  poolName: string;
  initialPendingMembers: PendingMember[];
}

export function ModeratorApprovalList({ poolId, poolName, initialPendingMembers }: ModeratorApprovalListProps) {
  const [pending, setPending] = useState<PendingMember[]>(initialPendingMembers);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleApprove = async (membershipId: number) => {
    setLoadingId(membershipId);
    try {
      const res = await approveAsModerator(membershipId, poolId);
      if (res.success) {
        toast.success("Solicitação aprovada!");
        setPending(prev => prev.filter(m => m.membershipId !== membershipId));
      } else {
        toast.error(res.error || "Erro ao aprovar.");
      }
    } catch {
      toast.error("Erro interno.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (membershipId: number) => {
    if (!confirm("Tem certeza que deseja recusar esta solicitação?")) return;
    setLoadingId(membershipId);
    try {
      const res = await rejectAsModerator(membershipId, poolId);
      if (res.success) {
        toast.success("Solicitação recusada.");
        setPending(prev => prev.filter(m => m.membershipId !== membershipId));
      } else {
        toast.error(res.error || "Erro ao recusar.");
      }
    } catch {
      toast.error("Erro interno.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {pending.map((member) => (
        <div
          key={member.membershipId}
          className="bg-[#121212] border border-white/5 p-5 rounded-3xl flex items-center justify-between gap-4 transition-all hover:border-white/10"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={member.image || ""} />
              <AvatarFallback className="bg-black text-white text-sm font-black">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate">{member.name}</span>
              <span className="text-xs font-medium text-gray-500 truncate">{member.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {loadingId === member.membershipId ? (
              <Loader2 size={20} className="text-gray-500 animate-spin" />
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(member.membershipId)}
                  className="h-10 w-10 p-0 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white border border-green-600/20 rounded-xl transition-all"
                >
                  <Check size={18} />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReject(member.membershipId)}
                  className="h-10 w-10 p-0 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 rounded-xl transition-all"
                >
                  <X size={18} />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}

      {pending.length === 0 && (
        <div className="p-16 text-center bg-[#121212]/50 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
            <Users size={28} />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Nenhuma solicitação pendente em {poolName}
          </p>
        </div>
      )}
    </div>
  );
}
