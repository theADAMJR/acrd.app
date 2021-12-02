FROM node:16-alpine3.14
RUN addgroup app && adduser -SG app app

WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm i
COPY --chown=app:app --from=accord_types:latest /app /app/src/types
COPY . .

EXPOSE 3000
# USER app
CMD npm run start:dev