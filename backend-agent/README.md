# Enigmy Neutral Agent — Go (Golang) Backend Service

High-performance backend written in Go for the **Enigmy Neutral Engineering & Architecture Agent**.

## Provisional Staging Domain
- **Domain**: `dmgrecords.com.br` (Temporary staging resolution for Enigmy Neutral during global infrastructure rollout).
- **Official Contact**: `enigmyneutral@gmail.com`
- **WhatsApp Business**: `+55 51 98144-6019`
- **Location**: International operations · Paraguay base

---

## NVIDIA NIM Architecture Engine
- **Target Model**: `nvidia/nemotron-3.5-bolt-e4b`
- **API URL**: `https://integrate.api.nvidia.com/v1/chat/completions`
- **Authentication**: `Authorization: Bearer $NVIDIA_API_KEY`
- **Streaming**: Supported (`text/event-stream` / `application/json`)
- **Thinking**: `chat_template_kwargs: { "enable_thinking": True }`

### Python Reference Ingestion Script (requests)
```python
import os
import requests

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
stream = True

headers = {
    "Authorization": f"Bearer {os.getenv('NVIDIA_API_KEY')}",
    "Accept": "text/event-stream" if stream else "application/json",
}

payload = {
    "model": "nvidia/nemotron-3.5-bolt-e4b",
    "messages": [
        {
            "role": "user",
            "content": "Which number is larger, 9.11 or 9.8?"
        }
    ],
    "temperature": 1,
    "top_p": 0.95,
    "max_tokens": 1024,
    "seed": 42,
    "stream": stream,
    "parallel_tool_calls": True,
    "chat_template_kwargs": {
        "enable_thinking": True
    }
}

response = requests.post(invoke_url, headers=headers, json=payload, stream=stream)
if stream:
    for line in response.iter_lines():
        if line:
            print(line.decode("utf-8"))
else:
    print(response.json())
```

---

## Configuration

Set the environment variables in your `.env` or container runtime:

```bash
export PORT=8080
export NVIDIA_API_KEY="nvapi-your-key-here"
export NVIDIA_MODEL="nvidia/nemotron-3.5-bolt-e4b"
export NVIDIA_URL="https://integrate.api.nvidia.com/v1/chat/completions"
export PROVISIONAL_DOMAIN="dmgrecords.com.br"
```

## Running Locally

```bash
cd backend-agent
go run main.go
```

The Go server will start on `http://localhost:8080`.

## Endpoints

- `GET /health`: Health and operational diagnostics.
- `POST /api/agent/audit`: Performs technical diagnostic on repository URLs or uploaded files (ZIP, PDF, images).
- `POST /api/agent/nvidia-chat`: Proxies chat and analysis requests to the NVIDIA NIM API (`nvidia/nemotron-3.5-bolt-e4b`).
