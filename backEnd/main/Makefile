# Makefile for Django project code quality

# Run ruff checks
lint:
	ruff check .

# Auto-fix errors
fix:
	 python -m ruff check . --fix


show:
	python -m ruff check . --show-fixes

run:
	python manage.py runserver


#make app

app:
	python manage.py startapp

#make migrations

mg:
	python manage.py makemigrations


#migrate to data base

m:
	python manage.py migrate


