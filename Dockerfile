# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies                                                  
RUN npm install

# Copy all source code
COPY . .

# Build the project
RUN npm run build

# Expose the app port (adjust if needed)
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
