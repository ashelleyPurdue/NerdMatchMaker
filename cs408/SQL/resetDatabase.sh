#!/bin/bash
cd ~/Documents/NerdMatchMaker/cs408/SQL
mysql -u root -pcz002 cs408 < drop.sql
mysql -u root -pcz002 cs408 < temp.sql