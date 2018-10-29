#!/bin/bash

PROJECT_DIR=$(pwd)

run_postcommit_hook () {
    # compare between staged changes and local HEAD commit
    git diff --exit-code --cached --stat ./$1

    if [ $? -ne 0 ]; then
        cd ./$1
        npm run postcommit
        cd ${PROJECT_DIR}
    fi
}

run_postcommit_hook packages/lib
run_postcommit_hook packages/site
