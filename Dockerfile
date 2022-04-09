FROM ubuntu:20.04

ARG BUILDPLATFORM=linux/x86_64
ARG DEBIAN_FRONTEND=noninteractive

ENV ARGS=""

RUN apt update \
  && apt install -y sudo curl postgresql \
  && curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash - \
  && sudo apt install -y nodejs

# <MATCHSTICK_VERSION> is just a placeholder
RUN curl -OL https://github.com/LimeChain/matchstick/releases/download/<MATCHSTICK_VERSION>/binary-linux-20 \
  && chmod a+x binary-linux-20

RUN mkdir matchstick
WORKDIR /matchstick

COPY ../ .

RUN npm run codegen
RUN npm run build

CMD ../binary-linux-20 ${ARGS}
