## What is it?
Use this script to trigger specific automation builds in [Travis CI](https://app.travis-ci.com/ "Travis CI"). As of now, it supports:
 - trigger regression automation from any specific project
 - trigger specific suites defined with "@". Eg. "@smoke"

## How to use it?
Here are a list of commands to use to trigger specific automation

- Run regression on specific project. **eg. Enrollment**
`node trigger-travis-automation.js project_name=enrollment`

- Run specific test automation suite. **eg. smoke suite**
`node trigger-travis-automation.js project_name=enrollment suite=smoke`

- Run regression from specific TestAutomation branch. **eg. release**
`node trigger-travis-automation.js project_name=enrollment auto_branch=release`

- Run regression against specific App branch. **eg. https://upgrade.unicityqa.com/CU-8677kd4dr/upgrade-with-product-data-testids/#/login**
`node trigger-travis-automation.js project_name=upgrade branch_url=CU-8677kd4dr/upgrade-with-product-data-testids`

### Requierment
* Correct env variables. You can find your token at: https://app.travis-ci.com/account/preferences
 
