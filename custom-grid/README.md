# Custom CapabilityMatcher for Selenium Server
This project creates a custom Selenium Server jar, which overrides the standard
Selenium Server, and the DefaultCapabilityMatcher, to create a capability
matcher that is more compatible with Appium.

## How to generate the jar

From the `custom-grid` folder, run the following command:

    $ gradle jarItUp

It will be placed in the resources folder of the base directory

## How to start the grid

From the base project folder, run the following command:

    $ java -jar resources/custom-grid-1.0-SNAPSHOT.jar -role hub -hubConfig config/hubConfig.json

## Run the test 

  $ gradle test

