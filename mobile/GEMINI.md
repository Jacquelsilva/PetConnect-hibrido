@AGENTS.md

# Diretrizes de Desenvolvimento - PetConnect Mobile

Este projeto é uma aplicação mobile em React Native com Expo e TypeScript desenvolvida para o Projeto Integrador (PI). Todo o código gerado deve seguir rigorosamente os padrões de componentização e boas práticas descritos abaixo.

## 1. Componentização & Arquitetura de Código

- **Componentes Modulares**: Toda a interface deve ser dividida em componentes pequenos, reutilizáveis e isolados na pasta `src/components/` (ex.: `Button.tsx`, `Input.tsx`, `CardPet.tsx`, `Header.tsx`).
- **TypeScript Estrito**: Não utilize `any`. Todas as `props` dos componentes devem ser fortemente tipadas com `interface` ou `type` explícitos.
- **Responsabilidade Única (SRP)**: Os componentes de UI devem focar-se apenas na apresentação visual. Lógicas complexas ou chamadas a APIs devem ser isoladas em Custom Hooks na pasta `src/hooks/`.
- **Estado Global de Sessão**: Utilize o `AuthContext` (`src/contexts/AuthContext.tsx`) com o hook `useAuth()` para que alterações no perfil do usuário (ex.: edição de nome/foto) reflitam instantaneamente na interface sem necessidade de relogar.

## 2. Estilização, Design System & Responsividade Web/Mobile

- **Estilização Nativa**: Utilize `StyleSheet.create` do React Native mantendo os estilos organizados e próximos ao componente correspondente.
- **Padrão Visual**: Respeite a paleta de cores e tipografia padrão do PetConnect (Verde Principal `#10B981` / `#059669`, Verde Água `#047857`, Fundo `#F9FAFB` e Vermelho de Alerta `#EF4444`).
- **Layout Responsivo Fluido (Desktop x Mobile)**:
  - **Containers de Formulário/Foco**: Para telas de Login, Cadastros e Edição, utilize largura relativa `width: '90%'`, `maxWidth: 480`, `minWidth: 320` e centralização automática (`alignSelf: 'center'` / `margin: '0 auto'`).
  - **Containers de Conteúdo/Dashboards**: Em telas de listagens e navegação (Home, Pets, Solicitações), utilize `width: '100%'`, `maxWidth: 1080` com grid fluido de cards no Desktop (2 ou 3 colunas) e lista única no Mobile.
  - **Navegação Adaptativa**: No Mobile, utilize barra de navegação inferior (Bottom Tabs com ícones de Início, Pets/Favoritos, Solicitações, Configurações). No Desktop, utilize cabeçalho superior completo com links diretos.
  - **Padronização do Header de Voltar**: Em sub-telas, utilize o componente unificado `Header.tsx` com a seta limpa de voltar (`←`) posicionada à esquerda.

@AGENTS.md

# Diretrizes de Desenvolvimento - PetConnect Mobile

Este projeto é uma aplicação mobile em React Native com Expo e TypeScript desenvolvida para o Projeto Integrador (PI). Todo o código gerado deve seguir rigorosamente os padrões de componentização e boas práticas descritos abaixo.

## 1. Componentização & Arquitetura de Código

- **Componentes Modulares**: Toda a interface deve ser dividida em componentes pequenos, reutilizáveis e isolados na pasta `src/components/` (ex.: `Button.tsx`, `Input.tsx`, `CardPet.tsx`, `Header.tsx`).
- **TypeScript Estrito**: Não utilize `any`. Todas as `props` dos componentes devem ser fortemente tipadas com `interface` ou `type` explícitos.
- **Responsabilidade Única (SRP)**: Os componentes de UI devem focar-se apenas na apresentação visual. Lógicas complexas ou chamadas a APIs devem ser isoladas em Custom Hooks na pasta `src/hooks/`.
- **Estado Global de Sessão**: Utilize o `AuthContext` (`src/contexts/AuthContext.tsx`) com o hook `useAuth()` para que alterações no perfil do usuário (ex.: edição de nome/foto) reflitam instantaneamente na interface sem necessidade de relogar.

## 2. Estilização, Design System & Responsividade Web/Mobile

- **Estilização Nativa**: Utilize `StyleSheet.create` do React Native mantendo os estilos organizados e próximos ao componente correspondente.
- **Padrão Visual**: Respeite a paleta de cores e tipografia padrão do PetConnect (Verde Principal `#10B981` / `#059669`, Verde Água `#047857`, Fundo `#F9FAFB` e Vermelho de Alerta `#EF4444`).
- **Layout Responsivo Fluido (Desktop x Mobile)**:
  - **Containers de Formulário/Foco**: Para telas de Login, Cadastros e Edição, utilize largura relativa `width: '90%'`, `maxWidth: 480`, `minWidth: 320` e centralização automática (`alignSelf: 'center'` / `margin: '0 auto'`).
  - **Containers de Conteúdo/Dashboards**: Em telas de listagens e navegação (Home, Pets, Solicitações), utilize `width: '100%'`, `maxWidth: 1080` com grid fluido de cards no Desktop (2 ou 3 colunas) e lista única no Mobile.
  - **Navegação Adaptativa**: No Mobile, utilize barra de navegação inferior (Bottom Tabs com ícones de Início, Pets/Favoritos, Solicitações, Configurações). No Desktop, utilize cabeçalho superior completo com links diretos.
  - **Padronização do Header de Voltar**: Em sub-telas, utilize o componente unificado `Header.tsx` com a seta limpa de voltar (`←`) posicionada à esquerda.

## 3. Diretrizes de Qualidade, Documentação e Git

- **Código Limpo e Humano**: Escreva um código limpo, com nomes de variáveis descritivos em inglês padronizado, acompanhado de comentários didáticos.
- **Estrutura Padrão Expo**: Mantenha a estrutura tradicional de pastas (`src/components`, `src/screens`, `src/hooks`, `src/services`, `src/types`, `src/contexts`).
- **Manutenção Automática do Contexto**: Toda alteração de rotas, novas telas, componentes ou estrutura do banco SQLite deve ser refletida atualizando o arquivo `PROJECT_CONTEXT.md` na raiz.
- **Instruções de Commit Auxiliares**:
  - Ao finalizar propostas de código, crie o arquivo `.commit-instructions.md` na raiz caso ele ainda não exista.
  - Se o arquivo já existir, **acrescente as novas instruções ao conteúdo existente**, sem apagar, substituir, reescrever ou reorganizar os registros anteriores.
  - Preserve integralmente todos os commits já documentados, incluindo suas mensagens, arquivos alterados e observações.
  - Cada nova alteração deve gerar uma nova seção independente, contendo os arquivos modificados e a respectiva mensagem `git commit` sugerida.
  - Não reutilize mensagens ou instruções de commits anteriores para alterações novas.
  - Não execute commits automaticamente. Apenas documente as instruções para execução manual.
  - **Regra fundamental: nunca refaça, altere ou sobrescreva instruções de commits anteriores. Sempre trabalhe de forma incremental, acrescentando novos registros ao final do arquivo.**
