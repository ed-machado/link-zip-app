FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn add lucide-react
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
