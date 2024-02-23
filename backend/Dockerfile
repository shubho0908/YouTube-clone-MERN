FROM node

WORKDIR /app/backend

COPY . /app/backend/

RUN npm install

ENV DB_user=value
ENV DB_password=value
ENV DB_name=value
ENV SECRET_KEY=value
ENV EMAIL=value
ENV PASSWORD=value

CMD ["node", "server.js"]
