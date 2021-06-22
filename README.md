# LibSync

> This project is currently in a pre-alpha phase and is rapidly changing. A best effort will be made to keep this document up to date however as long as this warning is present no promises can be made on the accuracy of this documentation.

## What is LibSync?

LibSync is a service for keeping one directory in sync with another. SymLinks are very much an option for mirroring a directory however LibSync fully copies the structure of the source directory into the destination, matching sub-directory structures, while only running necessary file operations.

LibSync was born out of my need to move music files from my itunes folder where they are downloaded after purchase, to the directory my Plex server uses as a library source. I wanted to accomplish this without Plex or iTunes knowing of each other at all. This has also been a fun side project to work on.

## Installation

Currently the best method of installation is to clone the repo and run `npm install` in both the root project directory as well as `libsync/client/libsync-client` as the client is a separate project. A setup/installation script is in the works.

## Running LibSync

> TODO Look to `npm run help` for now
