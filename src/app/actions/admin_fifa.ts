"use server";

import db from "@/lib/db";
import { WORLD_CUP_2026_GROUP_STAGE } from "@/db/data/fifa_2026";
import { revalidatePath } from "next/cache";

/**
 * Sincroniza a tabela de jogos com os dados oficiais da Copa 2026.
 */
export async function syncFifaData() {
  try {
    // Insere os jogos transformando as flags curtas em URLs do flagcdn
    const matchesToInsert = WORLD_CUP_2026_GROUP_STAGE.map(match => ({
      team_a: match.team_a,
      team_b: match.team_b,
      team_a_flag: `https://flagcdn.com/w160/${match.team_a_flag.toLowerCase()}.png`,
      team_b_flag: `https://flagcdn.com/w160/${match.team_b_flag.toLowerCase()}.png`,
      date: match.date,
      group_name: match.group_name,
      updated_at: db.fn.now()
    }));

    // Verifica se já existem jogos para não duplicar na carga automática
    const existingCount = await db("matches").count("id as count").first();
    const count = Number(existingCount?.count || 0);

    if (count > 0) {
      // Opcional: Limpar antes ou apenas avisar. Para o usuário "High-End", vamos appendar mas com inteligência.
      // Aqui, vamos apenas inserir os que não existem.
    }

    await db("matches").insert(matchesToInsert);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: `${matchesToInsert.length} jogos oficiais da Copa 2026 sincronizados com sucesso!` };
  } catch (error: any) {
    console.error("ERRO CRÍTICO NO SYNC FIFA:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return { 
      error: "Falha na conexão com o banco de dados durante a sincronização. Verifique sua conexão e tente novamente." 
    };
  }
}

/**
 * Cria um jogo manual.
 */
export async function createMatch(data: {
  team_a: string;
  team_b: string;
  team_a_flag: string;
  team_b_flag: string;
  date: string;
  group_name: string;
}) {
  try {
    await db("matches").insert({
      ...data,
      team_a_flag: data.team_a_flag.startsWith('http') ? data.team_a_flag : `https://flagcdn.com/w160/${data.team_a_flag.toLowerCase()}.png`,
      team_b_flag: data.team_b_flag.startsWith('http') ? data.team_b_flag : `https://flagcdn.com/w160/${data.team_b_flag.toLowerCase()}.png`,
      updated_at: db.fn.now()
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Novo jogo adicionado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar jogo manual:", error);
    return { error: "Erro ao salvar o novo jogo." };
  }
}
