# LibSync

> This project is currently in a pre-alpha phase and is rapidly changing. A best effort will be made to keep this document up to date however as long as this warning is present no promises can be made on the accuracy of this documentation.

## What is LibSync?

LibSync is a service for keeping one directory in sync with another. SymLinks are very much an option for mirroring a directory however LibSync fully copies the structure of the source directory into the destination, matching sub-directory structures, while only running necessary file operations.

LibSync was born out of my need to move music files from my itunes folder where they are downloaded after purchase, to the directory my Plex server uses as a library source. I wanted to accomplish this without Plex or iTunes knowing of each other at all. This has also been a fun side project to work on, and become a conduit for me to learn about some things I have not had exposure to.

If someone else finds use of LibSync as software or as a project to hack themselves it will be a greater success than I had planned for.

## Installation

Currently the best method of installation is to clone the repo and run `npm install` in the root project directory. A setup/installation script is in the works.

## Running LibSync

> TODO Look to `npm run help` and the scripts in `package.json` for now. However it can be assumed any script prefaced with `dev-` will run using the included `test-data/` directory as its `src`, `dest`, and `backupDir`.

## Roadmap

These are some of the things I want LibSync to be able to do. Multiple Roadmap items may be developed at once and released at the same time.

### Features

```
[ ] - Build Client that interacts with LibSync API

[ ] - Add ability to roll back to a backup

[ ] - Expand Backups to not modify previous backup
```

### Data

```
[ ] - Build API for interacting with data and setting configurations

[ ] - Stream logs to client

[ ] - Add log parsing/searching

[ ] - Snapshot library mappings for later use (?)
```

### DevEx

```
[ ] - Clean up Config, currently confusing and makes little to no sense

[ ] - Get more strict/expand eslint config
```
