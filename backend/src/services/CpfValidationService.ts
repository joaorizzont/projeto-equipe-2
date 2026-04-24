export class CpfValidationService {
  /**
   * Valida se uma string é um CPF válido.
   * Aceita CPFs formatados (com pontuação) ou sem formatação.
   *
   * @param cpf O CPF a ser validado (string)
   * @returns boolean Retorna true se for válido e false se for inválido
   */
  public isValidCpf(cpf: string): boolean {
    // 1. Remove qualquer formatação (pontos, traços, espaços)
    const cleanedCpf = cpf.replace(/[^\d]+/g, '');

    // 2. Verifica se tem exatamente 11 dígitos
    if (cleanedCpf.length !== 11) {
      return false;
    }

    // 3. Rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return false;
    }

    // 4. Calcula e valida o primeiro dígito verificador
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i), 10) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    
    if (remainder !== parseInt(cleanedCpf.substring(9, 10), 10)) {
      return false;
    }

    // 5. Calcula e valida o segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i), 10) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    
    if (remainder !== parseInt(cleanedCpf.substring(10, 11), 10)) {
      return false;
    }

    return true;
  }
}
