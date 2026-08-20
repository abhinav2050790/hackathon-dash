# Deploy to Hugging Face Spaces

## Quick Deploy

1. **Create a new Space** at https://huggingface.co/new-space
   - Owner: your username
   - Space name: `your-space-name`
   - License: MIT (or your choice)
   - SDK: **Docker**
   - Hardware: **T4 GPU** (free) or **A10G** (paid)
   - Visibility: Public

2. **Push your code**:
```bash
cd "C:\Users\shrey\OneDrive\Desktop\hackathon project"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
git push origin main
```

3. **Set Environment Variables** in Space Settings:
   - `BASE_URL` = `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`

4. **Wait for build** (5-10 min first time, downloads ~6GB model)

5. **Access your app** at `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`

## Local Test with Docker

```bash
docker build -t nexus-spec .
docker run -p 7860:7860 -p 8001:8001 -e BASE_URL=http://localhost:7860 nexus-spec
```

Then open http://localhost:7860

## Notes

- **Free tier**: T4 GPU (16GB VRAM) - ZeroScope XL needs ~12GB
- **Cold start**: First request takes ~2-3 min (model load)
- **Sleep**: Free spaces sleep after 1h inactivity
- **Secrets**: Add API keys in Space Settings → Repository secrets