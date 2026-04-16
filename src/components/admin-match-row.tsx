"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateMatchResult } from "@/app/actions/admin";
import { Trophy, CheckCircle2, Loader2 } from "lucide-react";

interface AdminMatchRowProps {
  id: number;
  teamA: string;
  teamB: string;
  teamAFlag: string;
  teamBFlag: string;
  initialScoreA?: number | null;
  initialScoreB?: number | null;
}

export function AdminMatchRow({ id, teamA, teamB, teamAFlag, teamBFlag, initialScoreA, initialScoreB }: AdminMatchRowProps) {
  const [scoreA, setScoreA] = useState<string>(initialScoreA !== null && initialScoreA !== undefined ? String(initialScoreA) : "");
  const [scoreB, setScoreB] = useState<string>(initialScoreB !== null && initialScoreB !== undefined ? String(initialScoreB) : "");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async () => {
    if (scoreA === "" || scoreB === "") {
      toast.error("Insira o placar oficial antes de processar!");
      return;
    }

    const confirm = window.confirm(`Deseja realmente finalizar o jogo ${teamA} ${scoreA} x ${scoreB} ${teamB} e distribuir os pontos? Esta ação irá recalcular o ranking.`);
    
    if (!confirm) return;

    setIsProcessing(true);
    const result = await updateMatchResult(id, parseInt(scoreA, 10), parseInt(scoreB, 10));
    setIsProcessing(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{teamAFlag}</span>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{teamA}</span>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            type="number" 
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            className="w-12 h-10 text-center font-bold"
            placeholder="-"
          />
          <span className="text-gray-400 font-bold">X</span>
          <Input 
            type="number" 
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            className="w-12 h-10 text-center font-bold"
            placeholder="-"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200 text-right">{teamB}</span>
          <span className="text-2xl">{teamBFlag}</span>
        </div>
      </div>
      
      <Button 
        onClick={handleUpdate} 
        disabled={isProcessing}
        variant={initialScoreA !== null ? "outline" : "default"}
        className={`w-full ${initialScoreA === null ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <CheckCircle2 className="w-4 h-4 mr-2" />
        )}
        {initialScoreA !== null ? "Atualizar Resultado e Re-arquivar" : "Finalizar e Distribuir Pontos"}
      </Button>
    </div>
  );
}
