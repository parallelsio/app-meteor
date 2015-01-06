#!/bin/sh

SELENIUM_LOG=$(mktemp /tmp/selenium.XXXXXXXX)
METEOR_LOG=$(mktemp /tmp/meteor.startup.XXXXXXXX)

echo "Starting Selenium server..."
node_modules/selenium-standalone/bin/start-selenium > $SELENIUM_LOG 2>&1 &

echo "Starting Meteor App with DB: mongodb://localhost:27017/parallels_test"
cd meteor-app
MONGO_URL="mongodb://localhost:27017/parallels_test" meteor run --settings settings.json > $METEOR_LOG 2>&1 &

# Wait for Meteor to finish booting
tail -f $METEOR_LOG | while read LOGLINE
do
   [[ "${LOGLINE}" == *"=> App running"* ]] && pkill -P $$ tail
done
cd ../

# Run integration tests
node node_modules/cucumber/bin/cucumber.js tests/features

# Do some cleanup
kill $(jobs -p)
