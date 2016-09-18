FROM mhart/alpine-node:6

WORKDIR /src

ADD package.json ./package.json
RUN npm install
ADD . .

ENTRYPOINT ["node", "index.js"]
CMD ["postgresql://localhost"]
