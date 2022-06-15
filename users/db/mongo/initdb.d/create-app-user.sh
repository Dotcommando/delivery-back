#!/usr/bin/env bash
mongo ${MONGO_DATABASE} \
        --host localhost \
        --port 27037 \
        -u ${MONGO_ROOT_USER} \
        -p ${MONGO_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${MONGO_USER}', pwd: '${MONGO_PASSWORD}', roles:[{role:'readWrite', db: '${MONGO_DATABASE}'}]});"
