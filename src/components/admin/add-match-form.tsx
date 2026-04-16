"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createMatch } from "@/app/actions/admin_fifa";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export function AdminAddMatchForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_a: "",
    team_b: "",
    team_a_flag: "",
    team_b_flag: "",
    date: "",
    group_name: "Grupo A",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createMatch(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      setFormData({
        team_a: "",
        team_b: "",
        team_a_flag: "",
        team_b_flag: "",
        date: "",
        group_name: "Grupo A",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Times</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="Time A" 
            value={formData.team_a} 
            onChange={(e) => setFormData({...formData, team_a: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
          <Input 
            placeholder="Time B" 
            value={formData.team_b} 
            onChange={(e) => setFormData({...formData, team_b: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Bandeiras (ISO ou URL)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="mx, br, us..." 
            value={formData.team_a_flag} 
            onChange={(e) => setFormData({...formData, team_a_flag: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
          <Input 
            placeholder="fr, ar, de..." 
            value={formData.team_b_flag} 
            onChange={(e) => setFormData({...formData, team_b_flag: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Data e Grupo</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input 
            type="datetime-local"
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
          <Input 
            placeholder="Ex: Grupo A" 
            value={formData.group_name} 
            onChange={(e) => setFormData({...formData, group_name: e.target.value})}
            className="bg-black/40 border-white/5 rounded-xl h-11"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl border border-blue-400/20 shadow-lg shadow-blue-600/10 mt-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Adicionar Jogo</>}
      </Button>
    </form>
  );
}
