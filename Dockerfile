FROM --platform=linux/x86_64 ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive

ENV ARGS=""

RUN apt update \
  && apt install -y sudo curl postgresql \
  && curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash - \
  && sudo apt install -y nodejs

RUN curl -OL https://github.com/LimeChain/matchstick/releases/download/<MATCHSTICK_VERSION>/binary-linux-22 \
  && chmod a+x binary-linux-20

RUN mkdir matchstick
WORKDIR /matchstick

# Commenting out for now as it seems there's no need to copy when using bind mount
# COPY ./ .

CMD ../binary-linux-22 ${ARGS}
