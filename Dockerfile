FROM node:13
WORKDIR /Discord-Bot-TS
COPY . /Discord-Bot-TS
RUN npm install -g typescript
RUN npm install
RUN tsc
CMD [ "node", "./build/app.js" ]