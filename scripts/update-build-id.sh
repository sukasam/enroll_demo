#!/bin/bash
set -e

# Generate build ID (timestamp in milliseconds)
BUILD_ID=$(date +%s)000

# Update .env file with new build ID
if [ -f .env ]; then
    # Remove existing BUILD_ID if present
    sed -i '/NEXT_PUBLIC_BUILD_ID=/d' .env
    # Add new BUILD_ID
    echo "NEXT_PUBLIC_BUILD_ID=$BUILD_ID" >> .env
else
    echo "NEXT_PUBLIC_BUILD_ID=$BUILD_ID" > .env
fi

echo "Updated BUILD_ID to $BUILD_ID" 