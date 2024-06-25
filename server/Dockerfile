FROM node:lts-slim
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
EXPOSE 1832
CMD npm start