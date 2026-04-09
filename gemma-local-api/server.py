from fastapi import FastAPI
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/v1/chat/completions")
async def chat_completions(request: dict):
    user_message = request["messages"][-1]["content"]

    response = requests.post(OLLAMA_URL, json={
        "model": "gemma:2b",
        "prompt": user_message,
        "stream": False
    })

    output = response.json()["response"]

    return {
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": output
                }
            }
        ]
    }