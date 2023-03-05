#!/bin/bash
set -e

export HUSKY=0

npm install -g pnpm
pnpm install --frozen-lockfile
pnpm download-build-cache
pnpm run build
pnpm run test
pnpm upload-build-cache
