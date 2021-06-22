#!bin/bash 

echo "Resetting..."

rm -rfv ./test-data/test-nest-dest/test-dest-folder/
rm -rf ./test-data/test-backup/*

mkdir ./test-data/test-nest-dest/test-dest-folder
mkdir ./test-data/test-nest-dest/test-dest-folder/artist1
mkdir ./test-data/test-nest-dest/test-dest-folder/artist1/album1
mkdir ./test-data/test-nest-dest/test-dest-folder/artist2
mkdir ./test-data/test-nest-dest/test-dest-folder/artist2/album1

touch ./test-data/test-nest-dest/test-dest-folder/artist1/album1/a1al1t1.txt
touch ./test-data/test-nest-dest/test-dest-folder/artist1/album1/a1al1t2.txt
touch ./test-data/test-nest-dest/test-dest-folder/artist2/album1/a2al1t1.txt