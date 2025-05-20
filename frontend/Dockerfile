# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY frontend/package*.json ./

# Clean install (safer in CI)
RUN npm ci

# Copy the rest of the app
COPY . .

# Build your app (optional — if you want production)
# RUN npm run build

# Use "preview" for production, or "dev" for development
CMD ["npm", "run", "dev"]
