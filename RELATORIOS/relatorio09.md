# Relatório 09 - 2026-02-02

## Objetivo
Ajustar configuração do Vercel para garantir detecção de funções e roteamento de /api.

## Alterações realizadas
- vercel.json: functions alterado para "api/**/*.ts" e framework definido como null.

## Resultados esperados
- Funções em api/ reconhecidas automaticamente.
- /api/* roteado para api/[...path].ts.

## Testes executados
- npm run check (ok)

## Status atual
- Produção continua com 404 em /api até redeploy sem cache.

## Próximos passos no Vercel
- Root Directory vazio.
- Variáveis DATABASE_URL, JWT_SECRET, NODE_ENV configuradas.
- Clear Build Cache + Redeploy sem cache.
