const challengeCSP = `
<!DOCTYPE html>
<html>

<head>
    <title>Cruise API - Step Up</title>

    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .hide {
            display: none;
        }

        #stepUpView {
            width: 100%;
            height: 100%
        }

        #stepUpView iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        #loadingImage {
            height: 30px;
            width: 30px;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transform: -webkit-translate(-50%, -50%);
            transform: -moz-translate(-50%, -50%);
            transform: -ms-translate(-50%, -50%);
        }

        .outOfview{
            position: absolute;
            left: -2000px;
            top: -2000px;
        }
    </style>
</head>

<body>

<div id="stepUpView"></div>

<div class="hide">
    <input id="acsUrl" name="acsUrl" value="https://mastercardidentitycheck.sparkassen-kreditkarten.de/challengeRequestBrowser" type="hidden"/>
    <input id="payload" name="payload" value="eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMi4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJiZGI4YzI1NS1iZjc3LTQ2YmYtODBjOS0zZDVkOGQwNGFkODgiLCJhY3NUcmFuc0lEIjoiNzA2ODNmNDgtMDA3MC00NDlhLWJhMTUtMTE1YTlkMGY3MGNjIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0" type="hidden"/>
    <input id="mcsId" name="mcsId" value="MF8xMmVjYzk4My02OWZhLTRhNTAtYmE4ZS1iNDhmMDA5NDQ5NTc" type="hidden"/>
    <input id="termUrl" name="termUrl" value="https://centinelapi.cardinalcommerce.com/V1/TermURL/Overlay/CCA" type="hidden"/>
    <input id="threeDSVersion" name="threeDSVersion" value="2" type="hidden"/>
    <input id="baseUrl" name="baseUrl" value="https://centinelapi.cardinalcommerce.com" type="hidden"/>
    <input id="orgUnitId" name="orgUnitId" value="64c35c4fe8299219c1bdc05f" type="hidden"/>
    <input id="transactionId" name="transactionId" value="fmW7BfAgSwkCD1zBnP40" type="hidden"/>
    <input id="isPostMessageEventsEnabled" name="isPostMessageEventsEnabled" value="false" type="hidden"/>
</div>

<div class="hide">
    <form id="redirect" method="POST" action="https://centinelapi.cardinalcommerce.com/V1/Cruise/TermRedirection">
        <input type="hidden" name="McsId" id="redirect-mcsId" value="0_12ecc983-69fa-4a50-ba8e-b48f00944957"/>
        <input type="hidden" name="CardinalJWT" id="CardinalJWT"/>
        <input type="hidden" name="Error" id="Error"/>
    </form>
</div>

  <script src="https://centinelapi.cardinalcommerce.com/javascript/vendors.0794a133ec351116ee40.js"></script>
  <script src="https://centinelapi.cardinalcommerce.com/javascript/stepUp.e327e52d1f61c8e6cc84.js"></script>
<script>
    window.onload = function () {
        try {
            if (window.CruiseAPI !== undefined) {
                var configuration = {
                    acsUrl: document.getElementById('acsUrl').value,
                    baseUrl: document.getElementById('baseUrl').value,
                    encodedMcsId: document.getElementById('mcsId').value,
                    mcsId: document.getElementById('redirect-mcsId').value,
                    orgUnitId: document.getElementById('orgUnitId').value,
                    payload: document.getElementById('payload').value,
                    termUrl: document.getElementById('termUrl').value,
                    threeDSVersion: document.getElementById('threeDSVersion').value,
                    transactionId: document.getElementById('transactionId').value,
                    isPostMessageEventsEnabled: document.getElementById('isPostMessageEventsEnabled').value,
                };

                CruiseAPI.stepUp.run(configuration)
            } else {
                console.error('Global not found, unable to complete step up');
                document.getElementById("Error").value = "JS Global not found";
                document.getElementById("redirect").submit();
            }
        }catch(error) {
            if(window.CruiseAPI !== undefined){
                CruiseAPI.stepUp.handleError(error.message);
            } else {
                console.error(error);
            }
        }
    }
</script>
</body>

</html>`;

export default challengeCSP;
