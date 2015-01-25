#!/bin/bash
#delete the temp.txt if it exists
rm temp.txt
echo "Searching for *.js files to include"
#find all .js files within those directories and write to temp.txt
find src/www/modules/ -name *.js >> temp.txt
src/www/app.js >> temp.txt
find test/ -name *.js >> temp.txt
#read in all the files from the temp file
while read -r line
do
	file=$line
	echo "Found - $file"
done < temp.txt
#read in properties
. $configFile
echo "Generating HTML file"
java -jar auto-detect-scripts/test.jar auto-detect-scripts/template.html temp.txt test-index.html INSERT
#remove the temp file
rm temp.txt
echo "Running the tests"
xdg-open test-index.html
echo "Press any key to exit"
read -n 1 -s