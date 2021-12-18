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

ENV PORT $PORT
ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_CDN_URL $REACT_APP_CDN_URL
ENV REACT_APP_REPO $REACT_APP_REPO
ENV REACT_APP_ROOT_API_URL $REACT_APP_ROOT_API_URL

ARG REACT_APP_API_URL $REACT_APP_API_URL

EXPOSE 4200
CMD npm run start:dev