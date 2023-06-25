FROM node:19.4.0-alpine

WORKDIR /app/frontend
COPY ./package.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] ; \
        then npm i ; \
        else npm i --omit=dev; \
        fi


COPY . .

RUN npm run build;
EXPOSE 8000
CMD ["npm","start"]