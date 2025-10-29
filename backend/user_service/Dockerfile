
FROM node:18 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build TypeScript files
# RUN npm run build

# Expose the port on which your application runs
EXPOSE 9000

# Command to run the application in production mode
CMD ["npm", "run", "serve"]