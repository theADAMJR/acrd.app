#!/bin/sh
docker container rm -f $(docker ps -aq) 2> /dev/null
docker image rm -f $(docker image ls -q) 2> /dev/null
docker volume rm -f $(docker volume ls -q) 2> /dev/null
docker network rm $(docker network ls -q) 2> /dev/null