FROM node:16-alpine3.14
RUN addgroup app && adduser -SG app app
RUN mkdir /app && chown app:app /app 
USER app

WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm i
COPY --chown=app:app . .
RUN unlink /app/types
COPY --chown=app:app --from=accord_types:latest /app /app/types

EXPOSE 4200
CMD npm run start:dev