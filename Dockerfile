FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY main.py .

# Copy and build frontend
COPY product-ui ./product-ui
WORKDIR /app/product-ui
RUN npm ci && npm run build

# Go back to app root
WORKDIR /app

# Expose port (HF Spaces uses 7860)
EXPOSE 7860

# Start both services - backend on 8001, frontend on 7860
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8001 & cd product-ui && node .next/standalone/server.js"]