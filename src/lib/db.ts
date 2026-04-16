import knex from 'knex';
import config from '../../knexfile';

// Inicializa a conexão com o banco de dados conforme o ambiente
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

export default db;
