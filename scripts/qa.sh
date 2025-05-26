#!/bin/bash
set -e

_IFS=$IFS
IFS=''
echo "Started QA deployment!"

SERVER_NAME=$1
QA_Enroll_DEV=44.205.177.60
STG_Enroll_DEV=52.200.122.88

if [ "$SERVER_NAME" = "stg" ]; then
    IPV4=$STG_Enroll_DEV
else
    IPV4=$QA_Enroll_DEV
fi

# Build the .env File using travis environment variables
if [ "$NEXT_PUBLIC_APP_ENV" != "localhost" ]; then
    ./scripts/createENV.sh
elif [ ! -f .env ] && [ -f .env.local ]; then
    cp .env.local .env
fi

# Verify .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file was not created"
    exit 1
fi

# Update build ID for cache busting
echo "Updating build ID..."
chmod +x ./scripts/update-build-id.sh
if ! ./scripts/update-build-id.sh; then
    echo "Error: Failed to update build ID"
    exit 1
fi

# Verify BUILD_ID was added
if ! grep -q "NEXT_PUBLIC_BUILD_ID=" .env; then
    echo "Error: BUILD_ID was not added to .env file"
    exit 1
fi

echo "Environment setup completed successfully"

echo "--- Start Building Docker!"

docker-compose build enroll
echo "--- Docker Build Complete!"

mkdir -p ./dockerimage
docker save -o ./dockerimage/enroll.tar.gz enroll:latest
echo "--- Docker Image Saved!"

docker context create qaEnroll --docker "host=ssh://ubuntu@$IPV4" || docker context update qaEnroll --docker "host=ssh://ubuntu@$IPV4"
echo "--- Docker Context Created or Updated!"

docker context use qaEnroll
echo "--- Docker Context Used!"

docker load -i ./dockerimage/enroll.tar.gz
echo "--- Docker Image Loaded!"

docker-compose down --remove-orphans
echo "--- Docker Compose Stopped!"

docker-compose --context qaEnroll up -d enroll
echo "--- Docker Compose Started!"

docker system prune -f
echo "Success!"

IFS=$_IFS