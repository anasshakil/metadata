#!/bin/sh

# Author : Ahmed Anas Shakil
cd "$(dirname "$0")"
# cd "${0%/*}"
cd ../../../
mkdir -p .exiftool
cd .exiftool/
wget -q -O - https://liquidtelecom.dl.sourceforge.net/project/exiftool/Image-ExifTool-12.57.tar.gz | tar -zx --exclude='html' --strip-components=1