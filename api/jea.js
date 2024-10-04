const Tiktok = require("tiktokapi-src");

exports.config = {
    name: 'tiktokdl',
    author: '',
    description: 'TikTok video downloader API',
    category: 'tools',
    usage: ['/tiktokdl?url=']
};

exports.initialize = async function ({ req, res }) {
    const { url } = req.query;

    // Validate the URL parameter
    if (!url) {
        return res.status(400).json({ status: 'error', message: 'URL parameter is required' });
    }

    try {
        // Fetch the TikTok download data
        const result = await Tiktok.Downloader(url, {
            version: "v3" // Specify the version, can be "v1", "v2", or "v3"
        });

        // Return success if result is found
        if (result) {
            res.json({
                status: 'success',
                result: {
                    type: result.type,
                    desc: result.desc,
                    author: {
                        avatar: result.author?.avatar,
                        nickname: result.author?.nickname
                    },
                    music: result.music,
                    images: result.images,
                    video1: result.video1,
                    video2: result.video2,
                    video_hd: result.video_hd,
                    video_watermark: result.video_watermark
                }
            });
        } else {
            // Handle when no result is found
            res.status(500).json({ status: 'error', message: 'Failed to fetch the video' });
        }
    } catch (error) {
        // Error handling with logging
        console.error('Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
            
