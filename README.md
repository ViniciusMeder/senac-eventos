<div align="center">
   
# Senac Eventos
Plataforma de gerenciamento e divulgação de eventos internos

</div>

## Descrição
A plataforma de Eventos Senac é uma solução web/mobile criada para centralizar
a divulgação e gestão de todas as atividades acadêmicas da instituição, como palestras,
workshops e bootcamps. O sistema elimina a dispersão de informações, permitindo que alunos
de todos os cursos e o público externo encontrem e se inscrevam em eventos em um só lugar.

## Tecnologias Usadas
O projeto deve ser desenvolvido utilizando obrigatoriamente:
- Next.js
- TypeScript
- Bibliotecas recomendadas:
   - Tailwind CSS
   - React Hook Form
   - Zod
   - TanStack Query
   - TanStack Table

## Arquiteturas

O projeto segue uma arquitetura de **Single Page Application (SPA)** com React + Vite,
organizada por funcionalidade:

### Estrutura de Pastas

senac-eventos-clean/
├── src/
│   ├── pages/        # Páginas da aplicação (Home, Login, Gestor)
│   ├── data/         # Dados estáticos e mocks (eventos)
│   └── utils/        # Funções auxiliares (autenticação)
├── components/
│   └── ui/           # Componentes reutilizáveis de interface (shadcn/ui)
└── lib/
    └── utils.ts      # Utilitários compartilhados (cn, etc.)

### Fluxo de Navegação

- `/`        → Página principal com listagem e busca de eventos
- `/login`   → Autenticação de gestores
- `/gestor`  → Painel de gerenciamento de eventos (área restrita)

### Padrões Adotados

- **Componentes UI reutilizáveis** via shadcn/ui (Button, Card, Badge, Input)
- **Roteamento client-side** com React Router DOM v7
- **Animações declarativas** com Framer Motion (Motion)
- **Dados mockados** em `src/data/events.ts` (sem backend ainda)
- **Estilização utilitária** com Tailwind CSS v4

## Instruções para execução

### Rodando localmente
**Requisitos:** [Node.js](https://nodejs.org/en), [Next.js](https://nextjs.org/)

1. Realize o download e instalação do [Node.js](https://nodejs.org/en/download)
   
3. Instale as dependências Next.js: `npm install`

5. Rode o projeto: `npm run dev`
