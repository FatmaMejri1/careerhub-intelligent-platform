.PHONY: help install test run docker-build docker-up docker-down docker-logs clean

help:
	@echo "Available commands:"
	@echo "  install     Install dependencies"
	@echo "  test        Run tests"
	@echo "  run         Run development server"
	@echo "  docker-build Build Docker image"
	@echo "  docker-up   Start services with Docker"
	@echo "  docker-down Stop services"
	@echo "  docker-logs View logs"
	@echo "  clean       Clean up"

install:
	pip install -r requirements.txt

test:
	pytest tests/ -v

run:
	python -m app.main

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f ai-service

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete