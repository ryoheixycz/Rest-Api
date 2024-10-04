const axios = require("axios");

exports.config = {
    name: 'tiktokdl',
    author: 'Wataru Ajiro',
    description: 'TikTok video downloader API',
    category: 'tools',
    usage: ['/tiktokdl?url=']
};

// Initialize function to handle the API request
exports.initialize = async function ({ req, res }) {
    await exports.downloadTikTokVideo(req, res);
};

// Main function to download TikTok video
exports.downloadTikTokVideo = async (req, res) => {
    const { url } = req.query;

    console.log("TikTok Video Download Request URL:", url);

    // Check if URL is provided
    if (!url) {
        console.log("TikTok URL not provided");
        return res.status(400).json({ status: false, message: "URL is required" });
    }

    try {
        // Call external TikTok API to retrieve download information
        const response = await axios.post(
            process.env.TIKTOK_API_URL, // Ensure TIKTOK_API_URL is set in environment variables
            new URLSearchParams({
                id: url,
                locale: "en",
                tt: "RHJHcms_", // This may need to be dynamic
            }).toString(),
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            }
        );

        const html = response.data;

        // Extract download links and creator info using regex patterns
        const nowmMatch = html.match(
            /<a href="(https:\/\/tikcdn\.io\/ssstik\/[^"]+)"[^>]*without_watermark[^>]*>/
        );
        const downloadTiktokNowm = nowmMatch ? nowmMatch[1] : null;

        const mp3Match = html.match(
            /<a href="(https:\/\/tikcdn\.io\/ssstik\/[^"]+)"[^>]*music[^>]*>/
        );
        const downloadTiktokMp3 = mp3Match ? mp3Match[1] : null;

        const imgMatch = html.match(
            /<img class="result_author" src="([^"]+)" alt="([^"]+)">/
        );
        const creatorProfileImg = imgMatch ? imgMatch[1] : null;
        const creatorUsername = imgMatch ? imgMatch[2] : null;

        const descriptionMatch = html.match(/<p class="maintext">([^<]+)<\/p>/);
        const videoDescription = descriptionMatch ? descriptionMatch[1] : null;

        // Logging extracted download links and creator information
        console.log("Download Links:", { downloadTiktokNowm, downloadTiktokMp3 });
        console.log("Creator Info:", {
            creatorProfileImg,
            creatorUsername,
            videoDescription,
        });

        // Check if download links are available
        if (!downloadTiktokNowm && !downloadTiktokMp3) {
            console.log("No download links found");
            return res.status(404).json({ status: false, message: "Failed to find download links" });
        }

        // Send success response with download links and creator info
        return res.status(200).json({
            status: true,
            message: "Download links found",
            data: [
                {
                    downloadTiktokNowm,
                    downloadTiktokMp3,
                    creatorProfileImg,
                    creatorUsername,
                    videoDescription,
                },
            ],
        });
    } catch (error) {
        console.error("Error downloading TikTok video:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to download video",
            error: error.message,
        });
    }
};
