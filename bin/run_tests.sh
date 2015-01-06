#!/bin/sh

SELENIUM_LOG=$(mktemp /tmp/selenium.XXXXXXXX)

if [[ $* == *--headless* ]]
then
  echo "Starting Selenium headless server..."
  xvfb-run --server-args="-screen 0, 1366x768x24" node_modules/selenium-standalone/bin/start-selenium > $SELENIUM_LOG 2>&1 &
else
  echo "Starting Selenium server..."
  node_modules/selenium-standalone/bin/start-selenium > $SELENIUM_LOG 2>&1 &
fi

echo "Starting Meteor App with DB: mongodb://localhost:27017/parallels_test"
cd meteor-app
MONGO_URL="mongodb://localhost:27017/parallels_test" meteor run --settings settings.json > /dev/null 2>&1 &
cd ..

sleep 3

# Run integration tests
node node_modules/cucumber/bin/cucumber.js tests/features

# Do some cleanup
kill $(jobs -p)
