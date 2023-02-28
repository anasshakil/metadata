#!/bin/sh

# Author : Ahmed Anas Shakil
cd ../
mkdir .exiftool
cd .exiftool/
wget -c https://liquidtelecom.dl.sourceforge.net/project/exiftool/Image-ExifTool-12.57.tar.gz -O - | tar -xz --strip-components=1