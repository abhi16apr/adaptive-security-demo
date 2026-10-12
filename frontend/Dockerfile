FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV REACT_APP_API_URL=http://localhost:5000/api

# Run the app
CMD ["npm", "start"]
