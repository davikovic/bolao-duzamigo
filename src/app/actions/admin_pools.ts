"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createPoolAction(formData: {
  name: string;
  description: string;
  prize_info: string;
}) {
  const session = await getServerSession(authOptions);

  // Apenas admins podem criar bolões
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Não autorizado.");
  }

  if (!formData.name) {
    return { error: "O nome do bolão é obrigatório." };
  }

  try {
    await db("pools").insert({
      name: formData.name,
      description: formData.description,
      prize_info: formData.prize_info,
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar bolão:", error);
    return { error: "Erro interno ao criar bolão." };
  }
}
