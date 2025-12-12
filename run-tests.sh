#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Running frontend tests in ${ROOT_DIR}"
cd "${ROOT_DIR}"

echo "Installing node dependencies (if needed)"
npm ci --silent || npm install --silent

echo "Running Vitest..."
npx vitest run --reporter verbose

echo "Frontend tests completed."
