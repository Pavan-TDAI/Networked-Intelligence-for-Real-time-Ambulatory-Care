# Separated Frontend / Backend Structure

Use these folders going forward:

- Frontend: `frontend/NIRA-repo`
- Backend: `backend/guna_emr`
- Additional backend utility: `backend/trivitron-digital-ai`

## Frontend → Backend mapping

- Frontend environment key: `VITE_GUNA_EMR_BASE_URL`
- Current value: `http://localhost:3001`
- Backend health check: `http://localhost:3001/health`

## Note about old root folders

Old root duplicate folders were removed after stopping lock-holding processes.

Recommended final workspace root:

- `frontend/`
- `backend/`
- `.git/`, `.gitignore`, env files, and docs
