#!/bin/bash

ember build --environment=development

cp -r dist/* /var/www/html/
