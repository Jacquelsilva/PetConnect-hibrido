import { supabase } from "../lib/supabase";

export type Pet = {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  porte: string;
  sexo: string;
  sobre: string;
  foto: string | null;
  responsavel: string;
  responsavelTipo: string;
};

export type PetResumo = {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  foto: string | null;
};

export function formatarIdade(meses: number | null): string {
  if (meses == null) return "—";
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? "ano" : "anos"}`;
}

async function usuarioLogado() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function listarPets(): Promise<PetResumo[]> {
  const { data, error } = await supabase
    .from("pets")
    .select("id, nome, especie, idade_meses, foto_url")
    .order("nome");

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: p.id,
    nome: p.nome,
    especie: p.especie,
    idade: formatarIdade(p.idade_meses),
    foto: p.foto_url,
  }));
}

export async function buscarPet(id: string): Promise<Pet> {
  const { data, error } = await supabase
    .from("pets")
    .select(
      "id, nome, especie, idade_meses, porte, sexo, sobre, foto_url, organizacao:organizacoes(nome, tipo)"
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const org = data.organizacao as unknown as
    | { nome: string; tipo: string }
    | null;

  return {
    id: data.id,
    nome: data.nome,
    especie: data.especie,
    idade: formatarIdade(data.idade_meses),
    porte: data.porte ?? "—",
    sexo: data.sexo ?? "—",
    sobre: data.sobre ?? "Sem descrição.",
    foto: data.foto_url,
    responsavel: org?.nome ?? "Não informado",
    responsavelTipo: org?.tipo ?? "",
  };
}

export async function jaSolicitou(petId: string): Promise<boolean> {
  const user = await usuarioLogado();
  if (!user) return false;

  const { data, error } = await supabase
    .from("solicitacoes")
    .select("id")
    .eq("pet_id", petId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function solicitarAdocao(petId: string): Promise<void> {
  const user = await usuarioLogado();
  if (!user) throw new Error("Faça login para solicitar a adoção.");

  const { error } = await supabase
    .from("solicitacoes")
    .insert({ pet_id: petId, usuario_id: user.id });

  if (error) throw error;
}

export async function cancelarSolicitacao(petId: string): Promise<void> {
  const user = await usuarioLogado();
  if (!user) throw new Error("Faça login para continuar.");

  const { error } = await supabase
    .from("solicitacoes")
    .delete()
    .eq("pet_id", petId)
    .eq("usuario_id", user.id);

  if (error) throw error;
}