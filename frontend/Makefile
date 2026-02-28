.PHONY: lint fix check run

# Run command
run:
	@echo "Starting dev server..."
	npm run dev

# Linting commands
lint:
	@echo "Running Ruff linter..."
	ruff check .
	@echo "Running ESLint..."
	npm run lint

# Formatting and fixing commands
fix:
	@echo "Running Ruff formatter and auto-fix..."
	ruff format .
	ruff check --fix .
	@echo "Running ESLint auto-fix..."
	npm run lint -- --fix

i:
	@echo "install react"
	npm install
