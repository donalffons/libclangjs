#!/bin/bash
set -e

npm install -g pnpm
pnpm install
echo $?
pnpm download-build-cache
echo $?
pnpm run build
echo $?
