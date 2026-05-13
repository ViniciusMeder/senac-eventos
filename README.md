<div align="center">
   
# Senac Eventos
Plataforma de gerenciamento e divulgação de eventos internos

</div>

## Descrição
A plataforma de Eventos Senac é uma solução web criada para centralizar
a divulgação e gestão de todas as atividades acadêmicas da instituição, como palestras,
workshops e bootcamps. O sistema elimina a dispersão de informações, permitindo que alunos
de todos os cursos e o público externo encontrem e se inscrevam em eventos em um só lugar.

## Tecnologias Usadas

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — bundler e servidor de desenvolvimento
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM v7](https://reactrouter.com/) — roteamento client-side
- [shadcn/ui](https://ui.shadcn.com/) — componentes de interface (Button, Card, Badge, Input)
- [Framer Motion](https://motion.dev/) — animações declarativas
- [Lucide React](https://lucide.dev/) — ícones

## Arquiteturas

O projeto segue uma arquitetura de **Single Page Application (SPA)** com React + Vite,
organizada por responsabilidade:

```
senac-eventos-clean/
├── src/
│   ├── App.tsx              # Definição das rotas da aplicação
│   ├── main.tsx             # Ponto de entrada
│   ├── index.css            # Estilos globais e variáveis de tema
│   ├── pages/
│   │   ├── Home.tsx         # Listagem pública de eventos com busca e filtros
│   │   ├── Login.tsx        # Autenticação por matrícula e senha
│   │   └── Gestor.tsx       # Painel administrativo (rota protegida)
│   ├── data/
│   │   └── events.ts        # Dados mockados dos eventos (tipo Event[])
│   └── utils/
│       └── auth.ts          # Funções de login, logout e verificação de sessão
├── components/
│   └── ui/                  # Componentes reutilizáveis via shadcn/ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   └── utils.ts             # Utilitário cn() para classes condicionais
├── package.json
├── vite.config.ts
└── .env.example
```

### Fluxo de Navegação

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home — listagem e busca de eventos | Público |
| `/login` | Login — autenticação por matrícula e senha | Público |
| `/gestor` | Painel de gestão (Dashboard, Eventos, Participantes, Ingressos, Relatórios) | Restrito (gestor) |

### Autenticação

A autenticação é feita via `localStorage`. O utilitário `src/utils/auth.ts` expõe as funções `login()`, `logout()`, `isAuthenticated()` e `getUserType()`. A página `/gestor` verifica a sessão ao carregar e redireciona para `/login` caso o usuário não seja do tipo `gestor`.

**Credenciais de teste:**

| Tipo | Matrícula | Senha |
|---|---|---|
| Gestor | `gestor` | `1234` |
| Aluno | `aluno` | `1234` |

## Instruções para execução

### Rodando localmente

**Requisitos:** [Node.js](https://nodejs.org/en)

1. Realize o download e instalação do [Node.js](https://nodejs.org/en/download)

2. Clone o repositório:
   ```bash
   git clone https://github.com/ViniciusMeder/senac-eventos.git
   ```

3. Entre na pasta do projeto:
   ```bash
   cd senac-eventos/senac-eventos-clean
   ```

4. Instale as dependências:
   ```bash
   npm install
   ```

5. Rode o projeto:
   ```bash
   npm run dev
   ```

6. Acesse no navegador: [http://localhost:3000](http://localhost:3000)
