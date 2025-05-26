class CurlHelper {
    constructor(request, pretty) {
        this.request = request;
        this.pretty = pretty;
    }

    getBody() {
        let data = this.request.data || "";
        if (typeof data === "object" || Array.isArray(data)) {
            data = this.pretty
                ? JSON.stringify(data, null, 4)
                : JSON.stringify(data);
        }
        return `--data-raw '${data}'`;
    }

    getDelimiter() {
        return this.pretty ? "\n" : " ";
    }

    getHeaders() {
        const headers = this.request.headers || {};
        const keys = Object.keys(headers);
        return keys.map(key => `--header "${key}: ${headers[key]}"`);
    }

    getMethod() {
        return `--request ${this.request.method.toUpperCase().trim()}`;
    }

    getUrl() {
        return this.request.url.trim();
    }

    toCurl() {
        const delimiter = this.getDelimiter();
        let response = `curl --location ${this.getMethod()} '${this.getUrl()}'`;
        const headers = this.getHeaders();
        if (headers.length) {
            response += delimiter;
            response += headers.join(delimiter);
        }
        if (this.request.data) {
            response += delimiter;
            response += this.getBody();
        }
        return response;
    }
}
export const stringify = ({ method, url, headers, data }, pretty = false) => {
    const curlHelper = new CurlHelper({ method, url, headers, data }, pretty);
    return curlHelper.toCurl();
};
export default {
    stringify
};
