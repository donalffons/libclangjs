#!/bin/bash

npm install -g pnpm
pnpm install
echo $?
pnpm download-build-cache
echo $?
pnpm run build
echo $?
