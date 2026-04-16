import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Apaga os dados antigos
    await knex("guesses").del();
    await knex("matches").del();

    // Insere os 3 jogos mockados
    await knex("matches").insert([
        { 
            team_a: "Brasil", 
            team_b: "Argentina", 
            team_a_flag: "🇧🇷", 
            team_b_flag: "🇦🇷", 
            date: new Date("2026-06-20T16:00:00Z"), 
            group_name: "Grupo A" 
        },
        { 
            team_a: "França", 
            team_b: "Alemanha", 
            team_a_flag: "🇫🇷", 
            team_b_flag: "🇩🇪", 
            date: new Date("2026-06-21T13:00:00Z"), 
            group_name: "Grupo B" 
        },
        { 
            team_a: "Espanha", 
            team_b: "Portugal", 
            team_a_flag: "🇪🇸", 
            team_b_flag: "🇵🇹", 
            date: new Date("2026-06-22T16:00:00Z"), 
            group_name: "Grupo C" 
        }
    ]);
}
