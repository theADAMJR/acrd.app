docker container rm -f accord_database
docker container rm -f accord_backend
docker container rm -f accord_frontend

docker image rm -f accord_database
docker image rm -f accord_types
docker image rm -f accord_backend
docker image rm -f accord_frontend