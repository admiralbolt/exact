#!/bin/bash

ember build --environment=development

if [ "$(uname)" == "Darwin" ]
then
  cp -r dist/* ~/php-server/
else
  cp -r dist/* /var/www/html/
fi
