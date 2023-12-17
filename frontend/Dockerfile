FROM node:14-alpine
WORKDIR /usr/src/app
COPY cybsec-frontend/package*.json ./
RUN npm install
COPY cybsec-frontend .
RUN npm run build
CMD ["npm", "start"]
