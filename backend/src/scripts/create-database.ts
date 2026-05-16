import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "",
        });

        const dbName = process.env.DB_NAME || "inticket";

        console.log(`⏳ Conectando ao MySQL para criar o banco/esquema: ${dbName}...`);
        
        // Criação do schema/database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        
        console.log(`✅ Esquema (Database) '${dbName}' criado ou já existente com sucesso!`);
        
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Erro ao criar o esquema do banco de dados:", error);
        process.exit(1);
    }
}

createDatabase();
