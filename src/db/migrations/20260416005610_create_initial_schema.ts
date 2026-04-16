import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("image");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("matches", (table) => {
    table.increments("id").primary();
    table.string("team_a").notNullable();
    table.string("team_b").notNullable();
    table.string("team_a_flag").notNullable();
    table.string("team_b_flag").notNullable();
    table.dateTime("date").notNullable();
    table.string("group_name").notNullable();
    table.integer("score_a");
    table.integer("score_b");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("guesses", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("match_id").unsigned().references("id").inTable("matches").onDelete("CASCADE");
    table.integer("guess_a").notNullable();
    table.integer("guess_b").notNullable();
    table.integer("points_earned");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("guesses");
  await knex.schema.dropTableIfExists("matches");
  await knex.schema.dropTableIfExists("users");
}
