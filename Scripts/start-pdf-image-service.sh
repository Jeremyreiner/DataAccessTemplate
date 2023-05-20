#! /usr/bin/bash

#!/bin/bash

if command -v javac >/dev/null 2>&1; then
  echo "Nice java is installed we are ready to continue"
else
  echo "Java JDK is not installed. Please install Java JDK you dick."
  echo "like this"
  echo "sudo apt update"
  echo "sudo apt install default-jdk"
fi

cd /home/ubuntu/pdf-to-image/flask_api/swagger_api

python3 -m venv venv

cd venv/bin

source activate

cd /home/ubuntu/pdf-to-image/flask_api/swagger_api

sudo nohup python3 app.py&

echo "Python Started"

sudo systemctl restart nginx

echo "Restart Nginx"



