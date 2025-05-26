CI=true npm run test &&
npm run start:e2e &
npm run cacheserver &
wait-on http://localhost:80 &&
wait-on http://localhost:8000 && 
$(npm bin)/cypress run
retVal=$? &&
echo $retVal &&
if [ $retVal -ne 0 ]; then
body=$(cat  << EOF
{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Test failed, last message: *${TRAVIS_COMMIT_MESSAGE}*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Branch: *${TRAVIS_BRANCH}*"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Logs"
				},
				"url": "${TRAVIS_JOB_WEB_URL}"
			}
		}
	]
}
EOF
) &&
curl --header "Content-Type: application/json" \
--request POST \
--data "$body" \
$SLACK_NOTIFICATION
fi &&
$(exit $retVal)