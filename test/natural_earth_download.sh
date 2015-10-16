#!/usr/bin/env bash
#
# This script downloads Natural Earth's databases if they aren't available on
# the server. This is required for Travis CI.
#
# The MIT License (MIT)
#
# Copyright (c) 2015 jclo
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

URL=$1
DIRECTORY=$2
declare -a DBNAME=($3 $4 $5)

# Check if database dir exists. Otherwise, create it.
if [ ! -d "${DIRECTORY}" ]; then
  echo "${DIRECTORY} does not exist. Creating it ..."
  mkdir ${DIRECTORY}
fi

# Download 'DB' if required.
for DBNAME in "${DBNAME[@]}"
do
  # Check if the 'DB' exists. Otherwise download it.
  if [ ! -d "${DIRECTORY}/${DBNAME}" ]; then
    mkdir ${DIRECTORY}/${DBNAME}
    echo "${DBNAME} does not exist. Downloading it ..."
    curl -L --get ${URL}/${DBNAME}.zip -o ${DIRECTORY}/${DBNAME}/${DBNAME}.zip
    unzip ${DIRECTORY}/${DBNAME}/${DBNAME}.zip -d ${DIRECTORY}/${DBNAME}
    rm ${DIRECTORY}/${DBNAME}/${DBNAME}.zip
  fi
done
exit 0
