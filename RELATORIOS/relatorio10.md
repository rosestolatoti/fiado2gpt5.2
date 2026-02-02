# Relatório 10 - 2026-02-02

## Objetivo
Corrigir erro de runtime das functions no deploy do Vercel.

## Evidência do erro
- Build falhou com: "Os tempos de execução das funções devem ter uma versão válida".

## Alterações realizadas
- vercel.json: runtime ajustado para "@vercel/node@3.0.0" em functions.

## Testes executados
- npm run check (ok)

## Próximos passos
- Aguardar deploy automático do novo commit.
- Testar /api/products após conclusão do deploy.
