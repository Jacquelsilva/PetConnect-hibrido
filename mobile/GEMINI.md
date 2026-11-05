@AGENTS.md


# Diretrizes de Desenvolvimento - PetConnect Mobile

Este projeto é uma aplicação mobile em React Native com Expo e TypeScript desenvolvida para o Projeto Integrador (PI). Todo o código gerado deve seguir rigorosamente os padrões de componentização e boas práticas descritos abaixo.

## 1. Componentização & Arquitetura de Código
- **Componentes Modulares**: Toda a interface deve ser dividida em componentes pequenos, reutilizáveis e isolados na pasta `src/components/` (ex.: `Button.tsx`, `Input.tsx`, `CardPet.tsx`, `Header.tsx`).
- **TypeScript Estrito**: Não utilize `any`. Todas as `props` dos componentes devem ser fortemente tipadas com `interface` ou `type` explícitos.
- **Responsabilidade Única (SRP)**: Os componentes de UI devem focar-se apenas na apresentação visual. Lógicas complexas ou chamadas a APIs devem ser isoladas em Custom Hooks na pasta `src/hooks/`.

## 2. Estilização, Design System & Responsividade Web/Mobile
- **Estilização Nativa**: Utilize `StyleSheet.create` do React Native mantendo os estilos organizados e próximos ao componente correspondente.
- **Padrão Visual**: Respeite a paleta de cores e tipografia padrão do PetConnect (tons amigáveis para pets, espaçamentos consistentes de 8px/16px/24px e cantos arredondados).
- **Layout Responsivo por Tipo de Tela (Desktop x Mobile)**:
  - **Containers Pequenos (`FormContainer`)**: Para telas de formulários/autenticação (Login, Cadastro), utilize `maxWidth: 480` centralizado na tela.
  - **Containers Amplos (`MainContainer`)**: Para telas de listagens, dashboards e navegação principal (Home, Pets, Agendamentos), utilize `maxWidth: 1080` (ou `1200`), permitindo grid de cards e tabelas no Desktop.
  - **Mobile Nativo**: Em telas com largura menor que a máxima, os containers devem ocupar `width: '100%'` com paddings laterais adequados (ex.: 16px).

## 3. Diretrizes de Qualidade para Avaliação Académica
- **Código Limpo e Humano**: Escreva um código limpo, com nomes de variáveis descritivos em inglês padronizado, acompanhado de comentários didáticos onde a lógica for mais complexa.
- **Estrutura Padrão Expo**: Mantenha a estrutura tradicional de pastas (`src/components`, `src/screens`, `src/hooks`, `src/services`, `src/types`) para que o projeto pareça 100% desenvolvido à mão.