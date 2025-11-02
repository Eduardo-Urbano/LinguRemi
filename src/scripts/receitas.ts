import type { Receita } from "./criarReceitas.js";

async function carregar(url: string): Promise<Receita[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar receitas");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function carregarReceitasBlog(): Promise<Receita[]> {
  return carregar("http://localhost:8080/receitas/todas");
}

export async function carregarReceitasProdutos(): Promise<Receita[]> {
  return carregar("http://localhost:8080/receitas/produtos");
}