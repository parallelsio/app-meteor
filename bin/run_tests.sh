#!/bin/sh

SELENIUM_LOG=$(mktemp /tmp/selenium.XXXXXXXX)

grunt bgShell:resetdb

java -jar /Users/angelbalcarcel/dev/parallels_app/core-modules/bin/selenium-server-standalone-2.44.0.jar -Dwebdriver.chrome.driver=/Users/angelbalcarcel/dev/parallels_app/core-modules/bin/chromedriver > $SELENIUM_LOG 2>&1 &

# Start Meteor
METEOR_LOG=$(mktemp /tmp/meteor.startup.XXXXXXXX)
cd meteor-app
meteor run --settings settings.json > $METEOR_LOG 2>&1 &

# Wait for Meteor to finish booting
tail -f $METEOR_LOG | while read LOGLINE
do
   [[ "${LOGLINE}" == *"=> App running"* ]] && pkill -P $$ tail
done

# Running tests
grunt test

# Do some cleanup
kill $(jobs -p)
kill `ps ax | grep meteor | grep -v grep | awk '{print $1}'`
