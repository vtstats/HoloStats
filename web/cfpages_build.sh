set -e

export PATH="$PATH:$(yarn global bin)"

rm -rf dist/

yarn ng run holostats:server:production
yarn ng run holostats:build:production --stats-json=false

node postbuild.mjs
