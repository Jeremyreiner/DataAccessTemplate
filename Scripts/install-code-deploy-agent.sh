#! /usr/bin/bash

#!/bin/bash

echo "installing code deploy agent"

sudo apt update
sudo apt install ruby-full
sudo apt install wget
cd /home/ubuntu
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto > /tmp/logfile
sudo service codedeploy-agent status
sudo service codedeploy-agent restart

echo "installed code deploy agent"