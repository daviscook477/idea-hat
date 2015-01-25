#!/bin/bash
echo "Compiling classes"
javac *.java
echo "Building jar"
jar cvfm test.jar manifest.txt *.class
echo "Done"
echo "Press any key to exit"
read -n 1 -s