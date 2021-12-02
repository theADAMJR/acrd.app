FROM node:16-alpine3.14
RUN addgroup app && adduser -SG app app

WORKDIR /app
COPY package*.json ./
RUN npm i
# RUN chown -R app:app /app/node_modules/.cache

COPY . .
RUN unlink /app/src/types
COPY --from=accord_types:latest /app /app/src/types

EXPOSE 4200
# USER app
CMD npm run start:dev