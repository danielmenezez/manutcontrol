# ManutControl

Dashboard acadêmico em React para apresentar o projeto **ManutControl**, um sistema de controle de manutenção de equipamentos.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Como executar

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia o servidor local.
- `npm run build`: valida TypeScript e gera a build de produção.
- `npm run lint`: executa a análise estática.

## Arquitetura

```txt
src/
  app/          Configuração da aplicação e navegação
  components/   Componentes reutilizáveis de layout e UI
  data/         Conteúdo estruturado do projeto
  features/     Seções por domínio da apresentação
  hooks/        Hooks compartilhados
  types/        Tipos do domínio
  utils/        Funções puras de formatação e métricas
```

O conteúdo do projeto fica isolado em `src/data/project.ts`, facilitando alterações futuras sem mexer na camada visual.
