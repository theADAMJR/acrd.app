#!/bin/sh
cd /app/backend && npm run start:prod &
cd /app/frontend && npm run start:prod

fg %1