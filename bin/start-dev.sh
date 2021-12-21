#!/bin/sh
cd /app/backend && npm run start:dev &
cd /app/frontend && npm run start:dev

fg %1