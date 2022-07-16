#!/bin/sh

node node_modules/typeorm/cli.js migration:run -d dist/data-source-prod.js
node dist/main.js