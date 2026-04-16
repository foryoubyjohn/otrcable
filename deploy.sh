#!/usr/bin/env bash
# OTR Cable — HostGator deploy (same pattern as rawls-precision-construction):
#   1) git push origin
#   2) git push hostgator  (+ production remote when configured — mirrors Rawls)
#   3) SSH: git checkout from bare repo into live docroot (GIT_WORK_TREE)
#
# Server layout matches your other sites (see cresiumgroup / rawls remotes):
#   Bare:   /home2/agmsxxte/repos/otrcable.git
#   Live:   /home2/agmsxxte/otrcable.com   (addon docroot — optional once cPanel points here only)
#           /home2/agmsxxte/public_html    (primary domain docroot on this account — otrcable.com often uses this)
#
# One-time server setup (already done if bare repo exists):
#   ssh -p 2222 agmsxxte@50.6.160.176 'git init --bare /home2/agmsxxte/repos/otrcable.git && git -C /home2/agmsxxte/repos/otrcable.git symbolic-ref HEAD refs/heads/main'
#
# Requires: git, ssh (Git Bash / WSL / macOS / Linux). No rsync.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BARE_REPO="/home2/agmsxxte/repos/otrcable.git"
DOCROOT_ADDON="${OTR_DOCROOT:-/home2/agmsxxte/otrcable.com}"
# Primary-domain docroot: without this, https://otrcable.com/ 403s if HostGator still maps the domain here.
DOCROOT_PUBLIC="${OTR_DOCROOT_PUBLIC:-/home2/agmsxxte/public_html}"
# Set OTR_DEPLOY_PUBLIC_HTML=0 to skip syncing public_html (e.g. after cPanel docroot is only ~/otrcable.com).
DEPLOY_PUBLIC_HTML="${OTR_DEPLOY_PUBLIC_HTML:-1}"

if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
  echo "Uncommitted changes. Commit or stash first, then run ./deploy.sh again."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "==> Branch: $BRANCH"

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: no 'origin' remote."
  echo "  git remote add origin git@github.com:foryoubyjohn/otrcable.git"
  exit 1
fi

if ! git remote get-url hostgator >/dev/null 2>&1; then
  echo "Error: no 'hostgator' remote. Add (same style as cresiumgroup / rawls):"
  echo "  git remote add hostgator ssh://agmsxxte@50.6.160.176:2222${BARE_REPO}"
  echo "  git remote add production ssh://agmsxxte@otrcable.com${BARE_REPO}"
  exit 1
fi

echo "==> Pushing to origin (GitHub)"
git push origin "$BRANCH"

echo "==> Pushing to hostgator (bare repo on HostGator)"
git push hostgator "$BRANCH"

if git remote get-url production >/dev/null 2>&1; then
  echo "==> Pushing to production (same bare, alternate SSH host — mirrors Rawls)"
  git push production "$BRANCH"
fi

echo "==> Deploying working tree on server (addon: ${DOCROOT_ADDON})"
ssh -o StrictHostKeyChecking=accept-new agmsxxte@otrcable.com \
  "mkdir -p '${DOCROOT_ADDON}' && cd '${BARE_REPO}' && GIT_WORK_TREE='${DOCROOT_ADDON}' git checkout -f '${BRANCH}'"

if [ "$DEPLOY_PUBLIC_HTML" = "1" ]; then
  echo "==> Deploying working tree on server (primary: ${DOCROOT_PUBLIC})"
  ssh -o StrictHostKeyChecking=accept-new agmsxxte@otrcable.com \
    "mkdir -p '${DOCROOT_PUBLIC}' && cd '${BARE_REPO}' && GIT_WORK_TREE='${DOCROOT_PUBLIC}' git checkout -f '${BRANCH}'"
fi

echo ""
echo "Done. Addon: ${DOCROOT_ADDON}"
if [ "$DEPLOY_PUBLIC_HTML" = "1" ]; then
  echo "     Primary docroot: ${DOCROOT_PUBLIC} (set OTR_DEPLOY_PUBLIC_HTML=0 when otrcable.com no longer uses public_html)"
fi
