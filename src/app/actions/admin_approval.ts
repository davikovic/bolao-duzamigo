"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function approveUserAction(userId: number, poolId: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Não autorizado.");
  }

  try {
    await db.transaction(async (trx) => {
      // 1. Atualizar status do usuário para ativo
      await trx("users").where({ id: userId }).update({ status: "active" });

      // 2. Criar membership no bolão selecionado
      await trx("pool_memberships").insert({
        user_id: userId,
        pool_id: poolId,
        status: "approved",
        role: "member"
      });
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro na aprovação:", error);
    return { error: "Erro interno ao aprovar usuário." };
  }
}
