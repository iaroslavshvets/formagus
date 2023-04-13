#!/bin/bash

PROJECT_DIR=$(pwd)

run_precommit_hook () {
    # compare between staged changes and local HEAD commit
    git diff --exit-code --cached --stat ./$1

    if [ $? -ne 0 ]; then
        cd ./$1
        npm run precommit || exit 1
        cd ${PROJECT_DIR}
    fi
}

run_precommit_hook packages/lib
run_precommit_hook packages/docs
