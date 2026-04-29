/**
 * Script de Teste Local - Validação da UserService
 *
 * Propósito: Verificar localmente (sem banco de dados) que:
 *   1. A senha em texto plano NUNCA é armazenada / repassada ao repositório.
 *   2. O hash gerado é válido e obedece ao padrão do bcrypt.
 *   3. O fallback de Role é injetado quando omitido na entrada.
 *
 * Execução: npx ts-node src/scripts/test-user-creation.ts
 */

import bcrypt from 'bcrypt';
import { UserRole } from '../models/User';

// ─── Utilitários de output ────────────────────────────────────────────────────
const PASS = '\x1b[32m✔\x1b[0m';
const FAIL = '\x1b[31m✘\x1b[0m';

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ${PASS} ${message}`);
  } else {
    console.error(`  ${FAIL} ${message}`);
    process.exitCode = 1;
  }
}

// ─── Simulação da lógica do UserService (sem dependência de banco) ────────────
interface CreateUserDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  role?: UserRole;
}

interface UserPayload {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string; // deve conter o HASH, nunca o texto plano
  role: UserRole;
}

const SALT_ROUNDS = 10;

async function buildUserPayload(data: CreateUserDTO): Promise<UserPayload> {
  const finalRole: UserRole = data.role ?? UserRole.CURRENT;
  const hashedSenha = await bcrypt.hash(data.senha, SALT_ROUNDS);

  return {
    nome: data.nome,
    cpf: data.cpf,
    email: data.email,
    telefone: data.telefone,
    senha: hashedSenha,
    role: finalRole,
  };
}

// ─── Suite de Testes ──────────────────────────────────────────────────────────
async function runTests(): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║      Teste Local - UserService (Segurança de Senha)  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const plainPassword = 'minhaSenhaSegura@123';

  // ── Teste 1: Hash gerado não é texto plano ──────────────────────────────────
  console.log('▶ [1] Criptografia de Senha');
  const payloadComRole = await buildUserPayload({
    nome: 'João Silva',
    cpf: '123.456.789-09',
    email: 'joao@teste.com',
    telefone: '(11) 98765-4321',
    senha: plainPassword,
    role: UserRole.ADMIN,
  });

  assert(
    payloadComRole.senha !== plainPassword,
    'A senha no payload NÃO é texto plano'
  );

  // ── Teste 2: Hash obedece ao padrão bcrypt ──────────────────────────────────
  console.log('\n▶ [2] Validade do Hash bcrypt');
  const isBcryptHash = payloadComRole.senha.startsWith('$2b$');
  assert(isBcryptHash, 'O hash começa com "$2b$" (padrão bcrypt)');

  const hashIsValid = await bcrypt.compare(plainPassword, payloadComRole.senha);
  assert(hashIsValid, 'bcrypt.compare() valida o hash gerado com a senha original');

  // ── Teste 3: Fallback de Role quando omitida ────────────────────────────────
  console.log('\n▶ [3] Fallback de Role');
  const payloadSemRole = await buildUserPayload({
    nome: 'Maria Souza',
    cpf: '987.654.321-00',
    email: 'maria@teste.com',
    telefone: '(21) 91234-5678',
    senha: plainPassword,
    // role NÃO enviada intencionalmente
  });

  assert(
    payloadSemRole.role === UserRole.CURRENT,
    `Role padrão aplicada: "${payloadSemRole.role}" === "${UserRole.CURRENT}"`
  );

  // ── Teste 4: Role explícita é preservada ───────────────────────────────────
  console.log('\n▶ [4] Role explícita é preservada');
  assert(
    payloadComRole.role === UserRole.ADMIN,
    `Role fornecida é mantida: "${payloadComRole.role}" === "${UserRole.ADMIN}"`
  );

  // ── Teste 5: Hash da segunda criação é diferente (salt único) ──────────────
  console.log('\n▶ [5] Unicidade do Salt');
  const payloadExtra = await buildUserPayload({
    nome: 'Carlos Lima',
    cpf: '111.222.333-44',
    email: 'carlos@teste.com',
    telefone: '(31) 99999-0000',
    senha: plainPassword,
  });

  assert(
    payloadComRole.senha !== payloadExtra.senha,
    'Dois hashes da mesma senha são diferentes (salt único por geração)'
  );

  console.log('\n══════════════════════════════════════════════════════\n');
}

runTests().catch((err) => {
  console.error('Erro inesperado no script de teste:', err);
  process.exit(1);
});
