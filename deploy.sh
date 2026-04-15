#!/usr/bin/env bash
# OTR Cable — push Git, then rsync static site to HostGator.
# Requires: git, rsync, ssh (Git for Windows / WSL / macOS / Linux).
#
# Defaults match HostGator cPanel user agmsxxte. Override if needed:
#   OTR_DEPLOY_HOST=otrcable.com OTR_DEPLOY_PATH=/home2/agmsxxte/public_html ./deploy.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

OTR_DEPLOY_HOST="${OTR_DEPLOY_HOST:-otrcable.com}"
OTR_DEPLOY_USER="${OTR_DEPLOY_USER:-agmsxxte}"
OTR_SSH_PORT="${OTR_SSH_PORT:-2222}"
# Prefer addon docroot so Rawls never shares public_html with this site.
OTR_DEPLOY_PATH="${OTR_DEPLOY_PATH:-/home2/agmsxxte/otrcable.com}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync not found. Install Git for Windows (includes rsync) or use WSL."
  exit 1
fi

if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
  echo "Uncommitted changes. Commit or stash first, then run ./deploy.sh again."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "==> Pushing branch: $BRANCH"

if git remote get-url origin >/dev/null 2>&1; then
  git push origin "$BRANCH"
else
  echo "Error: no 'origin' remote. Add: git remote add origin git@github.com:foryoubyjohn/otrcable.git"
  exit 1
fi

if git remote | grep -qx 'hostgator'; then
  echo "==> Pushing to hostgator remote"
  git push hostgator "$BRANCH"
fi

RSYNC_RSH="ssh -p ${OTR_SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

echo "==> rsync → ${OTR_DEPLOY_USER}@${OTR_DEPLOY_HOST}:${OTR_DEPLOY_PATH}/"
rsync -avz --delete \
  --exclude '.git' \
  --exclude '.env' \
  --exclude '.env.production' \
  --exclude '.cursor' \
  --exclude 'docs' \
  --exclude 'tools' \
  -e "$RSYNC_RSH" \
  ./ "${OTR_DEPLOY_USER}@${OTR_DEPLOY_HOST}:${OTR_DEPLOY_PATH}/"

echo ""
echo "Done. If https://otrcable.com/ still looks wrong, set HostGator document root to:"
echo "  ${OTR_DEPLOY_PATH}"
