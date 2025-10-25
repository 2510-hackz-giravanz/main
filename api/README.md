# api server
## start
```sh
# init 
uv sync

# run
.venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## routes
- GET /api/questions/generate 
  - 質問生成