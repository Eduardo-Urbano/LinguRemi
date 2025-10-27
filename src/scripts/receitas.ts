import type { Receita } from "./criarReceitas.js"

export async function carregarReceitas(): Promise<Receita[]>{
  try{
    const response = await fetch("http://localhost:8080/receitas");

    if(!response.ok){
      throw new Error("Erro ao Buscar receitas");
    }
    const receitas: Receita[] = await response.json();
    return receitas;
  }catch(error){
    console.log(error);
    return[];
  }

}