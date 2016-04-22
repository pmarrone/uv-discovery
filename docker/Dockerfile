FROM ubuntu:trusty
EXPOSE 3000

RUN apt-get update
RUN apt-get install -yq \
      curl

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN DEBIAN_FRONTEND=noninteractive sudo apt-get install -yq nodejs

#Install tools for ruby
RUN apt-get install -y \
    inotify-tools \
    rubygems-integration

RUN apt-get install -y \
    git

RUN gem install sass -v 3.3.14
RUN npm install -g \
    bower \
    yo \
    gulp \
    grunt

RUN apt-get install -y \
    build-essential \
    python

RUN npm install -g node-gyp
RUN npm install -g node-inspector

RUN mkdir /app/
WORKDIR /app/


EXPOSE 5858
EXPOSE 8080

RUN npm install -g mocha

CMD [ "node" ]
