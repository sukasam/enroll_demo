import httpTools from "Shared/httpTools.js";

const checkEmailExist = async ({ email }) => {
    try {
        const req = {
            method: "HEAD",
            url: `/customers?email=${encodeURIComponent(email)}`,
            withAuth: false,
            returnType: "response"
        };

        const response = await httpTools.sendRequest(req);
        return { status: response.status, exists: response.status !== 404 };
    } catch (error) {
        // Handle network errors and 404s silently as they indicate email doesn't exist
        if (
            error.message?.includes("ERR_ABORTED") ||
            error.message?.includes("404") ||
            error.response?.status === 404
        ) {
            return { status: 404, exists: false };
        }

        // Only log unexpected errors
        if (!error.message?.includes("404")) {
            console.error("Unexpected email check error:", error);
        }

        // For other errors, throw them to be handled by the caller
        throw error;
    }
};

export default checkEmailExist;
