export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d{4})$/, "$1-$2");
}

export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function applyMask(value: string, type?: "cpf" | "cnpj" | "phone" | "cep" | "cpf_cnpj"): string {
  if (!type) return value;
  if (type === "cpf") return maskCpf(value);
  if (type === "cnpj") return maskCnpj(value);
  if (type === "phone") return maskPhone(value);
  if (type === "cep") return maskCep(value);
  if (type === "cpf_cnpj") {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 11) return maskCnpj(value);
    return maskCpf(value);
  }
  return value;
}
