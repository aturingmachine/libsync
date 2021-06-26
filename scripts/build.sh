#!/bin/bash

echo ">>> Building LibSync..."

echo ">>> Compiling LibSync Service..."
npm run build --prefix ./core
echo ">>> Service Compilation Complete"

echo ">>> Compiling LibSync Client..."
npm run build --prefix ./client
echo ">>> Compiling LibSync Client..."

echo ">>> LibSync Compiled."