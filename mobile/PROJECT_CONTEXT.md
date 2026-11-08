# PetConnect Mobile - Contexto e Documentação do Projeto

Este documento apresenta a arquitetura, estrutura de diretórios, rotas, serviços de banco de dados, autenticação e componentes de interface do aplicativo **PetConnect Mobile**, desenvolvido em React Native com Expo e TypeScript.

---

## 1. Árvore Completa de Diretórios e Arquivos

```text
mobile/
├── .env.example                     # Exemplo de variáveis de ambiente (API URL e Google Client ID)
├── .gitignore                       # Arquivos e pastas ignorados pelo Git
├── AGENTS.md                        # Instruções e diretrizes de agentes
├── app.json                         # Configuração do projeto Expo
├── App.tsx                          # Ponto de entrada com AuthProvider e AppNavigator
├── CLAUDE.md                        # Instruções para Claude
├── GEMINI.md                        # Instruções e diretrizes do Gemini
├── index.ts                         # Ponto de entrada do Expo
├── LICENSE                          # Licença do projeto
├── metro.config.js                  # Configuração do Metro Bundler
├── package.json                     # Dependências e scripts
├── PROJECT_CONTEXT.md               # Documentação e contexto do projeto
├── tsconfig.json                    # Configuração TypeScript
├── assets/                          # Recursos estáticos (ícones, favicon, splash screen)
├── openspec/                        # Arquivos de especificação, propostas e mudanças OpenSpec
└── src/
    ├── components/                  # Componentes de interface modulares
    │   └── ui/
    │       ├── Button.tsx           # Botão reutilizável com variantes (primary, secondary, google, outline)
    │       ├── Header.tsx           # Cabeçalho responsivo com botão de voltar e título
    │       ├── HeaderLogin.tsx      # Cabeçalho específico para telas de login/boas-vindas
    │       ├── Input.tsx            # Campo de texto base com suporte a máscaras e erros
    │       ├── InputGroup.tsx       # Grupo de input rotulado com suporte a máscaras (CPF, CNPJ, CEP, telefone)
    │       ├── OptionCard.tsx       # Card de escolha (ex.: perfil Tutor vs ONG)
    │       └── OrDivider.tsx        # Divisor visual com texto central ("ou")
    ├── contexts/                    # Contextos globais da aplicação
    │   └── AuthContext.tsx          # Gerenciamento global de autenticação, sessão e hook useAuth
    ├── database/                    # Camada de persistência local (SQLite)
│   │   ├── AnimalDAO.ts             # Operações de CRUD para animais
│   │   ├── Database.ts              # Inicialização e conexão com o banco SQLite Expo
│   │   ├── FavoritosDAO.ts          # Gerenciamento de animais favoritos do usuário
│   │   ├── OngDAO.ts                # Operações de CRUD para ONGs
│   │   ├── SolicitacaoDAO.ts        # Gerenciamento de solicitações de adoção
│   │   └── UsuarioDAO.ts            # Operações de CRUD para usuários/tutores
│   ├── models/
│   │   └── types.ts                 # Tipos globais de domínio (Usuario, Ong, Animal, Solicitacao, Favorito)
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Configuração do React Navigation (Native Stack) com checagem de sessão
│   ├── screens/
│   │   ├── HomeBase.tsx             # Componente base para listagens e dashboards da Home
│   │   ├── LoginScreen.tsx          # Tela de login por CPF/CNPJ/Senha e Google OAuth
│   │   ├── PetDetailsScreen.tsx     # Tela de detalhes do pet com chips de características e solicitação de adoção
   │   ├── SettingsScreen.tsx       # Tela de configurações do usuário e logout seguro
│   │   ├── SolicitacoesBase.tsx     # Tela base para gestão de solicitações
│   │   ├── TelaCadastroOng.tsx      # Cadastro de ONGs com máscara de CNPJ/CEP e container responsivo
│   │   ├── TelaCadastroUsuario.tsx  # Cadastro de Tutores com máscara de CPF/CEP e container responsivo
│   │   ├── TelaEscolhaCadastro.tsx  # Tela de seleção de perfil para cadastro (Tutor x ONG)
│   │   ├── TelaHomeOngs.tsx         # Dashboard principal para ONGs cadastradas
│   │   ├── TelaHomeUsuario.tsx      # Dashboard principal para tutores/adotantes
│   │   ├── TelaSolicitacoesOngs.tsx # Visualização de solicitações recebidas pela ONG
│   │   └── TelaSolicitacoesUsuario.tsx # Visualização de solicitações enviadas pelo tutor
│   ├── services/
│   │   └── auth.ts                  # Serviços de autenticação, login, OAuth e AsyncStorage (sessão)
│   ├── types/
│   │   └── navigation.ts            # Tipagem de rotas e props de navegação (RootStackParamList)
│   └── utils/
│       └── masks.ts                 # Funções utilitárias de formatação e máscaras (CPF, CNPJ, Telefone, CEP)
├── App.tsx                          # Ponto de entrada principal da aplicação Expo
├── app.json                         # Configuração do projeto Expo
├── package.json                     # Dependências e scripts do projeto
└── tsconfig.json                    # Configuração do TypeScript
```

---

## 2. Custom Hooks, Contexts & Gerenciamento de Estado

Atualmente, o projeto prioriza componentes funcionais com **React Hooks** nativos (`useState`, `useEffect`) para gerenciamento de estado local em formulários e telas.

- **Autenticação e Sessão (`src/services/auth.ts`)**:
  - Gerencia o armazenamento persistente da sessão do usuário utilizando `@react-native-async-storage/async-storage`.
  - Funções exportadas:
    - `saveSession(session: AuthResponse)`: Salva token e dados do usuário localmente.
    - `getSession()`: Recupera a sessão ativa do armazenamento local.
    - `clearSession()`: Remove a sessão para efetuar o logout.
    - `loginUser(credentials)`: Realiza autenticação via API com fallback offline simulado.
    - `loginWithGoogle()`: Gerencia fluxo OAuth com Expo AuthSession e fallback.
- **Banco de Dados Local (`src/database/Database.ts`)**:
  - Inicializa o banco SQLite (`expo-sqlite`), criando as tabelas relacionais necessárias (`usuarios`, `ongs`, `animais`, `favoritos`, `solicitacoes`) na primeira execução.

---

## 3. Mapeamento de Rotas e Fluxo de Navegação (`RootStackParamList`)

A navegação é gerenciada pelo `@react-navigation/native-stack` em `src/navigation/AppNavigator.tsx`. Na inicialização, a aplicação verifica a persistência de sessão via `getSession()`: se houver um token ativo, direciona automaticamente para a home correspondente (`HomeUsuario` ou `HomeOngs`); caso contrário, exibe a tela de `Login`.

### Rotas Disponíveis (`RootStackParamList`):
1. **`Login`** (`LoginScreen.tsx`):
   - **Origem**: Inicialização (se não logado) ou Logout.
   - **Destinos**:
     - Sucesso no login → `HomeUsuario` ou `HomeOngs`.
     - Botão "Cadastrar como Usuário" → `EscolhaCadastro` ou `CadastroUsuario`.
2. **`EscolhaCadastro`** (`TelaEscolhaCadastro.tsx`):
   - **Origem**: Tela de Login.
   - **Destinos**:
     - Opção Tutor → `CadastroUsuario`.
     - Opção ONG → `CadastroOng`.
3. **`CadastroUsuario`** (`TelaCadastroUsuario.tsx`):
   - **Origem**: Escolha de Cadastro ou Login.
   - **Destinos**:
     - Sucesso no cadastro (autentica automaticamente) → `HomeUsuario`.
     - Botão Voltar → Tela anterior (`goBack()`).
4. **`CadastroOng`** (`TelaCadastroOng.tsx`):
   - **Origem**: Escolha de Cadastro ou Login.
   - **Destinos**:
     - Sucesso no cadastro (autentica automaticamente) → `HomeOngs`.
     - Botão Voltar → Tela anterior (`goBack()`).
5. **`HomeUsuario`** (`TelaHomeUsuario.tsx`):
   - **Origem**: Login bem-sucedido ou Cadastro de Usuário.
   - **Destinos**:
     - Seleção de pet → `PetDetails`.
     - Menu de solicitações → `SolicitacoesUsuario`.
     - Menu de configurações → `Settings`.
6. **`HomeOngs`** (`TelaHomeOngs.tsx`):
   - **Origem**: Login bem-sucedido ou Cadastro de ONG.
   - **Destinos**:
     - Gestão de solicitações → `SolicitacoesOngs`.
     - Configurações → `Settings`.
7. **`SolicitacoesUsuario`** / **`SolicitacoesOngs`**:
   - **Destinos**: Visualização e gerenciamento de solicitações de adoção.
8. **`PetDetails`** (`PetDetailsScreen.tsx`):
   - **Origem**: `HomeUsuario`.
   - **Destinos**:
     - Botão "Solicitar Adoção" (Confirmação e retorno) → Home anterior.
     - Botão Voltar → Tela anterior.
9. **`Settings`** (`SettingsScreen.tsx`):
   - **Origem**: Dashboards (`HomeUsuario`, `HomeOngs`).
   - **Destinos**:
     - Botão "Sair da Conta" (Limpa sessão e reseta pilha) → `Login`.
     - Botão Voltar → Tela anterior.

---

## 4. Estrutura de Dados, Banco de Dados, Autenticação & Variáveis de Ambiente

### 4.1. Banco de Dados SQLite (`src/database/`)
O aplicativo utiliza **`expo-sqlite`** para armazenamento local estruturado em tabelas:
- **`usuarios`**: `id`, `nome`, `cpf`, `email`, `senha`, `cep`, `estado`, `cidade`, `endereco`.
- **`ongs`**: `id`, `nome`, `cnpj`, `email`, `senha`, `cep`, `estado`, `cidade`, `endereco`, `telefone`.
- **`animais`**: `id`, `nome`, `especie`, `idade`, `porte`, `sexo`, `descricao`, `foto`, `ong_id`.
- **`favoritos`**: `id`, `usuario_id`, `animal_id`.
- **`solicitacoes`**: `id`, `usuario_id`, `animal_id`, `ong_id`, `status` (Pendente, Aprovada, Recusada).

### 4.2. DAOs (Data Access Objects)
- **`UsuarioDAO.ts`**: `inserirUsuario`, `loginUsuario`, `buscarUsuarioPorId`, `listarUsuarios`, `atualizarUsuario`, `excluirUsuario`.
- **`OngDAO.ts`**: `inserirOng`, `loginOng`, `listarOngs`, `atualizarOng`, `excluirOng`.
- **`AnimalDAO.ts`**, **`FavoritosDAO.ts`**, **`SolicitacaoDAO.ts`**: Métodos dedicados para gerenciamento de pets, favoritos e fluxo de adoção.

### 4.3. Autenticação e Sessão (`src/services/auth.ts`)
- Suporte a chamadas HTTP para API REST com fallback offline automático (`Network request failed` ativa perfis simulados para testes locais sem backend rodando).
- Armazenamento em `@react-native-async-storage/async-storage` sob a chave `@PetConnect:auth_session`.

### 4.4. Variáveis de Ambiente (`.env.example`)
Configuradas via Expo (padrão `EXPO_PUBLIC_`):
- `EXPO_PUBLIC_API_URL`: URL base da API REST do PetConnect (ex.: `https://api.petconnect.com.br`).
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID`: Client ID para autenticação Google OAuth.

---

## 5. Relatório de Diagnóstico, Consolidação e Auditoria (`.diagnostico-projeto.md`)

O projeto passou por consolidação e auditoria completa cobrindo:
1. **Consolidação de Telas**: Mesclagem das funcionalidades de `AnimalDetailsScreen` e `PetDetailsScreen` em um único arquivo definitivo (`PetDetailsScreen.tsx`), removendo arquivos redundantes e limpando rotas.
2. **Padronização do Header (`Header.tsx`)**: Botão de voltar circular de 40x40px (`#E6F4EA`) com ícone verde (`#047857`), título centralizado e altura de 56px em todas as sub-telas.
3. **Reatividade do AuthContext & Perfil**: Atualização instantânea de sessões e nomes de usuário nas Homes (`Olá, {user?.name}!`) e Settings via `useAuth()`.
4. **Git Hygiene**: Arquivos de diagnóstico e commit ignorados via `.gitignore`.


---

## 5. Componentes de UI Reutilizáveis (`src/components/ui/`)

Todos os componentes seguem o Design System do PetConnect com TypeScript estrito, cantos arredondados, paleta amigável e espaçamentos consistentes.

1. **`Button`**:
   - **Props**: `title?: string`, `children?: React.ReactNode`, `variant?: 'primary' | 'secondary' | 'google' | 'outline'`, `icon?: React.ReactNode`, mais todas as `PressableProps`.
   - **Responsabilidade**: Botão interativo com estados de hover/press e suporte a ícones.
2. **`Header`**:
   - **Props**: `title: string`, `onBackPress?: () => void`, `rightAction?: React.ReactNode`.
   - **Responsabilidade**: Barra de navegação superior responsiva (máx. 1080px no Desktop, 100% no Mobile) com botão opcional de voltar.
3. **`HeaderLogin`**:
   - **Props**: `title: string`, `subtitle: string`.
   - **Responsabilidade**: Cabeçalho decorativo com ícone de pata para telas de autenticação e boas-vindas.
4. **`Input`**:
   - **Props**: `label?: string`, `errorMessage?: string`, `mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'cpf_cnpj' | 'none'`, mais todas as `TextInputProps`.
   - **Responsabilidade**: Campo de texto estilizado com suporte opcional a máscaras de formatação automática.
5. **`InputGroup`**:
   - **Props**: `label: string`, `errorMessage?: string`, `mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'cpf_cnpj' | 'none'`, mais todas as `TextInputProps`.
   - **Responsabilidade**: Wrapper completo de input com rótulo superior, campo formatado e exibição de mensagem de erro.
6. **`OptionCard`**:
   - **Responsabilidade**: Card de escolha de perfil (ex.: Tutor vs ONG).
7. **`OrDivider`**:
   - **Props**: `text?: string`.
   - **Responsabilidade**: Divisor visual com texto central (ex.: "ou").

---

*Documentação gerada automaticamente via OpenSpec para o projeto PetConnect Mobile.*
