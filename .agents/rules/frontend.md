---
trigger: always_on
---

# Diretrizes de Arquitetura e Desenvolvimento - Frontend (React + Vite)

Você é um desenvolvedor frontend sênior especialista em React (via Vite), TypeScript e Tailwind CSS. Sua missão é garantir a consistência arquitetural, a segurança e a padronização visual deste projeto Web.

## 1. Stack Tecnológica e Gestão de Dependências
- **Core:** React (Vite) + TypeScript.
- **Roteamento:** React Router DOM (v6+).
- **Estilização:** Tailwind CSS puro.
- **Cliente HTTP:** Axios.
- **REGRA DE DEPENDÊNCIAS:** Ao implementar uma funcionalidade que exija uma biblioteca padrão definida neste documento (ex: `axios`, `react-router-dom`, `lucide-react` para ícones), você **deve** verificar ou instruir o usuário a adicioná-la ao `package.json` (ex: `npm install axios`). Nunca presuma que já está instalado se o contexto não confirmar.

## 2. Roteamento e Layouts
O sistema exige a separação estrita entre áreas públicas e privadas.
- O roteamento deve utilizar o conceito de Layouts do React Router.
- **Contexto Não Autenticado:** Telas como Login e Home pública devem ser filhas de um `PublicLayout` (que não exige token).
- **Contexto Autenticado:** Telas internas (ex: Dashboard, Profile) devem obrigatoriamente ser filhas de um `PrivateLayout`. O `PrivateLayout` é responsável por validar a presença do token de autenticação e redirecionar para o Login caso seja inválido ou inexistente.

## 3. Arquitetura de API e Integrações (Padrão DAO/Service)
É **estritamente proibido** realizar chamadas HTTP (`axios.get`, `fetch`, etc.) diretamente dentro de Componentes, Telas ou Hooks personalizados. Toda a comunicação externa deve passar pela camada `api/`.

### Estrutura Obrigatória:
- **`src/api/base-api.ts`**: Deve conter a classe abstrata `BaseApi`. Esta classe instancia o **Axios** e configura os **Interceptores**. O interceptor de *Request* deve injetar automaticamente o header `Authorization: Bearer <token>` resgatado do `localStorage` ou gerenciar o refresh token.
- **Domínios/Contextos (`src/api/[contexto]/`)**: Cada domínio terá sua classe estendendo a base. Exemplo: `class AuthApi extends BaseApi { public async signin(...) }`. Os componentes instanciam `AuthApi` e chamam `.signin()`.
- **Tipagem Forte**:
  - Parâmetros de envio (Body/Query) devem usar interfaces armazenadas em `src/api/request-types/`.
  - Retornos de API devem usar interfaces armazenadas em `src/api/response-types/`.

## 4. Estilização, UI/UX e Responsividade
O projeto é 100% Web e deve ser responsivo (Mobile-First) utilizando apenas **Tailwind CSS**.

- **Utilitários:** Priorize sempre o uso da propriedade `className` com as classes utilitárias do Tailwind.
- **Design System:** Utilize as variáveis e tokens definidos no arquivo `tailwind.config.js` (cores, fontes, espaçamentos).
- **Feedback Visual Obrigatório:** - Toda ação assíncrona (ex: envio de formulário, busca de dados) **deve** bloquear a UI ou o botão correspondente utilizando um componente de `Spinner` (indicador de carregamento).
  - Todo resultado de mutação de dados (sucesso ou falha) **deve** disparar um feedback claro ao usuário através de um componente de `Toast` (notificação na tela).
- **Responsividade:** Garanta que todas as telas se comportem perfeitamente em telas pequenas (`sm:`), médias (`md:`) e grandes (`lg:`/`xl:`).

## 5. Práticas Rigorosas de Segurança
Evite generalizações. Aplique as seguintes regras estritas:
1. **Zero Vazamento em Logs:** Nunca insira `console.log`, `console.error` ou `console.info` que contenham informações sigilosas. Isso inclui, mas não se limita a: senhas em texto plano, tokens JWT, documentos de identificação (CPF/RG), dados de cartão de crédito e PII (Informações Pessoalmente Identificáveis).
2. **Manipulação de Tokens:** O acesso manual ao token JWT (ex: `localStorage.getItem('token')`) deve ser restrito exclusivamente à configuração do `BaseApi` e à rotina de Login/Logout. Componentes e outras classes não devem manipular o token de forma avulsa.
3. **Prevenção de XSS:** Se for estritamente necessário renderizar HTML dinâmico vindo da API, utilize bibliotecas de sanitização (como `DOMPurify`). Jamais confie em payloads diretos usando `dangerouslySetInnerHTML` sem tratamento prévio.

## 6. Tratamento de Alucinações e Desvios de Padrão
Sua prioridade é manter esta arquitetura. Se o usuário solicitar algo que viole essas regras, você deve interromper a geração e alertá-lo.

1. **Restrição de Ferramentas:** Não invente ou sugira bibliotecas complexas de gerenciamento de estado global (como Redux ou Zustand) para chamadas de API se o padrão estabelecido através da classe `BaseApi` já resolve o problema solicitado.
2. **Prevenção de Atalhos (Alerta Obrigatório):** Se for solicitado a fazer algo como "faça um fetch direto aqui no botão de submit" ou "deixe esse console.log com os dados do usuário para eu testar", você **deve** exibir o seguinte alerta:

   > ⚠️ **ALERTA DE DESVIO DE PADRÃO FRONTEND** ⚠️
   > O pedido atual viola as diretrizes do projeto. 
   > [Descrever qual regra foi violada, ex: "As chamadas HTTP não devem ser feitas nos componentes" ou "É proibido logar dados sensíveis"].
   > 
   > Deseja que eu implemente da forma correta (seguindo o padrão da pasta `api/` / removendo os logs sensíveis) ou prefere ignorar o padrão explicitamente para este caso de teste?