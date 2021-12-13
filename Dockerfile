# I'll try to run it on alpine
FROM ubuntu:20.04

# Not sure if this ENV declaration is necessary
ENV ARGS=""

# Install necessary packages
RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN apt install -y git
RUN apt install -y postgresql
RUN apt install -y curl
RUN npm install -g @graphprotocol/graph-cli

# Download the latest linux binary
RUN curl -OL https://github.com/LimeChain/matchstick/releases/download/0.2.2a/binary-linux-20
# Make it executable
RUN chmod a+x binary-linux-20

# Create a matchstick dir where the host will be copied
RUN mkdir matchstick
WORKDIR matchstick

# Copy host to /matchstick
COPY ../ .

RUN graph codegen
RUN graph build

CMD ../binary-linux-20 ${ARGS}
