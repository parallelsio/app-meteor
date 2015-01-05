#!/bin/sh

# Get current working dir
TARGET_FILE=`basename $0`

while [ -L "$TARGET_FILE" ]
do
    TARGET_FILE=`readlink $TARGET_FILE`
    cd `dirname $TARGET_FILE`
    TARGET_FILE=`basename $TARGET_FILE`
done
BASE_DIR=`pwd -P`

SELENIUM_LOG=$(mktemp /tmp/selenium.XXXXXXXX)
METEOR_LOG=$(mktemp /tmp/meteor.startup.XXXXXXXX)

grunt bgShell:resetdb

# Start Selenium server
java -jar $BASE_DIR/lib/selenium-server-standalone-2.44.0.jar -Dwebdriver.chrome.driver=$BASE_DIR/lib/chromedriver > $SELENIUM_LOG 2>&1 &

# Start Meteor
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
