#!/bin/sh
# Vercel skips on 0; build on differences or unavailable Git history.
if git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- . \
  ':(exclude).agents/**' \
  ':(exclude).github/**' \
  ':(exclude).vscode/**' \
  ':(exclude)docs/**' \
  ':(exclude)plans/**' \
  ':(exclude)tests/**' \
  ':(exclude)tools/**' \
  ':(exclude)AGENTS.md' \
  ':(exclude)CONTEXT.md' \
  ':(exclude)README.md' \
  ':(exclude)design-qa.md' \
  ':(exclude)pnpm-migration-plan.md' \
  ':(exclude)doctor.config.jsonc' \
  ':(exclude)playwright.app.config.ts' \
  ':(exclude)playwright.config.ts' \
  ':(exclude).oxlintrc.json' \
  ':(exclude).prettierignore' \
  ':(exclude).prettierrc'; then
  exit 0
fi
exit 1
