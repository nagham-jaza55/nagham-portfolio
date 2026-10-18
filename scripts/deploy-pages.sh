#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
repository_url="https://github.com/nagham-jaza55/nagham-portfolio.git"
source_directory="$PWD"
source_commit="$(git rev-parse --short HEAD)"
author_name="$(git config user.name)"
author_email="$(git config user.email)"

npm run build:pages
touch out/.nojekyll

# A temporary checkout contains only generated public assets, never source secrets.
deploy_directory="$(mktemp -d /tmp/nagham-pages.XXXXXX)"
trap 'rm -rf "$deploy_directory"' EXIT
git -C "$deploy_directory" init -b gh-pages
git -C "$deploy_directory" config user.name "$author_name"
git -C "$deploy_directory" config user.email "$author_email"
git -C "$deploy_directory" remote add origin "$repository_url"
if [[ -n "$(git ls-remote "$repository_url" refs/heads/gh-pages)" ]]; then
  git -C "$deploy_directory" fetch --depth=1 origin gh-pages
  git -C "$deploy_directory" reset --hard FETCH_HEAD
  git -C "$deploy_directory" rm -r --ignore-unmatch .
fi
cp -a "$source_directory/out/." "$deploy_directory/"
git -C "$deploy_directory" add .
if git -C "$deploy_directory" diff --cached --quiet; then
  echo "Published assets are already current."
  exit 0
fi
git -C "$deploy_directory" commit -m "Deploy portfolio from $source_commit"
git -C "$deploy_directory" push origin HEAD:gh-pages
