"use client";

import { useState } from "react";
import { Plus, Trophy, Info, AlignLeft, Hash, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPoolAction } from "@/app/actions/admin_pools";
import { PoolMembersList } from "@/components/admin/pool-members-list";
import { cn } from "@/lib/utils";

interface Pool {
  id: number;
  name: string;
  description: string;
  prize_info: string;
  created_at: any;
}

interface PoolsTabProps {
  pools: Pool[];
}

export function PoolsTab({ pools }: PoolsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedPool, setExpandedPool] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prize_info: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createPoolAction(formData);
      if (res.success) {
        toast.success("Bolão criado com sucesso!");
        setIsAdding(false);
        setFormData({ name: "", description: "", prize_info: "" });
      } else {
        toast.error(res.error || "Erro ao criar bolão.");
      }
    } catch (error) {
      toast.error("Erro interno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Hash className="text-yellow-500" size={20} />
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Gerenciar Bolões</h2>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl"
        >
          {isAdding ? "Cancelar" : "Novo Bolão"}
          <Plus size={14} className="ml-2" />
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#121212] border border-yellow-500/20 p-8 rounded-[2.5rem] space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome do Bolão</label>
              <input
                type="text"
                required
                placeholder="Ex: Copa da Firma 2026"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descrição Curta</label>
              <input
                type="text"
                placeholder="Ex: Grupo para o pessoal do marketing"
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Informativo de Premiação</label>
            <textarea
              placeholder="Descreva o que os vencedores ganharão..."
              rows={3}
              value={formData.prize_info}
              onChange={(e) => setFormData(p => ({ ...p, prize_info: e.target.value }))}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50 resize-none"
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl"
          >
            {loading ? "Criando Bolão..." : "Salvar Bolão"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {pools.map((pool) => {
          const isExpanded = expandedPool === pool.id;
          return (
            <div key={pool.id} className="bg-[#121212] border border-white/5 rounded-[2.5rem] transition-all hover:border-white/10 group overflow-hidden">
              {/* Pool Header */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-yellow-500 transition-colors">{pool.name}</h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">ID: #{pool.id}</span>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <Trophy className="text-yellow-500/40" size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlignLeft className="text-gray-600 shrink-0" size={16} />
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{pool.description || "Sem descrição."}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="text-yellow-500/60 shrink-0" size={16} />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-yellow-500/40 uppercase tracking-widest">Premiação</span>
                      <p className="text-[10px] text-yellow-500/80 font-bold italic mt-0.5">{pool.prize_info || "A definir."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Members Button */}
              <button
                onClick={() => setExpandedPool(isExpanded ? null : pool.id)}
                className="w-full flex items-center justify-between px-8 py-4 border-t border-white/5 text-gray-500 hover:text-white hover:bg-white/3 transition-all"
              >
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Users size={14} /> Gerenciar Membros & Moderadores
                </span>
                <ChevronDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} />
              </button>

              {/* Expandable Member List */}
              {isExpanded && (
                <div className="px-8 pb-8 border-t border-white/5 pt-6">
                  <PoolMembersList poolId={pool.id} poolName={pool.name} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
