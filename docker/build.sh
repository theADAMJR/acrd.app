#!/bin/sh
sudo docker pull mongo:4.4-bionic
sudo docker tag mongo:4.4-bionic accord_database

(cd types; sudo docker build -t accord_types:latest .)
(cd backend; sudo docker build -t accord_backend:latest .)
(cd frontend; sudo docker build -t accord_frontend:latest .)

sudo docker volume create accord 2>> /dev/null
sudo docker network create accord 2>> /dev/null