FROM node:16-alpine3.14
RUN addgroup app && adduser -SG app app
RUN mkdir /app && chown app:app /app
USER app

# WORKDIR /app/frontend
# COPY --chown=app:app ./frontend/package*.json ./
# RUN ln -s ./frontend/src/types /app
# RUN npm i

WORKDIR /app
COPY --chown=app:app . .

# WORKDIR /app/backend
# COPY --chown=app:app ./backend/package*.json ./
# RUN npm i

EXPOSE 3000
EXPOSE 4200
CMD ./bin/start-dev.sh