#!/usr/bin/env bash
mongo ${VENDORS_DB_DATABASE} \
        --host localhost \
        --port 27038 \
        -u ${VENDORS_DB_ROOT_USER} \
        -p ${VENDORS_DB_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${VENDORS_DB_USER}', pwd: '${VENDORS_DB_PASSWORD}', roles:[{role:'readWrite', db: '${VENDORS_DB_DATABASE}'}]});"
