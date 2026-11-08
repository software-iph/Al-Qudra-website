#!/bin/sh
# Update the Alqudra site on the VPS from GitHub:  sh /opt/alqudra/update.sh
#   1. git pull the latest code into /opt/alqudra/src
#   2. build a new image on the VPS
#   3. restart only alqudra-web (database and uploads are kept)
# If the build fails, the running site is left untouched.
set -eu

ROOT=/opt/alqudra
cd "$ROOT/src"

echo "==> Pulling the latest code"
git pull --ff-only
git log -1 --format="    %h %s (%cr)"

compose() { docker compose --project-directory "$ROOT" -f "$ROOT/src/deploy/docker-compose.yml" "$@"; }

echo "==> Building the site (a few minutes)"
compose build alqudra-web

echo "==> Restarting alqudra-web"
compose up -d alqudra-web

# Remove old Alqudra images only (never other sites' images).
docker image prune -f --filter label=project=alqudra >/dev/null

echo "==> Waiting for the site to answer"
for i in $(seq 1 30); do
  if docker exec alqudra-web wget -qO- http://127.0.0.1:3000/en >/dev/null 2>&1; then
    echo "    Done - the site is running the new version."
    exit 0
  fi
  sleep 2
done
echo "    The site did not answer in time - check: docker logs --tail 50 alqudra-web" >&2
exit 1
