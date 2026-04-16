import { Timer, LogOut, Clock, ShieldAlert } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Se o usuário já foi aprovado, redireciona para a home
  if ((session.user as any).status === "active") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-md w-full relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-yellow-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-[#121212] border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-8 relative">
             <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
             <Clock className="text-yellow-500 relative z-10" size={48} />
          </div>

          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
            Quase lá, <span className="text-yellow-500">{session.user?.name?.split(' ')[0]}!</span>
          </h1>
          
          <p className="text-gray-400 font-medium mb-8">
            Seu cadastro foi recebido com sucesso. Por motivos de segurança, novos participantes precisam ser aprovados manualmente pela organização do Bolão.
          </p>

          <div className="w-full space-y-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 text-left">
                <ShieldAlert className="text-yellow-500/50 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                   Você receberá acesso assim que um administrador confirmar seu vínculo com o grupo.
                </p>
             </div>

             <SignOutButton />
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 w-full">
             <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                Status: <span className="text-yellow-500/60 ml-2">Aguardando Aprovação</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
