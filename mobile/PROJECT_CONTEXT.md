# PetConnect Mobile - Contexto e Documentação do Projeto

Este documento apresenta a arquitetura, estrutura de diretórios, rotas, serviços de banco de dados, autenticação e componentes de interface do aplicativo **PetConnect Mobile**, desenvolvido em React Native com Expo e TypeScript.

---

## 1. Árvore Completa de Diretórios e Arquivos

```text
mobile/
├── .env.example                     # Exemplo de variáveis de ambiente (API URL, Google Client ID e Firebase config)
├── .gitignore                       # Arquivos e pastas ignorados pelo Git
├── AGENTS.md                        # Instruções e diretrizes de agentes
├── app.json                         # Configuração do projeto Expo
├── App.tsx                          # Ponto de entrada com AuthProvider e AppNavigator
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
    │       ├── Header.tsx           # Cabeçalho unificado com botão circular de voltar (40x40px, #E6F4EA, #047857) e título
    │       ├── HeaderLogin.tsx      # Cabeçalho específico para telas de login/boas-vindas
    │       ├── Input.tsx            # Campo de texto base com suporte a máscaras e erros
    │       ├── InputGroup.tsx       # Grupo de input rotulado com suporte a máscaras (CPF, CNPJ, CEP, telefone)
    │       ├── MainLayout.tsx       # Layout wrapper responsivo com visibilidade de navegação condicional (oculta em rotas não autenticadas)
    │       ├── OptionCard.tsx       # Card de escolha (ex.: perfil Tutor vs ONG)
    │       └── OrDivider.tsx        # Divisor visual com texto central ("ou")
    ├── contexts/                    # Contextos globais da aplicação
    │   └── AuthContext.tsx          # Gerenciamento global de autenticação, sessão com Firebase Auth & Firestore onSnapshot
    ├── database/                    # Camada de persistência local (SQLite)
    │   ├── AnimalDAO.ts             # Operações de CRUD para animais
    │   ├── Database.ts              # Inicialização e conexão com o banco SQLite Expo
    │   ├── FavoritosDAO.ts          # Gerenciamento de animais favoritos do usuário
    │   ├── OngDAO.ts                # Operações de CRUD para ONGs
    │   ├── SolicitacaoDAO.ts        # Gerenciamento de solicitações de adoção
    │   └── UsuarioDAO.ts            # Operações de CRUD para usuários/tutores
    ├── models/
    │   └── types.ts                 # Tipos globais de domínio (Usuario, Ong, Animal, Solicitacao, Favorito)
    ├── navigation/
    │   └── AppNavigator.tsx         # Configuração do React Navigation (Native Stack) com checagem de sessão
    ├── screens/
    │   ├── HomeBase.tsx             # Componente base para listagens e dashboards da Home
    │   ├── LoginScreen.tsx          # Tela de login por CPF/CNPJ/Email/Senha e Google OAuth
    │   ├── PetDetailsScreen.tsx     # Tela de detalhes do pet com chips de características e nome dinâmico da ONG
    │   ├── SettingsScreen.tsx       # Tela de configurações do usuário e logout seguro
    │   ├── SolicitacoesBase.tsx     # Tela base para gestão de solicitações
    │   ├── TelaCadastroOng.tsx      # Cadastro de ONGs com máscara de CNPJ/CEP e container responsivo
    │   ├── TelaCadastroUsuario.tsx  # Cadastro de Tutores com máscara de CPF/CEP e container responsivo
    │   ├── TelaEscolhaCadastro.tsx  # Tela de seleção de perfil para cadastro (Tutor x ONG)
    │   ├── TelaHomeOngs.tsx         # Dashboard principal para ONGs cadastradas
    │   ├── TelaHomeUsuario.tsx      # Dashboard principal para tutores/adotantes
    │   ├── TelaSolicitacoesOngs.tsx # Visualização de solicitações recebidas pela ONG
    │   └── TelaSolicitacoesUsuario.tsx # Visualização de solicitações enviadas pelo tutor
    ├── services/
    │   ├── auth.ts                  # Serviços de autenticação Firebase Auth, Firestore, SQLite, Google OAuth & Mini-Reg
    │   └── firebase.ts              # Inicialização do Firebase App, Auth (persistência AsyncStorage) e Firestore
    ├── types/
    │     └── navigation.ts            # Tipagem de rotas e props de navegação (RootStackParamList)
    └── utils/
        └── masks.ts                 # Funções utilitárias de formatação e máscaras (CPF, CNPJ, Telefone, CEP)
```

---

## 2. Layout Responsivo e Navegação Adaptativa (`MainLayout.tsx`)

- **MainLayout**:
  - **Ocultação em Rotas Não Autenticadas**: Oculta automaticamente qualquer barra de navegação (topo ou rodapé) em rotas como `Login`, `EscolhaCadastro`, `CadastroUsuario` e `CadastroOng` ou quando o usuário não estiver autenticado.
  - **Navegação Adaptativa Autenticada**: Exibe cabeçalho superior (Top Navbar) em desktops e barra inferior (Bottom Navigation Bar) em mobile.
  - **Containers Responsivos**: `maxWidth: 480` para formulários e `maxWidth: 1080` para dashboards/listagens.

---

## 3. Autenticação e Google OAuth Mini-Registration

- **Google OAuth Flow (`auth.ts`, `AuthContext.tsx`)**:
  - Verifica a existência do documento do usuário no Firestore (`users/{uid}`) após o login com Google.
  - Caso o documento não exista, marca `needsProfileCompletion: true` para direcionar o fluxo de registro do perfil (Tutor ou ONG).
