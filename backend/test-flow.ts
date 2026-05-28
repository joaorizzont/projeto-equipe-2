import "reflect-metadata";
import { AppDataSource } from "./src/config/data-source";
import { AuthService } from "./src/services/AuthService";

async function run() {
    await AppDataSource.initialize();
    
    try {
        console.log("Tentando login...");
        const auth = new AuthService();
        const result = await auth.login("teste@teste.com", "password");
        console.log("Sucesso no login, token gerado:", !!result.token);

    } catch (e: any) {
        console.error("Erro capturado:", e);
    }
    process.exit(0);
}

run();
