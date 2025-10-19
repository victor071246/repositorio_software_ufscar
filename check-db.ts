import { pool } from "./src/lib/db";

async function main() {
  try {
    const [rows] = await pool.query("SHOW TABLES;");
    console.log("Tabelas no banco:", rows);
    process.exit(0);
  } catch (err) {
    console.error("Erro ao consultar:", err);
    process.exit(1);
  }
}

main();
