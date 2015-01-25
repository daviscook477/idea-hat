#!/bin/bash
cd src
echo "Uploading to ionic"
ionic upload
echo "Deploying to firebase"
cd www
firebase deploy
echo "Press any key to exit"
read -n 1 -s