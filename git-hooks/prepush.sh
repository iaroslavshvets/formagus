#!/bin/bash

PROJECT_DIR=$(pwd)
BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

run_prepush_hook () {
    # compare between staged changes and local HEAD commit
    git diff --exit-code --cached --stat ./$1

    if [ $? -ne 0 ]; then
        cd ./$1
        npm run prepush || exit 1
        cd ${PROJECT_DIR}
    fi
}

# run prepush only if branch exists remotely
if git branch -r | grep -q -e "^\s*origin/$BRANCH$"; then
    run_prepush_hook packages/lib
    run_prepush_hook packages/site
fi
