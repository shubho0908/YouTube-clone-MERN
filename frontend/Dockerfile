FROM node

WORKDIR /app/frontend

COPY . /app/frontend/

RUN npm install && npm run build

EXPOSE 4000

CMD [ "npm", "run", "preview" ]