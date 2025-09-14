.PHONY: help api web compose setup clean install dev

# Default target
help:
	@echo "TODO List with Real-Time Sync - Development Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make setup     - Install all dependencies"
	@echo "  make api       - Run the ASP.NET Core API (development)"
	@echo "  make web       - Run the React frontend (development)"
	@echo "  make dev       - Run both API and frontend in parallel"
	@echo "  make compose   - Run the entire stack with Docker Compose"
	@echo "  make build     - Build Docker containers"
	@echo "  make clean     - Clean up Docker containers and volumes"
	@echo "  make install   - Install dependencies for both frontend and backend"

# Setup development environment
setup: install
	@echo "Development environment setup complete!"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd server/Todo.Api && dotnet restore
	@echo "Installing frontend dependencies..."
	cd web/client && npm install
	@echo "Dependencies installed!"

# Run API in development mode
api:
	@echo "Starting ASP.NET Core API..."
	cd server/Todo.Api && dotnet run

# Run frontend in development mode
web:
	@echo "Starting React frontend..."
	cd web/client && npm run dev

# Run both API and frontend in parallel (requires GNU parallel or similar)
dev:
	@echo "Starting development servers..."
	@echo "API will be available at http://localhost:5000"
	@echo "Frontend will be available at http://localhost:5173"
	@echo "GraphQL Playground available at http://localhost:5000/graphql"
	@(trap 'kill 0' SIGINT; \
	 cd server/Todo.Api && dotnet run & \
	 cd web/client && npm run dev & \
	 wait)

# Run with Docker Compose
compose:
	@echo "Starting services with Docker Compose..."
	cd docker && docker-compose up --build

# Build Docker containers
build:
	@echo "Building Docker containers..."
	cd docker && docker-compose build

# Clean up Docker resources
clean:
	@echo "Cleaning up Docker containers and volumes..."
	cd docker && docker-compose down -v
	docker system prune -f

# Database migrations (for development)
migrate:
	@echo "Running database migrations..."
	cd server/Todo.Api && dotnet ef database update

# Generate Relay artifacts
relay:
	@echo "Generating Relay artifacts..."
	cd web/client && npm run relay

# Test the API
test-api:
	@echo "Testing API..."
	cd server/Todo.Api && dotnet test

# Test the frontend
test-web:
	@echo "Testing frontend..."
	cd web/client && npm test

# Lint the code
lint:
	@echo "Linting frontend code..."
	cd web/client && npm run lint

# Production build
build-prod:
	@echo "Building for production..."
	cd web/client && npm run build
	cd server/Todo.Api && dotnet publish -c Release

# Show logs from Docker Compose services
logs:
	cd docker && docker-compose logs -f

# Stop Docker Compose services
stop:
	cd docker && docker-compose stop

# Restart Docker Compose services
restart:
	cd docker && docker-compose restart
