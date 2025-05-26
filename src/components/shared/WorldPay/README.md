# How WOLRD PAY works in the Confirm Page

Test Case Card Numbers can be found in this [URL](https://developerengine.fisglobal.com/apis/wpg/directintegration/cardinalsecuretest#testing)

Test case Card names can be found in this [URL](https://developerengine.fisglobal.com/apis/wpg/reference/testvalues)

## Translations

The Translations for the HTML Challenge model can not be controled. It comes direct from the card holders bank.

## Code outside the WorlPay folder

### WoldPay HTML wrapper

`src/pages/Confirm/Confirm.js`

The WorldPay component is a wrapper for the submit button. It will high jack and modify the function passed into the OnClick attribute of the chiledComponent. The Handle Submit button will work exactly as expected with the added features of WorldPay.

### Hook into submit button

`src/pages/Confirm/hooks.js`

1. Validate WOLRD PAY has returned a Session ID
2. If a Chalange HTML is returned from the Submit call prevent moving onto the next page

### Redirect

`src/routes.js`

-   when the rout is "WP_redirect" and is not the Iframe page, redirect to a component that will send a signal to close the Iframe to close. This way the main frame can pick up on the signal and close the Iframe.

### Turn On World Pay for a country

`src/constants/countries.js`

-   `{...useWorldPay: true,...}`
-   Add the useWorldPay to the country you want to turn on World Pay for.

### World Pay API Call

`src/services/ApiService/worldPay.js`

-   DDC API Call is the only additional API call getting made

### Google Analytics

`src/services/googleAnalytics/index.js`

`src/services/googleAnalytics/eventHandlers/confirm/place_worldpay_dialog_appears.js`

`src/services/googleAnalytics/eventHandlers/confirm/place_order_server_error.js`

`src/services/googleAnalytics/eventHandlers/confirm/place_order_server_error.js`

## World Pay Folder

`src/pages/Confirm/WorldPay/index.js`

-   Renders the approprate WorldPay components based on the WorldPay state
-   Renders the worldpay components if it should or not
-   Recives and saves the WorldPay Session ID
-   Handel the teporary feature flag

`src/pages/Confirm/WorldPay/featureFlag.js`

-   This is a temporary feature flag to turn on and off WorldPay

`src/pages/Confirm/WorldPay/ModifyChildrenSubmit.js`

-   Encapsulates the logic for the high jacking of the submit button.
-   Enjects the WorldPayDDC logic into the children OnClick function

`src/pages/Confirm/WorldPay/WorldPayChallengeModel.js`

-   Renders the Chalange Iframe
-   Recives the Chalange Iframe close signal
-   On Success will redirect to the congratulations page

`src/pages/Confirm/WorldPay/WorldPayDDC.js`

-   Handles the DDC API call and rendring the DDC Iframe
-   Returns the WP Session ID

`src/pages/Confirm/WorldPay/WorldPayRedirect.js`

-   Is used on the Routting page to send the signal to close the Chalange Iframe.

`public/index.html`

-   allow all `frame-src *`
-   This is done so any Bank form WorldPay challange can be rendered in the Iframe

# Testing World Pay

In side `src/pages/Confirm/WorldPay/WorldPayChallengeModel.js` there is a way to test the WorldPay Chalange Iframe Locally.

```
// ** manualTesting should always be false in production **
const manualTesting = false; // trigger manual testing for routting to success or failure
const testSuccess = true; // trigger success or failure for the route
```

To Explain what is going on with the 2 variables above:

1. Leaving `manualTesting` as False will test the Iframe up to the sending of the confermation code for the Challenge HTML. The Redirect will fail but you will see it work up to this point
1. To Get past the Redirect we will need to comment out the `srcDoc` and comment in the `src` in the Iframe. This will allow you to test the Redirect successfully but it will skip the challenge itself and thats ok. You can flip between succes and Failed by changing the `testSuccess` variable.

## What test data looks like

### Error Example

What a returned Failed case looks like
http://localhost:3000/#/WP_redirect?tppPayload=%7B%22eventDetails%22%3A%7B%22error%22%3A%7B%22error%22%3A402%2C%22error_code%22%3A%223009%22%2C%22error_message%22%3A%22We+failed+to+accept+the+credit+card+payment+for+the+following+reason%3A+%27Unable+to+complete+the+request.%27+Error+%23J3B3D%22%7D%7D%7D

```
    "eventDetails":
        "error":
            "error":402,
            "error_code":"3009",
            "error_message":"We failed to accept the credit card payment for the following reason: 'Unable to complete the request.' Error #J3B3D"
```

### Success Example

What a returned success looks like
http://localhost:3000/#/WP_redirect?tppPayload=%7B%22eventDetails%22%3A%7B%22href%22%3A%22https%3A%5C%2F%5C%2Fhydraqa.unicity.net%5C%2Fv5a-test%5C%2Forders%5C%2Fa4f0f50601652a6a1cc8eaab751dcb941dd9651838c71295bca03b227f75847b%22%2C%22id%22%3A%7B%22unicity%22%3A%2249-9402226%22%7D%7D%7D

```
    "eventDetails":
        "href": "https://hydraqa.unicity.net/v5a-test/orders/a4f0f50601652a6a1cc8eaab751dcb941dd9651838c71295bca03b227f75847b"
        "id":
        "unicity": "49-9402226"
```

### Test case 11

Failed Step up Authentication
2 parts are needed.

1. [Card Number](https://developerengine.fisglobal.com/apis/wpg/directintegration/cardinalsecuretest#testing) : `4000000000001109`
2. [Card Holder Name](https://developerengine.fisglobal.com/apis/wpg/reference/testvalues) : `REFUSED`

Card Number fails RDS on WorldPay side.
Card Holder Name fails the bank Authentication on WorldPay side.

## Test Case 10 With Cancel Button

Cancel button will result in a success response from WorldPay.
3D fails But WP BANK will Always Authenticate unless provided the REFUSE name.

To test the resut

1. [Card Number](https://developerengine.fisglobal.com/apis/wpg/directintegration/cardinalsecuretest#testing) : `4000000000001109`
2. [Card Holder Name](https://developerengine.fisglobal.com/apis/wpg/reference/testvalues) : `REFUSED`

### CSP frame-src error

keep manualTesting equal to false
To test the CSP frame-src error you can import the challange HTML into the `src/pages/Confirm/WorldPay/WorldPayChallengeModel.js` file.

```
import { challengeCSP } from "./testCaseChallengeCSP";
```

Then have the srcDoc = to the challengeCSP variable instead of the challengeHTML variable that was passed in.

```
srcDoc={manualTesting ? null : challengeCSP}
```

Results should be 500 is no CSP error is thrown. As this session recorded here has expired.
