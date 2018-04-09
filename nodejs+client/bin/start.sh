#!/usr/bin/env bash

# Node.js modules are built into image
# for some reason we want them in our 'app' folder
# Remove old copy of modules (from previous run) and
# copy current modules.
rm -rf $PROJECT_ROOT/node_modules
cp -a /tmp/app/node_modules $PROJECT_ROOT

# Cleanup logs
rm -rf /opt/app/pm2.log

# Actual start
command="pm2 start $PROJECT_ROOT/ecosystem.config.js --no-daemon"
echo "Running $command"
$command
