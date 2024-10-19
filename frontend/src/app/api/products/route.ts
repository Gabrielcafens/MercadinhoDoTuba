import { NextResponse } from "next/server";
import { Pool } from "pg";

// Configuração do pool para conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

// Função para buscar dados de produtos com categorias
export async function GET() {
  try {
    const client = await pool.connect();

    // Query que busca produtos e suas categorias relacionadas
    const res = await client.query(`
      SELECT 
        p.id, 
        p.nome AS produto_nome, 
        p.preco, 
        p.unidade, 
        c.nome AS categoria_nome, 
        e.quantidade AS estoque_quantidade
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
      JOIN estoque e ON p.id = e.produto_id
    `);

    client.release(); // Libera a conexão com o banco de dados

    // Retorna os dados formatados como JSON
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return new NextResponse("Erro ao buscar produtos", { status: 500 });
  }
}
