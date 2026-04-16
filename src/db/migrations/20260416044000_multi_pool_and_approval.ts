import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Criar tabela de pools (bolões)
  await knex.schema.createTable("pools", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.text("prize_info");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 2. Criar tabela de memberships (quem participa de qual bolão)
  await knex.schema.createTable("pool_memberships", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("pool_id").unsigned().notNullable().references("id").inTable("pools").onDelete("CASCADE");
    table.enum("status", ["pending", "approved"]).defaultTo("pending");
    table.enum("role", ["member", "admin_pool"]).defaultTo("member");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 3. Adicionar status na tabela de usuários
  await knex.schema.alterTable("users", (table) => {
    table.enum("status", ["active", "pending", "blocked"]).defaultTo("pending");
  });

  // 4. Inserir um Bolão Inicial (Geral)
  await knex("pools").insert({
    name: "Bolão Geral",
    description: "O bolão oficial para todos os participantes do Duzamigo.",
    prize_info: "A definir pela organização."
  });

  // 5. Garantir que o Admin atual esteja ativo e no bolão inicial
  // Nota: Isso depende do ADMIN_EMAIL estar no banco. 
  // Faremos isso via código quando o admin logar pela primeira vez ou via script se necessário.
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("status");
  });
  await knex.schema.dropTable("pool_memberships");
  await knex.schema.dropTable("pools");
}
