#!/usr/bin/env sh

# abort on errors
set -e

#clear already exist build dir
if [ -d "./dist/" ]; then
  rm -rf dist
fi
mkdir dist dist/backend

# copy backend

cd dev
cp server.js package.json ../dist
cp -R backend/* ../dist/backend
# don't forget to disable coping DB in prod
cp db.json ../dist

# create backend env

cd ../dist
mkdir images
cd images
mkdir attachments
mkdir avatars

# build and copy frontend

cd ../../dev/frontend

# open this if no node_modules in frontend
# npm install
npm run build
cp -R dist/* ../../dist

# run the server

cd ../../dist
node server
cd ..

cat << msgsss
Deploy success
msgsss