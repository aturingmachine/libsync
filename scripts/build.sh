#!/bin/bash

echo ">>> Building LibSync..."

BUILD_CLIENT=0

while [ -n "$1" ]; do # while loop starts

	case "$1" in

	-b) BUILD_CLIENT=1; echo ">>> Will Build Client" ;; # Message for -a option

	esac

	shift

done

echo ">>> Compiling..."

npm run compile

echo ">>> Compilation Complete"

if [ $BUILD_CLIENT == 1 ]
then
 echo ">>> Moving Client"
 mkdir ./dist/lib/client
 cp ./lib/client/index.html ./dist/lib/client/index.html
fi

