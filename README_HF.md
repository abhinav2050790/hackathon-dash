# Industrial AI Backend - Hugging Face Space

FastAPI backend for industrial document processing, chat, and CAD video generation.

## Features
- **Document Processing**: Extract structured specs from PDF datasheets using Gemini
- **Chat**: Q&A over document content
- **Video Generation**: Generate 3D CAD blueprint videos using ZeroScope v2 XL

## API Endpoints
- `GET /health` - Health check
- `POST /process-document` - Upload PDF, get structured product data
- `POST /chat` - Ask questions about document
- `POST /generate-visual-prompt` - Generate CAD video from specs
- `GET /video` - Serve generated video

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `BASE_URL` | No | Public URL of this Space (e.g., `https://username-space-name.hf.space`) |
| `PORT` | No | Port (default 7860) |

## Deployment on Hugging Face Spaces

1. Create new Space: https://huggingface.co/new-space
2. Select **Docker** as SDK
3. Set hardware to **CPU Upgrade** (or **T4 GPU** for faster video gen)
4. Add secrets in Settings → Repository secrets:
   - `GEMINI_API_KEY` - Your Google AI Studio API key
   - `BASE_URL` - Your Space URL (e.g., `https://your-name-your-space.hf.space`)
5. Push this repo to the Space

## Local Development
```bash
docker build -f Dockerfile.hf -t industrial-ai .
docker run -p 7860:7860 -e GEMINI_API_KEY=your_key -e BASE_URL=http://localhost:7860 industrial-ai
```

## Notes
- Video generation runs on CPU (~2-5 min per video)
- For faster generation, upgrade to T4 GPU in Space settings
- Model downloads on first request (~6GB), cached after