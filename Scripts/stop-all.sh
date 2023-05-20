#! /usr/bin/bash

#!/bin/bash

sudo kill $(ps aux | grep 'Publify' | awk '{print $2}')

sudo kill $(ps aux | grep 'app.py' | awk '{print $2}')

echo "killing all processes"