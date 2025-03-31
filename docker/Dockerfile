# Dockerfile
FROM node:22.14.0-alpine

WORKDIR /usr/src/app

# copy package.json y package-lock.json
COPY package*.json ./

RUN npm install

# copy rest code
COPY . .

# compile the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
