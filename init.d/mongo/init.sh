#！/bin/bash
#变量定义  
dbname="eas"
host="127.0.0.1"
port="27017"

mongo $host:$port/$dbname --quiet ./initAuth.js