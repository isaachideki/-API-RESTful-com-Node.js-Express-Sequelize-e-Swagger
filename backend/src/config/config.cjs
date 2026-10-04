require('dotenv').config();
const isSSL = process.env.DB_SSL === 'true';
module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    dialectOptions: isSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  }
};
