# ManutControl

Sistema web para controle de manutenção de equipamentos, transformado a partir do relatório acadêmico do projeto.

## O que o sistema faz

- Cadastra equipamentos com status, criticidade, localização e responsável.
- Abre, acompanha, conclui, cancela e remove ordens de serviço.
- Mantém planos preventivos recorrentes e gera OS a partir deles.
- Exibe KPIs de operação: OS abertas, atrasos, preventivas próximas, conformidade e custos.
- Salva os dados no navegador via `localStorage`.
- Exporta backup em JSON e ordens de serviço em CSV.

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

## Persistência

A versão atual funciona sem backend e salva os dados no `localStorage` do navegador. O próximo passo natural da Fase 2 é trocar essa camada por uma API com banco MySQL, mantendo os mesmos fluxos de equipamentos, ordens e planos preventivos.
