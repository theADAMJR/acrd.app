#!/bin/sh
docker container rm -f accord_database
docker container rm -f accord_backend
docker container rm -f accord_frontend

sudo docker run \
  --name accord_database \
  --hostname accord_database \
  -p 27018:27017 \
  -v accord:/data/db \
  -d accord_database:latest;

sudo docker run \
  --name accord_backend \
  --hostname accord_backend \
  --env-file ./backend/.env \
  -p 3000:3000 \
  -u root \
  -d accord_backend:latest;

sudo docker run \
  --name accord_frontend \
  --hostname accord_frontend \
  --env-file ./frontend/env/.env.dev \
  -p 4200:4200 \
  -u root \
  -d accord_frontend:latest;