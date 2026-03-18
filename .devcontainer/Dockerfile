FROM mcr.microsoft.com/devcontainers/typescript-node:22-bookworm
# Set working directory inside the container
WORKDIR /workspace

# Copy package files first to leverage docker layer caching
COPY package.json package-lock.json* ./

# Install project dependencies
RUN apt update && apt upgrade -y
RUN apt install lolcow
RUN nvm install node
RUN npm i -g npm@latest

# Copy the rest of the application code
COPY . .

# Expose app port
EXPOSE 3000

# Default command for devcontainer in practice is set by VSCode, but keep fallback
# CMD ["npm", "start"]
