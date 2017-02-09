#!/bin/bash
echo "Building typscript files"
tsc typescript_src/* -outDir .
echo "build complete"