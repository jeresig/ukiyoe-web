FROM dockerfile/nodejs
ADD . /app
WORKDIR /app
RUN npm install
