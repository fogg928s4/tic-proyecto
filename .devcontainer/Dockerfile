FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

# Set working directory inside the container
WORKDIR /workspace

# Copy package files first to leverage docker layer caching
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose app port
EXPOSE 3000

# Default command for devcontainer in practice is set by VSCode, but keep fallback
CMD ["npm", "start"]
