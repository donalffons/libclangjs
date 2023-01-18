#!/bin/bash
set -e

npm install -g pnpm
pnpm install
pnpm download-build-cache
pnpm run build
