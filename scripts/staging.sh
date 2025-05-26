#!/bin/bash

docker context create stagingUFG --docker "host=ssh://ubuntu@34.197.69.197" && \
docker context use stagingUFG && \
docker-compose --context stagingUFG build staging && \
docker-compose --context stagingUFG up -d staging && \
#   #Prune all unused docker assets with -f (skips "are you sure?" prompt)
ssh -o StrictHostKeyChecking=no ubuntu@34.197.69.197 "docker system prune -a -f --volumes" && \
echo "Success!"