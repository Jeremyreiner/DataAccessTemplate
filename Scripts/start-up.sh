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

sudo kill $(ps aux | grep 'Publify' | awk '{print $2}')

echo "killing all processes"

sudo kill $(ps aux | grep 'app.py' | awk '{print $2}')

echo "Starting Publify bitch"

cd /home/ubuntu/backend/

sudo nohup ./Publify&

echo "BACKEND STARTED"

cd /home/ubuntu/pdf-to-jpeg/flask_api/swagger_api

python3 -m venv venv

cd venv/bin

source activate

cd /home/ubuntu/pdf-to-jpeg/flask_api/swagger_api

sudo nohup python3 app.py&

echo "Python Started"

sudo systemctl restart nginx

echo "Restart Nginx"

#cd /opt/codedeploy-agent/deployment-root/5f3d33c7-b07e-404c-bfa2-36be9b23729c

#sudo rm -rfv *

echo "bro i deleted previos builds"
