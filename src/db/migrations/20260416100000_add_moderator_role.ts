import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // PostgreSQL armazena enum como Check Constraint via Knex.
  // Precisamos recriar a constraint para incluir 'moderator'.
  await knex.raw(`
    ALTER TABLE pool_memberships 
    DROP CONSTRAINT IF EXISTS pool_memberships_role_check;
  `);
  await knex.raw(`
    ALTER TABLE pool_memberships 
    ADD CONSTRAINT pool_memberships_role_check 
    CHECK (role IN ('member', 'admin_pool', 'moderator'));
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Reverter para o estado original: remover registros de moderador e restaurar constraint
  await knex("pool_memberships").where({ role: "moderator" }).update({ role: "member" });
  await knex.raw(`
    ALTER TABLE pool_memberships 
    DROP CONSTRAINT IF EXISTS pool_memberships_role_check;
  `);
  await knex.raw(`
    ALTER TABLE pool_memberships 
    ADD CONSTRAINT pool_memberships_role_check 
    CHECK (role IN ('member', 'admin_pool'));
  `);
}
