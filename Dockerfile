FROM node:14-slim

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000
#RUN npm 
RUN npm install
CMD ["nodejs", "chords-bot.js"]
