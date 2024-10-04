const axios = require("axios");

exports.config = {
    name: 'tiktokdl',
    author: '',
    description: 'TikTok video downloader API',
    category: 'tools',
    usage: ['/tiktokdl?url=']
};

// Initialize function to set up the download endpoint
exports.initialize = async function ({ req, res }) {
    await exports.downloadTikTokVideo(req, res);
};

exports.downloadTikTokVideo = async (req, res) => {
    const { url } = req.query;

    console.log("TikTok Video Download Request URL:", url);

    if (!url) {
        console.log("TikTok URL not provided");
        return res.status(400).json({ status: false, message: "URL diperlukan" });
    }

    try {
        const response = await axios.get(
            process.env.TIKTOK_API_URL, // Assuming this is the correct endpoint for GET requests
            {
                params: {
                    id: url,
                    locale: "en",
                    tt: "RHJHcms_",
                },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
                },
            }
        );

        const html = response.data;

        // Extract download links and creator info using regex
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

        console.log("Download Links:", { downloadTiktokNowm, downloadTiktokMp3 });
        console.log("Creator Info:", {
            creatorProfileImg,
            creatorUsername,
            videoDescription,
        });

        if (!downloadTiktokNowm && !downloadTiktokMp3) {
            console.log("No download links found");
            return res.status(404).json({ status: false, message: "Gagal menemukan tautan unduhan" });
        }

        return res.status(200).json({
            status: true,
            message: "Tautan unduhan ditemukan",
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
            message: "Gagal mengunduh video",
            error: error.message,
        });
    }
};
