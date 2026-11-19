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
```text
mobile/
├── .env.example                     # Exemplo de variáveis de ambiente (API URL, Google Client ID e Firebase Config)
├── .gitignore                       # Arquivos e pastas ignorados pelo Git
├── AGENTS.md                        # Instruções e diretrizes para agentes
├── app.json                         # Configurações do projeto Expo
├── App.tsx                           # Ponto de entrada com AuthProvider e AppNavigator
├── GEMINI.md                        # Instruções e diretrizes do Gemini
├── index.ts                          # Ponto de entrada do Expo
├── LICENSE                           # Licença do projeto
├── metro.config.js                   # Configuração do Metro Bundler
├── package.json                      # Dependências e scripts do projeto
├── PROJECT_CONTEXT.md                # Documentação e contexto do projeto
├── tsconfig.json                     # Configuração do TypeScript
├── assets/                            # Recursos estáticos (ícones, favicon e splash screen)
├── openspec/                          # Especificações, propostas e alterações do OpenSpec
└── src/
    ├── components/                    # Componentes reutilizáveis da interface
    │   └── ui/
    │       ├── Button.tsx             # Botão reutilizável com diferentes variantes
    │       ├── Header.tsx             # Cabeçalho unificado com botão de voltar e título
    │       ├── HeaderLogin.tsx        # Cabeçalho específico para login e boas-vindas
    │       ├── Input.tsx              # Campo de texto com suporte a máscaras e erros
    │       ├── InputGroup.tsx         # Campo rotulado com máscaras (CPF, CNPJ, CEP e telefone)
    │       ├── MainLayout.tsx         # Layout responsivo com navegação condicional
    │       ├── OptionCard.tsx         # Cartão de seleção de perfil (Tutor ou ONG)
    │       └── OrDivider.tsx           # Divisor visual com texto centralizado ("ou")
    │
    ├── contexts/                      # Contextos globais da aplicação
    │   └── AuthContext.tsx            # Gerenciamento de autenticação e sessão com Firebase
    │
    ├── database/                      # Camada de persistência local com SQLite
    │   ├── AnimalDAO.ts               # Operações CRUD de animais
    │   ├── Database.ts               # Inicialização e conexão com o banco SQLite
    │   ├── FavoritosDAO.ts            # Gerenciamento de animais favoritos
    │   ├── OngDAO.ts                  # Operações CRUD de ONGs
    │   ├── SolicitacaoDAO.ts          # Gerenciamento de solicitações de adoção
    │   └── UsuarioDAO.ts              # Operações CRUD de usuários/tutores
    │
    ├── models/
    │   └── types.ts                   # Tipos globais (Usuario, Ong, Animal, Solicitacao e Favorito)
    │
    ├── navigation/
    │   └── AppNavigator.tsx           # Navegação com React Navigation Native Stack e controle de sessão
    │
    ├── screens/                       # Telas da aplicação
    │   ├── HomeBase.tsx               # Componente base para listagens e dashboards
    │   ├── LoginScreen.tsx             # Login por CPF, CNPJ, e-mail, senha e Google OAuth
    │   ├── PetDetailsScreen.tsx        # Detalhes do pet e informações da ONG
    │   ├── SettingsScreen.tsx          # Configurações do usuário e logout
    │   ├── SolicitacoesBase.tsx        # Componente base para gestão de solicitações
    │   ├── TelaCadastroOng.tsx         # Cadastro de ONGs com máscaras de CNPJ e CEP
    │   ├── TelaCadastroUsuario.tsx     # Cadastro de tutores com máscaras de CPF e CEP
    │   ├── TelaEscolhaCadastro.tsx     # Seleção de perfil para cadastro (Tutor ou ONG)
    │   ├── TelaHomeOngs.tsx            # Dashboard principal das ONGs
    │   ├── TelaHomeUsuario.tsx         # Dashboard principal dos tutores/adotantes
    │   ├── TelaSolicitacoesOngs.tsx    # Visualização de solicitações recebidas pelas ONGs
    │   └── TelaSolicitacoesUsuario.tsx # Visualização de solicitações enviadas pelos tutores
    │
    ├── services/                      # Serviços e integrações externas
    │   ├── auth.ts                    # Serviços de autenticação, Firebase, SQLite e Google OAuth
    │   └── firebase.ts                # Inicialização do Firebase App, Auth e Firestore
    │
    ├── types/
    │   └── navigation.ts              # Tipagem das rotas e propriedades de navegação
    │
    └── utils/
        └── masks.ts                   # Funções de formatação e máscaras (CPF, CNPJ, telefone e CEP)
```

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
