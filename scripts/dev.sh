#!/bin/bash

# Build LibSync Service
# Run Client as Dev Mode
# TODO get hot reloads for the LibSync Service
#

echo ">>> Building Libsync for Dev"

tsc -w &
TSC_PID=$!

nodemon dist/index.js

# npm run serve --prefix ./client/libsync-client