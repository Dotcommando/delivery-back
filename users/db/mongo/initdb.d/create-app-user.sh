#!/usr/bin/env bash
mongo ${USERS_DB_DATABASE} \
        --host localhost \
        --port 27037 \
        -u ${USERS_DB_ROOT_USER} \
        -p ${USERS_DB_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${USERS_DB_USER}', pwd: '${USERS_DB_PASSWORD}', roles:[{role:'readWrite', db: '${USERS_DB_DATABASE}'}]});"
