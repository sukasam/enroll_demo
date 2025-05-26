import httpTools from "Shared/httpTools";

const getPostData = (username, password, recaptcha) => {
    const envUrl = httpTools.envUrl();
    const data = {
        type: "base64",
        value: btoa(`${username}:${password}`),
        namespace: `${envUrl}/customers`
    };

    if (recaptcha) {
        data.recaptchaToken = recaptcha;
        data.recaptchaType = "invisible";
    }

    return data;
};
const getLoginToken = (username, password, recaptcha) => {
    const postData = getPostData(username, password, recaptcha);
    const req = {
        method: "POST",
        data: postData,
        headers: {},
        url: "/loginTokens",
        withAuth: false,
        logOptions: {
            requestName: "Get Login Token",
            error: true,
            functionName: "getLoginToken"
        },
        throwError: true
    };

    if (recaptcha) {
        req.headers["x-enable-recaptcha"] = "true";
    }

    return httpTools.sendRequest(req);
};

export default getLoginToken;
