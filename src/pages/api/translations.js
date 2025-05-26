export default async function handler(req, res) {
    const { country = "US", language = "en" } = req.query;
    const subBucket =
        process.env.NEXT_PUBLIC_APP_ENV === "production" ? "" : "/qa";
    const apiUrl = `https://cdn.unicity.com/translations${subBucket}/enroll/${language}-${country}.json`;

    try {
        const externalResponse = await fetch(apiUrl, {
            headers: {
                "Accept-Language": `${language}-${country}`
            }
        });

        if (!externalResponse.ok) {
            throw new Error(
                `Failed to fetch data: ${externalResponse.statusText}`
            );
        }

        const data = await externalResponse.json();

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch translations" });
    }
}
