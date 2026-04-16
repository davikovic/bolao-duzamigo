"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Loader2, Zap } from "lucide-react";
import { syncFifaData } from "@/app/actions/admin_fifa";
import { toast } from "sonner";

export function AdminFifaSync() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    const result = await syncFifaData();
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <Button 
      onClick={handleSync}
      disabled={loading}
      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl shadow-[0_10px_20px_rgba(234,179,8,0.2)] transition-all active:scale-95"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Zap className="w-4 h-4 mr-2" fill="black" />
      )}
      Sincronizar Tabela FIFA 2026
    </Button>
  );
}
