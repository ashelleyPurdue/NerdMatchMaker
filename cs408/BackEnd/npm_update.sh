#!/bin/bash
echo "Updating npm packages.  Please wait..."

npm install -g typescript
npm install @types/node --save-dev
npm install express
npm link body-parser
npm install mysql
npm install request
npm install socket.io
npm install hashtable
npm install socket.io-client
echo "NPM packages updated."
