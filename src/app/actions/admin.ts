"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Atualiza o resultado de uma partida e calcula os pontos de todos os palpites.
 */
export async function updateMatchResult(matchId: number, scoreA: number, scoreB: number) {
  try {
    // 1. Atualizar a tabela de partidas com o resultado real
    await db("matches")
      .where({ id: matchId })
      .update({
        score_a: scoreA,
        score_b: scoreB,
        updated_at: db.fn.now(),
      });

    // 2. Buscar todos os palpites para esta partida
    const guesses = await db("guesses").where({ match_id: matchId });

    if (guesses.length === 0) {
      return { success: true, message: "Resultado salvo. Ninguém palpitou nesta partida." };
    }

    // 3. Processar cada palpite e calcular os pontos
    const updates = guesses.map(async (guess) => {
      let points = 0;

      const pA = guess.guess_a;
      const pB = guess.guess_b;

      // Regra 1: Acerto exato (3 pontos)
      if (pA === scoreA && pB === scoreB) {
        points = 3;
      } 
      // Regra 2: Acerto do vencedor/empate mas erro no placar (1 ponto)
      else if (Math.sign(pA - pB) === Math.sign(scoreA - scoreB)) {
        points = 1;
      }

      // Atualizar o palpite com os pontos ganhos
      return db("guesses")
        .where({ id: guess.id })
        .update({
          points_earned: points,
          updated_at: db.fn.now()
        });
    });

    await Promise.all(updates);

    // Revalidar as páginas para refletir as mudanças no ranking e na home
    revalidatePath("/");
    revalidatePath("/ranking");

    return { 
      success: true, 
      message: `Sucesso! Resultado ${scoreA}x${scoreB} processado para ${guesses.length} palpites.` 
    };

  } catch (error) {
    console.error("Erro no processamento de admin:", error);
    return { error: "Ocorreu um erro ao processar os pontos da partida." };
  }
}
