#!/bin/bash

# this will not work in powershell (as far as I can tell)

echo "starting"

# make sure you have one called armbuilder!
docker buildx use armbuilder

docker buildx build --platform linux/arm64 --push -f Dockerfile -t thomasmcnamara7/productivity-tool-backend:manual .

