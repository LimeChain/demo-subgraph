FROM --platform=linux/x86_64 ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

ENV ARGS=""

RUN apt update \
  && apt install -y sudo curl postgresql \
  && curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash - \
  && sudo apt install -y nodejs

RUN curl -OL https://github.com/LimeChain/matchstick/releases/download/<MATCHSTICK_VERSION>/binary-linux-20 \
  && chmod a+x binary-linux-20

RUN mkdir matchstick
WORKDIR /matchstick

COPY ../ .

RUN npm run codegen
RUN npm run build

CMD ../binary-linux-20 ${ARGS}
