# 🐾 PetConnect

**Conectando animais que precisam de um lar a pessoas que desejam adotar.**

O PetConnect é um projeto desenvolvido com o objetivo de aproximar ONGs de proteção animal e pessoas interessadas em adoção responsável. A plataforma busca facilitar a divulgação de animais disponíveis para adoção e tornar o processo de conexão mais acessível.

## 🎯 Objetivo do projeto

Desenvolver uma plataforma digital que permita:

- Facilitar a divulgação de animais disponíveis para adoção.
- Conectar ONGs a possíveis adotantes.
- Permitir o cadastro e gerenciamento de animais.
- Disponibilizar informações sobre os animais, como espécie, idade, porte, sexo e descrição.
- Incentivar a adoção responsável.

## 🚀 Funcionalidades

 Estrutura inicial do projeto.
 Cadastro de usuários.
 Cadastro de ONGs.
Cadastro de animais para adoção.
 Exibição dos animais disponíveis.
Visualização dos detalhes dos animais.
Integração entre usuários e ONGs.

## Arquetetura
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

## 🛠️ Tecnologias

React Native: desenvolvimento do aplicativo mobile.

TypeScript: tipagem e organização do código.

Expo: ambiente de desenvolvimento.

## 📱 Desenvolvimento

O projeto está em desenvolvimento e suas funcionalidades estão sendo implementadas gradualmente.

## 👩‍💻 Desenvolvedores

Projeto acadêmico desenvolvido como parte dos estudos em Desenvolvimento de Software Multiplataforma (DSM).
Desenvolvedores: Apolo Bastos, Bárbara Brandino, Clara Vecchio, Jacqueline Silva, Nicolas Bernardino
---

🐶 **PetConnect — Adotar é transformar vidas.**
