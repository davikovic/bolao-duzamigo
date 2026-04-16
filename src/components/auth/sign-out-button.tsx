"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
    >
      <LogOut size={16} />
      Sair da Conta
    </Button>
  );
}
