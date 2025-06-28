#!/bin/bash

# Docker build script for Receipt Processor

set -e

echo "Building Receipt Processor Docker Images"

# Build production image
echo "Building production image..."
docker build -t receipt-processor:latest -t receipt-processor:prod .

# Build development image
echo "Building development image..."
docker build -f Dockerfile.dev -t receipt-processor:dev .

echo "Docker images built successfully!"

# Show built images
echo "Built images:"
docker images | grep receipt-processor

echo "Ready to run with:"
echo "  Production: docker-compose up receipt-processor"
echo "  Development: docker-compose --profile dev up receipt-processor-dev"
echo "  With proxy: docker-compose --profile proxy up"
