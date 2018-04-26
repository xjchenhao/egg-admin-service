#!/bin/bash  
#变量定义  
sqlname="basis.sql"
host="127.0.0.1"
user="root"
passwd="123123aa"
dbname="eas_basis"

#导入sql文件到指定数据库
mysql -h$host -u$user -p$passwd $dbname < $sqlname

#ps:如果遇到无法执行的情况，记得`chmod 777 import.sh`给sh文件授权。