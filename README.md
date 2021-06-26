# LibSync

> This project is currently in a pre-alpha phase and is rapidly changing. A best effort will be made to keep this document up to date however as long as this warning is present no promises can be made on the accuracy of this documentation.

## What is LibSync?

LibSync is a service for keeping one directory in sync with another. SymLinks are very much an option for mirroring a directory however LibSync fully copies the structure of the source directory into the destination, matching sub-directory structures, while only running necessary file operations.

LibSync was born out of my need to move music files from my itunes folder where they are downloaded after purchase, to the directory my Plex server uses as a library source. I wanted to accomplish this without Plex or iTunes knowing of each other at all. This has also been a fun side project to work on, and become a conduit for me to learn about some things I have not had exposure to.

If someone else finds use of LibSync as software or as a project to hack themselves it will be a greater success than I had planned for.

## Installation

Run 
```bash
npm run setup
```

> This will run `npm ci` in the child project directories and do any needed configuration.

## Running LibSync

Running LibSync is easiest done from the root project directory. 

To start both the Service and Client
```bash
npm run dev
```

To start the service by itself
```bash
npm run dev:service
```

To start the client by itself (not very useful unless you do not need data from the service)
```bash
npm run dev:client
```

## Building LibSync

From the root project directory:

To buidl both the Service and Client
```bash
npm run build
```

To build the service by itself
```bash
npm run build:service
```

To build the client by itself (not very useful unless you do not need data from the service)
```bash
npm run build:client
```

## [Roadmap](https://github.com/aturingmachine/libsync/projects/1)

