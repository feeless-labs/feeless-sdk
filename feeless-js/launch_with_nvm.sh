#!/bin/bash

# Hardcode del percorso di NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Usa la versione corretta di Node.js
source "$NVM_DIR/nvm.sh" && nvm use 20.0.0

# Esegui lo script con ts-node, passando il percorso dello script TypeScript come argomento
node --loader ts-node/esm  --inspect-brk -r ts-node/register/transpile-only -r tsconfig-paths/register  "$1"
