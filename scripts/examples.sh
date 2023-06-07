#!/bin/bash

# Exit on any error (except unbound variables)
set -eo pipefail

if [ -z "$1" ]; then
    ./scripts/examples.sh playwright-style
    ./scripts/examples.sh cjs-ts
    ./scripts/examples.sh esm-ts
    ./scripts/examples.sh cjs
    ./scripts/examples.sh esm
    exit
fi

pushd examples/$1
npx playwright test
popd