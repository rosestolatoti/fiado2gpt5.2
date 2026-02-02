# Relatório 13 - 2026-02-02

## Objetivo
Corrigir falha de import de diretório em runtime ESM no handler serverless.

## Evidência do erro
- ERR_UNSUPPORTED_DIR_IMPORT ao importar /server/routes.

## Alterações realizadas
- api/[...path].ts: import ajustado para "../server/routes.js".

## Testes executados
- npm run check (ok)

## Próximos passos
- Commit e push da correção.
- Aguardar deploy automático.
- Testar /api/products após o deploy.
