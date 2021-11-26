FROM ubuntu:20.04
ENV ARGS=""
RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
COPY ./ ./
RUN npm run codegen
RUN npm run build
RUN apt install -y postgresql
RUN apt install -y curl
RUN curl -OL https://github.com/LimeChain/matchstick/releases/download/0.2.0/binary-linux-20
RUN mv binary-linux-20 matchstick
RUN chmod a+x matchstick
CMD ./matchstick ${ARGS}