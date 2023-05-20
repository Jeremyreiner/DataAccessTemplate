#! /usr/bin/bash

#!/bin/bash

if command -v javac >/dev/null 2>&1; then
  echo "Nice java is installed we are ready to continue"
else
  echo "Java JDK is not installed. Please install Java JDK you dick."
fi

sudo kill $(ps aux | grep 'Publify' | awk '{print $2}')

echo "killing all processes"

sudo kill $(ps aux | grep 'app.py' | awk '{print $2}')

echo "Starting Publify bitch"

cd /home/ubuntu/backend/

sudo nohup ./Publify&

cd /home/ubuntu/backend/pdf-to-jpg-project/'materials-flask-connexion-rest-part-1 (1)'/venv/bin

source activate

cd /home/ubuntu/backend/pdf-to-jpg-project/'materials-flask-connexion-rest-part-1 (1)'/rp_flask_api

nohup python3 app.py&

echo "Python Started"

sudo systemctl restart nginx

echo "Restart Nginx"
