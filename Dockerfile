FROM python:2.7.13-alpine3.6

MAINTAINER Louise Yang <louise.yang@scpr.org>

COPY . /lunchbox/
WORKDIR /lunchbox

RUN apk add --update nodejs nodejs-npm alpine-sdk bash
RUN pip install --no-cache-dir virtualenv virtualenvwrapper
RUN echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
RUN /bin/bash -c 'source ~/.bashrc; mkvirtualenv lunchbox'
RUN pip install -r requirements.txt
RUN /bin/bash -c 'npm install'

EXPOSE 80

ENTRYPOINT ["fab", "app"]