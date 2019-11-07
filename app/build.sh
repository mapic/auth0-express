#!/bin/bash

docker build -t mapic/auth0-express:latest .
docker push mapic/auth0-express:latest