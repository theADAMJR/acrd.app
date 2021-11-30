FROM node:16-alpine3.14
RUN addgroup app && adduser -SG app app

WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm i
COPY . .
RUN unlink /app/src/types
COPY --chown=app:app --from=accord_types:latest /app /app/src/types

EXPOSE 4200
USER app
CMD npm run start:dev