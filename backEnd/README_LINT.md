# Backend lint setup (Ruff)

This project uses Ruff for backend linting.

## What was fixed

- Moved deprecated Ruff keys in `pyproject.toml`:
  - `tool.ruff.select` -> `tool.ruff.lint.select`
  - `tool.ruff.ignore` -> `tool.ruff.lint.ignore`
- Added per-file ignore for migration line length (`E501`) in generated migration files only.
- Fixed tab indentation in `main/config/urls.py` (`W191`).
- Fixed API URL formatting in `main/api/v1/urls.py` (`E225`, `E122`, `E231`).
- Reduced complexity of `resolve_hospital` in `main/apps/UserAuth/views.py` to satisfy `C901` by extracting helper functions.
- Fixed app-list comment style in `main/config/settings.py` (`E122`, `E265`).
- Removed `Country.Meta.app_label` in `main/apps/UserAuth/models/location.py` to avoid duplicate model registration from mixed import paths.
- Standardized imports to canonical app path (`apps.UserAuth...`) in `main/verify_setup.py` and `main/test_auth_model.py`.
- Removed `main/__init__.py` so test discovery no longer builds `backEnd.main...` module names.

## Why migrations ignore `E501`

Django migration files are generated code. Reformatting long generated lines is unnecessary and can create noisy diffs.
So only migration files ignore `E501`; normal app code still follows line length rules.

## Commands

Run from `backEnd/main`:

```powershell
..\.venv\Scripts\python.exe -m ruff check . --fix
```

Check only (no autofix):

```powershell
..\.venv\Scripts\python.exe -m ruff check .
```

Check only updated files with Flake8:

```powershell
..\.venv\Scripts\python.exe -m flake8 api\v1\urls.py apps\UserAuth\views.py config\settings.py
```

Run Django checks:

```powershell
..\.venv\Scripts\python.exe manage.py check
```

## Current status

- Ruff: `All checks passed!`
- Django check: `System check identified no issues (0 silenced).`
- Django tests: project starts test discovery without conflicting model import errors.

