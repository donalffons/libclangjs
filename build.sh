#!/bin/bash

npm install -g pnpm
pnpm install
pnpm download-build-cache
pnpm run build
