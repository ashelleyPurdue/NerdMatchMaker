#!/bin/bash
cd ~/Documents/NerdMatchMaker/cs408/SQL
./resetDatabase.sh
mysql -u root -pcz002 cs408 < drop.sql