#!/bin/bash

# Docker run script for Receipt Processor

set -e

# Default mode
MODE="production"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--dev|--development)
      MODE="development"
      shift
      ;;
    -p|--prod|--production)
      MODE="production"
      shift
      ;;
    --proxy)
      MODE="proxy"
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -d, --dev, --development    Run in development mode"
      echo "  -p, --prod, --production    Run in production mode (default)"
      echo "  --proxy                     Run with nginx proxy"
      echo "  -h, --help                  Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "Starting Receipt Processor in ${MODE} mode"

case $MODE in
  "development")
    echo "Starting development server..."
    echo "Application will be available at: http://localhost:5173"
    docker-compose --profile dev up --build receipt-processor-dev
    ;;
  "production")
    echo "Starting production server..."
    echo "Application will be available at: http://localhost:3000"
    docker-compose up --build receipt-processor
    ;;
  "proxy")
    echo "Starting with nginx proxy..."
    echo "Application will be available at: http://localhost"
    docker-compose --profile proxy up --build
    ;;
esac
