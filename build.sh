#!/bin/bash

rm -rf site
mkdir site
cd ../malpen-bank-fe
npm run build
cp -R build ../malpen-bank-be/site
cd ../malpen-bank-be
docker build -t malpen-bank .
docker tag malpen-bank cr.yandex/crpmonld5i3tc1j9232e/malpen-bank:latest
docker push cr.yandex/crpmonld5i3tc1j9232e/malpen-bank